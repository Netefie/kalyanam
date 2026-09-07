// End-to-end smoke test for booking correctness and availability, run
// against a live backend (same conventions as test-payment-flow.mjs: real
// HTTP, a signed webhook for anything that needs a "payment captured"
// event, direct DB access only to simulate what the sweeper/clock would
// otherwise do). Covers what test-payment-flow.mjs doesn't: the inventory
// race fix, stay-date/occupancy validation, the paid-after-expiry
// reconciliation, the status lifecycle, RoomBlocks, and guest self-cancel.
//
// Usage:
//   npm run dev                          # in one terminal
//   node scripts/test-booking-flow.mjs   # in another
//
// Exits non-zero on any failed assertion so it's CI-friendly.
import crypto from "crypto";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { Booking } from "../src/models/Booking.js";

dotenv.config();

const BASE = process.env.TEST_API_URL || "http://localhost:5055";
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@kalyanam.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "Kalyanam@346";

let pass = 0;
let fail = 0;
const failures = [];

function assert(condition, label, detail) {
  if (condition) {
    pass++;
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
  } else {
    fail++;
    failures.push(label);
    console.log(`  \x1b[31m✗\x1b[0m ${label}${detail ? ` — ${JSON.stringify(detail)}` : ""}`);
  }
}

async function api(path, { method, body, token, raw, headers = {} } = {}) {
  const opts = { method: method || (body !== undefined || raw !== undefined ? "POST" : "GET"), headers: { ...headers } };
  if (raw) {
    opts.body = raw;
    opts.headers["Content-Type"] = "application/json";
  } else if (body !== undefined) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  }
  if (token) opts.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

function signWebhook(rawBody) {
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
}

// Fires a signed payment.captured event for an order, the same way
// Razorpay's real webhook would — the handler trusts the signature over the
// raw body, not a re-fetch from Razorpay, so this exercises the exact
// production code path (services/paymentReconciler.js#applyPaymentSuccess)
// without needing a real card-tested payment.
async function captureViaWebhook(orderId, amountPaise) {
  const payload = {
    entity: "event",
    event: "payment.captured",
    contains: ["payment"],
    payload: {
      payment: {
        entity: {
          id: `pay_SMOKE${Date.now()}${Math.random().toString(36).slice(2, 6)}`,
          entity: "payment",
          amount: amountPaise,
          currency: "INR",
          status: "captured",
          order_id: orderId,
          method: "card",
          card: { last4: "1111", network: "Visa" },
        },
      },
    },
    created_at: Math.floor(Date.now() / 1000),
  };
  const raw = JSON.stringify(payload);
  const sig = signWebhook(raw);
  return api("/api/payments/webhook", { raw, headers: { "x-razorpay-signature": sig } });
}

function futureDates(daysFromNow, nights) {
  const inD = new Date(Date.now() + daysFromNow * 86400000);
  const outD = new Date(inD.getTime() + nights * 86400000);
  return { checkIn: inD.toISOString().slice(0, 10), checkOut: outD.toISOString().slice(0, 10) };
}

const guest = () => ({
  firstName: "Flow",
  lastName: "Test",
  email: `flow.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`,
  phone: "9876500000",
});

