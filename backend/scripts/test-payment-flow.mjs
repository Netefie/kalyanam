// End-to-end smoke test for the Razorpay payment flow, run against a live
// backend + the real Razorpay TEST-mode API (no mocking — this is the same
// HTTP surface a browser or Razorpay's own webhook would hit).
//
// Usage:
//   npm run dev                     # in one terminal
//   node scripts/test-payment-flow.mjs   # in another
//
// Exits non-zero on any failed assertion so it's CI-friendly.
import crypto from "crypto";
import dotenv from "dotenv";
import { connectDB, disconnectDB } from "../src/config/db.js";
import { Booking } from "../src/models/Booking.js";
import { sweepExpiredHolds } from "../src/services/bookingSweeper.js";

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

function futureDates(daysFromNow, nights) {
  const inD = new Date(Date.now() + daysFromNow * 86400000);
  const outD = new Date(inD.getTime() + nights * 86400000);
  return { checkIn: inD.toISOString().slice(0, 10), checkOut: outD.toISOString().slice(0, 10) };
}

const guest = () => ({
  firstName: "Smoke",
  lastName: "Test",
  email: `smoke.${Date.now()}.${Math.random().toString(36).slice(2, 6)}@example.com`,
  phone: "9876500000",
});

async function main() {
  console.log(`\nRunning payment-flow smoke test against ${BASE}\n`);

  // 1. Health + Razorpay reachability -----------------------------------
  console.log("1. Health");
  {
    const { status, data } = await api("/health");
    assert(status === 200 && data?.status === "ok", "GET /health → 200 ok");
  }

  // 2. Quote endpoint pricing math ---------------------------------------
  console.log("\n2. Quote pricing");
  let adminToken;
  {
    const { status, data } = await api("/api/auth/login", {
      method: "POST",
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    assert(status === 200 && data?.token, "admin login succeeds", data);
    adminToken = data?.token;
  }

  const { checkIn, checkOut } = futureDates(20, 2);
  let quote;
  {
    const { status, data } = await api("/api/bookings/quote", {
      method: "POST",
      body: { roomSlug: "deluxe-room", ratePlanCode: "room-only", checkIn, checkOut, rooms: 1 },
    });
    quote = data;
    assert(status === 200, "POST /bookings/quote → 200", data);
    assert(quote?.subtotal + quote?.taxAmount === quote?.total, "subtotal + tax === total", quote);
    assert(quote?.nights === 2, "nights computed correctly", quote);
  }

  // Tax rate sensitivity: flip Settings.taxPercent, re-quote, restore.
  {
    const before = await api("/api/settings");
    const originalTax = before.data.taxPercent;

    await api("/api/settings", { method: "PUT", token: adminToken, body: { taxPercent: 12 } });
    const { data: requoted } = await api("/api/bookings/quote", {
      method: "POST",
      body: { roomSlug: "deluxe-room", ratePlanCode: "room-only", checkIn, checkOut, rooms: 1 },
    });
    assert(requoted.taxPercent === 12, "quote reflects Settings.taxPercent = 12", requoted);
    assert(
      requoted.taxAmount === Math.round(requoted.subtotal * 0.12),
      "tax amount matches 12% of subtotal",
      requoted
    );

    await api("/api/settings", { method: "PUT", token: adminToken, body: { taxPercent: originalTax } });
  }

  // 3. Order creation ------------------------------------------------------
  console.log("\n3. Payment order creation");
  let booking, order;
  {
    const { status, data } = await api("/api/payments/order", {
      method: "POST",
      body: {
        guest: guest(),
        roomSlug: "deluxe-room",
        ratePlanCode: "room-only",
        checkIn,
        checkOut,
        adults: 2,
        children: 0,
        rooms: 1,
      },
    });
    booking = data?.booking;
    order = data?.order;
    assert(status === 201, "POST /payments/order → 201", data);
    assert(typeof order?.id === "string" && order.id.startsWith("order_"), "real Razorpay order id returned", order);
    assert(order?.amount === Math.round(booking.pricing.total * 100), "order.amount === total × 100", { order, total: booking?.pricing?.total });
    assert(booking?.status === "Pending" && booking?.payment?.status === "created", "booking starts Pending/created", booking);
  }

  // 4. Tampered signature rejected -----------------------------------------
  console.log("\n4. Tampered signature rejected");
  {
    const { status, data } = await api("/api/payments/verify", {
      method: "POST",
      body: {
        bookingId: booking._id,
        razorpay_order_id: order.id,
        razorpay_payment_id: "pay_FORGED",
        razorpay_signature: "0".repeat(64),
      },
    });
    assert(status === 400, "forged signature → 400", data);

    const { data: lookup } = await api(
      `/api/payments/lookup?code=${booking.bookingCode}&email=${encodeURIComponent(booking.guest.email)}`
    );
    assert(lookup?.status === "Pending" && lookup?.payment?.status === "created", "booking untouched after forged verify", lookup);
  }

  // 5. Happy path via signed webhook (no browser required) -----------------
  console.log("\n5. Signed webhook happy path");
  let webhookOk = Boolean(WEBHOOK_SECRET);
  if (!webhookOk) {
    console.log("  (skipped — RAZORPAY_WEBHOOK_SECRET not set)");
  } else {
    const fakePaymentId = `pay_SMOKE${Date.now()}`;
    const payload = {
      entity: "event",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: fakePaymentId,
            entity: "payment",
            amount: order.amount,
            currency: order.currency,
            status: "captured",
            order_id: order.id,
            method: "card",
            card: { last4: "1111", network: "Visa" },
          },
        },
      },
      created_at: Math.floor(Date.now() / 1000),
    };
    const raw = JSON.stringify(payload);
    const sig = signWebhook(raw);

    const { status } = await api("/api/payments/webhook", {
      raw,
      headers: { "x-razorpay-signature": sig },
    });
    assert(status === 200, "signed webhook → 200", { status });

    const { data: confirmed } = await api(
      `/api/payments/lookup?code=${booking.bookingCode}&email=${encodeURIComponent(booking.guest.email)}`
    );
    assert(confirmed?.status === "Confirmed", "booking flips to Confirmed", confirmed);
    assert(confirmed?.payment?.status === "paid", "payment.status flips to paid", confirmed);
    assert(confirmed?.payment?.paymentId === fakePaymentId, "payment id recorded", confirmed);
    assert(!confirmed?.holdExpiresAt, "hold cleared after payment", confirmed);

    // 6. Idempotency: replay the exact same webhook -----------------------
    console.log("\n6. Webhook idempotency");
    const { status: replayStatus } = await api("/api/payments/webhook", {
      raw,
      headers: { "x-razorpay-signature": sig },
    });
    assert(replayStatus === 200, "replayed webhook still → 200", { replayStatus });

    const { data: afterReplay } = await api(
      `/api/payments/lookup?code=${booking.bookingCode}&email=${encodeURIComponent(booking.guest.email)}`
    );
    assert(
      afterReplay?.payment?.paymentId === fakePaymentId && afterReplay?.status === "Confirmed",
      "replay is a no-op (same payment id, still Confirmed)",
      afterReplay
    );

    // Bad signature on this same payload must be rejected.
    const { status: badSigStatus } = await api("/api/payments/webhook", {
      raw,
      headers: { "x-razorpay-signature": "0".repeat(64) },
    });
    assert(badSigStatus === 400, "webhook with bad signature → 400", { badSigStatus });
  }

  // 7. Hold expiry sweep -----------------------------------------------------
  console.log("\n7. Hold expiry / availability release");
  await connectDB();
  {
    const dates = futureDates(45, 1);
    const { data: orderData } = await api("/api/payments/order", {
      method: "POST",
      body: {
        guest: guest(),
        roomSlug: "super-deluxe-room",
        ratePlanCode: "room-only",
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        adults: 1,
        children: 0,
        rooms: 1,
      },
    });

    const { data: beforeExpiry } = await api(
      `/api/rooms/super-deluxe-room/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(beforeExpiry.available < beforeExpiry.total, "an active hold reduces availability", beforeExpiry);
    assert(Boolean(orderData?.booking?.holdExpiresAt), "booking carries a holdExpiresAt", orderData?.booking);

    // Force the hold into the past (what naturally happens after
    // BOOKING_HOLD_MINUTES) directly in Mongo, then run the exact sweep
    // services/bookingSweeper.js runs on its interval.
    await Booking.updateOne(
      { _id: orderData.booking._id },
      { $set: { holdExpiresAt: new Date(Date.now() - 1000) } }
    );

    const { data: duringExpiry } = await api(
      `/api/rooms/super-deluxe-room/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    assert(
      duringExpiry.available === duringExpiry.total,
      "availability releases the room the instant the hold lapses (before the sweep even runs)",
      duringExpiry
    );

    await sweepExpiredHolds();
    const swept = await Booking.findById(orderData.booking._id).lean();
    assert(swept.status === "Expired", "sweeper flips the lapsed booking to Expired", swept);
  }

  // 8. Overbooking guard -------------------------------------------------
  // Two independent guards, checked in order: a request beyond the site's
  // configured per-booking room cap (services/bookingRequest.js) is a 400 —
  // it's an invalid request regardless of what's in stock. A request within
  // that cap but beyond what's actually free for the dates is a 409 —
  // services/availability.js#reserveInventory, which is what actually
  // protects the physical inventory from being oversold.
  console.log("\n8. Overbooking guard");
  {
    const dates = futureDates(60, 1);
    const { data: roomAvail } = await api(
      `/api/rooms/deluxe-room/availability?checkIn=${dates.checkIn}&checkOut=${dates.checkOut}`
    );
    const beyondCap = roomAvail.total + 5;

    const capResult = await api("/api/payments/order", {
      method: "POST",
      body: {
        guest: guest(),
        roomSlug: "deluxe-room",
        ratePlanCode: "room-only",
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        adults: 1,
        children: 0,
        rooms: beyondCap,
      },
    });
    assert(
      capResult.status === 400,
      `requesting ${beyondCap} rooms (beyond the per-booking cap) → 400`,
      capResult.data
    );

    // Now exhaust what's actually available in room-cap-sized bites, and
    // confirm the next request genuinely can't fit.
    let remaining = roomAvail.available;
    while (remaining > 0) {
      const take = Math.min(5, remaining);
      const { status, data } = await api("/api/payments/order", {
        method: "POST",
        body: {
          guest: guest(),
          roomSlug: "deluxe-room",
          ratePlanCode: "room-only",
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          adults: 1,
          children: 0,
          rooms: take,
        },
      });
      assert(status === 201, `booking ${take} of the remaining ${remaining} room(s) succeeds`, data);
      remaining -= take;
    }

    const { status, data } = await api("/api/payments/order", {
      method: "POST",
      body: {
        guest: guest(),
        roomSlug: "deluxe-room",
        ratePlanCode: "room-only",
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        adults: 1,
        children: 0,
        rooms: 1,
      },
    });
    assert(status === 409, "one more room once inventory is exhausted → 409", data);
  }

  // 9. Refund guards -------------------------------------------------------
  console.log("\n9. Refund guards");
  {
    // Unpaid booking: refund must be rejected.
    const dates = futureDates(70, 1);
    const { data: unpaidOrder } = await api("/api/payments/order", {
      method: "POST",
      body: {
        guest: guest(),
        roomSlug: "deluxe-room",
        ratePlanCode: "room-only",
        checkIn: dates.checkIn,
        checkOut: dates.checkOut,
        adults: 1,
        children: 0,
        rooms: 1,
      },
    });
    const { status: refundStatus, data: refundData } = await api(
      `/api/payments/${unpaidOrder.booking._id}/refund`,
      { method: "POST", token: adminToken, body: {} }
    );
    assert(refundStatus === 400, "refunding an unpaid booking → 400", refundData);

    // Over-refund on the webhook-confirmed booking from step 5/6.
    if (webhookOk) {
      const { status: overStatus, data: overData } = await api(
        `/api/payments/${booking._id}/refund`,
        { method: "POST", token: adminToken, body: { amount: 999999 } }
      );
      assert(overStatus === 400, "refund amount exceeding paid amount → 400", overData);
    }
  }

  // 10. Booking code uniqueness under concurrency ---------------------------
  console.log("\n10. Concurrent booking-code uniqueness");
  {
    const dates = futureDates(90, 1);
    const attempts = Array.from({ length: 20 }, (_, i) =>
      api("/api/payments/order", {
        method: "POST",
        body: {
          guest: guest(),
          roomSlug: "deluxe-room",
          ratePlanCode: "room-only",
          checkIn: dates.checkIn,
          checkOut: dates.checkOut,
          adults: 1,
          children: 0,
          rooms: 1,
        },
      })
    );
    const results = await Promise.all(attempts);
    const created = results.filter((r) => r.status === 201);
    const codes = new Set(created.map((r) => r.data.booking.bookingCode));
    assert(codes.size === created.length, `all ${created.length} concurrent bookings got distinct codes`, {
      created: created.length,
      distinct: codes.size,
    });
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