async function main() {
  console.log(`\nRunning booking-flow smoke test against ${BASE}\n`);

  await connectDB();

  let adminToken;
  {
    const { status, data } = await api("/api/auth/login", {
      method: "POST",
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    assert(status === 200 && data?.token, "admin login succeeds", data);
    adminToken = data?.token;
  }

  const rooms = await api("/api/rooms?all=true", { token: adminToken }).then((r) => r.data);
  const luxurySuite = rooms.find((r) => r.slug === "luxury-suite"); // seeded with 6 total, maxGuests 4
  const deluxe = rooms.find((r) => r.slug === "deluxe-room"); // seeded with 12 total

  // 1. Stay validation rejections ------------------------------------------
  console.log("1. Stay validation rejections");
  {
    const past = { checkIn: "2020-01-01", checkOut: "2020-01-03" };
    const { status: pastStatus } = await api("/api/bookings/quote", {
      body: { roomSlug: "luxury-suite", ...past, rooms: 1 },
    });
    assert(pastStatus === 400, "past check-in → 400", { pastStatus });

    const tooLong = futureDates(70, 60); // beyond BOOKING_MAX_NIGHTS default (30)
    const { status: longStatus } = await api("/api/bookings/quote", {
      body: { roomSlug: "luxury-suite", ...tooLong, rooms: 1 },
    });
    assert(longStatus === 400, "stay beyond max nights → 400", { longStatus });

    const dates = futureDates(75, 2);
    const { status: capacityStatus, data: capacityData } = await api("/api/bookings/quote", {
      body: { roomSlug: "luxury-suite", ...dates, rooms: 1, adults: luxurySuite.maxGuests + 1 },
    });
    assert(capacityStatus === 400, "party exceeds room capacity → 400", capacityData);

    const { status: overCapStatus } = await api("/api/bookings", {
      method: "POST",
      token: adminToken,
      body: { guest: guest(), roomSlug: "deluxe-room", ...dates, adults: 1, rooms: 999 },
    });
    assert(overCapStatus === 400, "rooms beyond the per-booking cap → 400", { overCapStatus });

    // Deactivate a room, confirm the public path rejects it while admin
    // create still allows it.
    await api(`/api/rooms/${deluxe._id}`, { method: "PUT", token: adminToken, body: { active: false } });
    const { status: inactiveStatus } = await api("/api/bookings/quote", {
      body: { roomSlug: "deluxe-room", ...dates, rooms: 1 },
    });
    assert(inactiveStatus === 404, "inactive room rejected on the public path → 404", { inactiveStatus });

    const { status: adminInactiveStatus, data: adminInactiveData } = await api("/api/bookings", {
      method: "POST",
      token: adminToken,
      body: { guest: guest(), roomSlug: "deluxe-room", ...dates, adults: 1, rooms: 1 },
    });
    assert(adminInactiveStatus === 201, "admin create still allows an inactive room", adminInactiveData);
    await api(`/api/rooms/${deluxe._id}`, { method: "PUT", token: adminToken, body: { active: true } });
  }

  // 2. Timezone normalization ------------------------------------------------
  console.log("\n2. Timezone normalization");
  {
    const dates = futureDates(80, 2);
    const { data: created } = await api("/api/bookings", {
      method: "POST",
      token: adminToken,
      body: { guest: guest(), roomSlug: "super-deluxe-room", ...dates, adults: 1, rooms: 3 },
    });
    assert(created?.status === "Confirmed", "booked with a bare date string", created);

    // Same nights, sent as full ISO timestamps at IST-local midnight — must
    // collide with the booking above despite the different literal instant.
    const inIst = new Date(`${dates.checkIn}T00:00:00+05:30`).toISOString();
    const outIst = new Date(`${dates.checkOut}T00:00:00+05:30`).toISOString();
    const { data: avail } = await api(
      `/api/rooms/availability?checkIn=${encodeURIComponent(inIst)}&checkOut=${encodeURIComponent(outIst)}`
    );
    assert(
      avail?.rooms?.["super-deluxe-room"]?.booked === 3,
      "an IST-local-midnight ISO query sees the bare-date booking as booked",
      avail?.rooms?.["super-deluxe-room"]
    );
  }

  // 3. Concurrent overbooking race ------------------------------------------
  console.log("\n3. Concurrent overbooking race");
  {
    const dates = futureDates(85, 2); // luxury-suite: 6 total, all free here
    const attempts = Array.from({ length: 8 }, (_, i) =>
      api("/api/bookings", {
        method: "POST",
        token: adminToken,
        body: { guest: guest(), roomSlug: "luxury-suite", ...dates, adults: 1, rooms: 1 },
      })
    );
    const results = await Promise.all(attempts);
    const created = results.filter((r) => r.status === 201);
    const conflicted = results.filter((r) => r.status === 409);
    assert(created.length === 6, "exactly 6 of 8 concurrent single-room requests succeed", {
      created: created.length,
    });
    assert(conflicted.length === 2, "the rest lose the race with 409, not a 500 or a phantom success", {
      conflicted: conflicted.length,
    });

    const { data: avail } = await api(
      `/api/rooms/luxury-suite/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(avail.booked === 6 && avail.available === 0, "committed inventory is exactly at capacity, not over", avail);
  }

  // 4. Paid-after-expiry reconciliation --------------------------------------
  console.log("\n4. Paid-after-expiry reconciliation");
  if (!WEBHOOK_SECRET) {
    console.log("  (skipped — RAZORPAY_WEBHOOK_SECRET not set)");
  } else {
    // Case A: hold lapsed, but the room is still free — capture should
    // revive the booking to Confirmed.
    {
      const dates = futureDates(90, 2);
      const { data: order } = await api("/api/payments/order", {
        body: { guest: guest(), roomSlug: "deluxe-room", ...dates, adults: 1, children: 0, rooms: 1 },
      });

      // Simulate what services/bookingSweeper.js does once the hold's time
      // passes, without waiting on its interval.
      await Booking.updateOne({ _id: order.booking._id }, { $set: { status: "Expired" } });

      const { status: webhookStatus } = await captureViaWebhook(order.order.id, order.order.amount);
      assert(webhookStatus === 200, "webhook accepted for the now-Expired booking", { webhookStatus });

      const revived = await Booking.findById(order.booking._id).lean();
      assert(revived.status === "Confirmed", "still-free room revives Expired → Confirmed", {
        status: revived.status,
      });
      assert(revived.payment.status === "paid", "payment recorded as paid", revived.payment.status);
      assert(!revived.notifications?.needsAttentionAt, "not flagged for attention — nothing to reconcile", revived.notifications);
    }

    // Case B: hold lapsed AND the room sold out in the meantime — capture
    // must NOT resurrect a stay the hotel can't give; the payment stays
    // recorded, the booking stays cancelled, and it's flagged for staff.
    {
      const dates = futureDates(95, 2);
      const { data: order } = await api("/api/payments/order", {
        body: { guest: guest(), roomSlug: "luxury-suite", ...dates, adults: 1, children: 0, rooms: 1 },
      });

      await Booking.updateOne({ _id: order.booking._id }, { $set: { status: "Expired" } });

      // Sell out every remaining room for the same dates via admin (offline)
      // bookings before the late capture arrives.
      const { data: avail } = await api(
        `/api/rooms/luxury-suite/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
      );
      let toSell = avail.available;
      while (toSell > 0) {
        const take = Math.min(5, toSell);
        await api("/api/bookings", {
          method: "POST",
          token: adminToken,
          body: { guest: guest(), roomSlug: "luxury-suite", ...dates, adults: 1, rooms: take },
        });
        toSell -= take;
      }

      const { status: webhookStatus } = await captureViaWebhook(order.order.id, order.order.amount);
      assert(webhookStatus === 200, "webhook still accepted (200) even though the room is gone", { webhookStatus });

      const stranded = await Booking.findById(order.booking._id).lean();
      assert(stranded.status === "Cancelled", "sold-out room stays Cancelled, not silently Confirmed", {
        status: stranded.status,
      });
      assert(stranded.payment.status === "paid", "the captured payment is still recorded, not dropped", stranded.payment.status);
      assert(Boolean(stranded.notifications?.needsAttentionAt), "flagged with needsAttentionAt for a staff refund decision", stranded.notifications);
    }
  }

  // 5. Status lifecycle -------------------------------------------------------
  console.log("\n5. Status lifecycle");
  {
    const dates = futureDates(100, 2);
    const { data: booking } = await api("/api/bookings", {
      method: "POST",
      token: adminToken,
      body: { guest: guest(), roomSlug: "deluxe-room", ...dates, adults: 1, rooms: 1 },
    });
    assert(booking?.status === "Confirmed", "admin booking starts Confirmed/paid", booking);

    const { status: illegalStatus } = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "CheckedOut" },
    });
    assert(illegalStatus === 409, "Confirmed → CheckedOut directly is rejected", { illegalStatus });

    const { status: plainCancelStatus, data: plainCancelData } = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "Cancelled" },
    });
    assert(
      plainCancelStatus === 400,
      "a plain status PATCH to Cancelled is refused — must use the cancel action",
      plainCancelData
    );

    const noRefund = await api(`/api/bookings/${booking._id}/cancel`, { method: "POST", token: adminToken, body: {} });
    assert(
      noRefund.status === 400,
      "cancelling a booking with captured money requires a refund decision",
      noRefund.data
    );

    const { data: checkedIn } = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "CheckedIn" },
    });
    assert(Boolean(checkedIn?.checkedInAt), "check-in stamps checkedInAt", checkedIn);

    const { data: checkedOut } = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "CheckedOut" },
    });
    assert(Boolean(checkedOut?.checkedOutAt), "check-out stamps checkedOutAt", checkedOut);

    const { status: terminalStatus } = await api(`/api/bookings/${booking._id}/status`, {
      method: "PATCH",
      token: adminToken,
      body: { status: "Confirmed" },
    });
    assert(terminalStatus === 409, "CheckedOut is terminal — no further status move is allowed", { terminalStatus });

    const del = await api(`/api/bookings/${booking._id}`, { method: "DELETE", token: adminToken });
    assert(del.status === 400, "delete is refused while captured money is unaccounted for", del.data);
  }

  // 6. RoomBlocks ---------------------------------------------------------------
  console.log("\n6. RoomBlocks");
  {
    const dates = futureDates(110, 3);
    const { data: before } = await api(
      `/api/rooms/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(before.rooms["deluxe-room"].blocked === 0, "no blocks yet", before.rooms["deluxe-room"]);

    const { data: block, status: blockStatus } = await api("/api/room-blocks", {
      method: "POST",
      token: adminToken,
      body: { roomType: deluxe._id, from: dates.checkIn, to: dates.checkOut, rooms: deluxe.totalRooms, reason: "smoke test" },
    });
    assert(blockStatus === 201, "room block created", { blockStatus });

    const { data: duringBlock } = await api(
      `/api/rooms/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(duringBlock.rooms["deluxe-room"].available === 0, "a full block zeroes out availability", duringBlock.rooms["deluxe-room"]);

    const { status: blockedBookingStatus } = await api("/api/bookings", {
      method: "POST",
      token: adminToken,
      body: { guest: guest(), roomSlug: "deluxe-room", ...dates, adults: 1, rooms: 1 },
    });
    assert(blockedBookingStatus === 409, "booking during a full block is rejected", { blockedBookingStatus });

    await api(`/api/room-blocks/${block._id}`, { method: "DELETE", token: adminToken });
    const { data: afterBlock } = await api(
      `/api/rooms/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(afterBlock.rooms["deluxe-room"].available === deluxe.totalRooms, "removing the block restores full availability", afterBlock.rooms["deluxe-room"]);
  }

  // 7. Guest self-service cancel ------------------------------------------------
  console.log("\n7. Guest self-service cancel");
  {
    const dates = futureDates(120, 2);
    const g = guest();
    const { data: order } = await api("/api/payments/order", {
      body: { guest: g, roomSlug: "deluxe-room", ...dates, adults: 1, children: 0, rooms: 1 },
    });

    const wrongEmail = await api("/api/bookings/cancel", {
      body: { code: order.booking.bookingCode, email: "someone-else@example.com" },
    });
    assert(wrongEmail.status === 404, "wrong email can't cancel someone else's booking", wrongEmail.data);

    // Still Pending/unpaid — cancellable with no refund decision needed.
    const cancelled = await api("/api/bookings/cancel", {
      body: { code: order.booking.bookingCode, email: g.email },
    });
    assert(cancelled.status === 200 && cancelled.data?.status === "Cancelled", "guest cancels their own unpaid hold", cancelled.data);

    const { data: freed } = await api(
      `/api/rooms/deluxe-room/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    // The cancelled booking no longer holds inventory (Cancelled isn't a
    // holding status — see services/availability.js).
    assert(freed.available === freed.total, "cancelling frees the held room back to full availability", freed);

    const idempotent = await api("/api/bookings/cancel", {
      body: { code: order.booking.bookingCode, email: g.email },
    });
    assert(idempotent.status === 200, "re-cancelling an already-cancelled booking is a no-op, not an error", idempotent.data);
  }

  // ------------------------------------------------------------------------
  await disconnectDB();
  console.log(`\n${pass} passed, ${fail} failed\n`);
  if (fail > 0) {
    console.log("Failed checks:", failures.join(", "));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
