// End-to-end test suite for the mail system — renders every registered
// template, exercises dedupe/retry/scheduler logic against the real
// MongoDB, and (optionally) delivers real mail through Gmail SMTP.
//
// Usage:
//   node scripts/test-mail.mjs              # safe default: no real sends
//   npm run dev                             # in another terminal, first
//   node scripts/test-mail.mjs --live       # also delivers all 14 templates
//                                            # for real, to MAIL_TEST_TO
//   node scripts/test-mail.mjs --live --to=someone@example.com
//
// The default run forces MAIL_DRY_RUN=true for everything except the SMTP
// verify() handshake (phase 1), which is a safe, read-only credential check
// that never sends a message — so it always runs for real, live or not.
// That keeps `node scripts/test-mail.mjs` CI-safe and non-spammy on its own,
// while --live proves actual Gmail delivery end to end.
//
// Every module that reads config/env.js is imported dynamically, *after*
// this file decides whether to force MAIL_DRY_RUN — a static top-level
// import would evaluate (and cache) env.js before that decision is made.
//
// Exits non-zero on any failed assertion so it's CI-friendly.
import dotenv from "dotenv";

dotenv.config();

const args = process.argv.slice(2);
const LIVE = args.includes("--live");
const toArg = args.find((a) => a.startsWith("--to="));

if (!LIVE) {
  process.env.MAIL_DRY_RUN = "true";
}

const BASE = process.env.TEST_API_URL || "http://localhost:5055";
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

async function api(path, { method, body, token } = {}) {
  const opts = { method: method || (body !== undefined ? "POST" : "GET"), headers: {} };
  if (body !== undefined) {
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

async function main() {
  console.log(`\nRunning mail-system test suite ${LIVE ? "(--live: real sends enabled)" : "(dry-run: no real sends)"}\n`);

  const { connectDB, disconnectDB } = await import("../src/config/db.js");
  const { env } = await import("../src/config/env.js");
  const { MailLog } = await import("../src/models/MailLog.js");
  const { Booking } = await import("../src/models/Booking.js");
  const { templates } = await import("../src/emails/templates/index.js");
  const { sendMail, retryMailLog, verifyTransport, drainMailQueue, isTransient } = await import(
    "../src/services/mailer.js"
  );
  const { runMailSweeps, sweepPreArrivalReminders, sweepPostStayThankYou, sweepHoldExpiringWarnings } = await import(
    "../src/services/mailScheduler.js"
  );

  const TEST_TO = toArg ? toArg.slice("--to=".length) : env.mail.testTo || env.mail.user;

  await connectDB();

  // 1. SMTP credential verification -----------------------------------------
  console.log("1. SMTP");
  {
    const ok = await verifyTransport();
    assert(ok, `SMTP handshake succeeds (${env.mail.host}:${env.mail.port} as ${env.mail.user})`);
  }

  // 2. Every registered template renders cleanly ----------------------------
  console.log("\n2. Template rendering");
  {
    const keys = Object.keys(templates);
    assert(keys.length === 14, `registry has 14 templates (found ${keys.length})`, keys);

    for (const [key, tpl] of Object.entries(templates)) {
      let subject, html, text;
      try {
        ({ subject, html, text } = tpl.build(tpl.sample()));
      } catch (err) {
        assert(false, `${key}: build() throws`, err.message);
        continue;
      }
      const leakPattern = /undefined|NaN|\[object Object\]/;
      assert(Boolean(subject), `${key}: non-empty subject`, subject);
      assert(html.includes("<!DOCTYPE html>"), `${key}: well-formed HTML document`);
      assert(Boolean(text), `${key}: non-empty plaintext body`);
      assert(!leakPattern.test(html), `${key}: no undefined/NaN/[object Object] leak in HTML`, html.match(leakPattern)?.[0]);
      assert(!leakPattern.test(text), `${key}: no undefined/NaN/[object Object] leak in text`, text.match(leakPattern)?.[0]);
      assert(!/&[a-zA-Z]+;/.test(text), `${key}: no un-decoded HTML entity in plaintext`, text.match(/&[a-zA-Z]+;/)?.[0]);
      assert(tpl.audience === "guest" || tpl.audience === "staff", `${key}: has a valid audience`, tpl.audience);
    }
  }

  // 3. Dedupe: same dedupeKey twice -> one row, one skip ---------------------
  console.log("\n3. Dedupe idempotency");
  {
    const key = `test-dedupe-${Date.now()}`;
    const first = await sendMail({
      template: "payment-failed",
      to: TEST_TO,
      data: templates["payment-failed"].sample(),
      dedupeKey: key,
    });
    const second = await sendMail({
      template: "payment-failed",
      to: TEST_TO,
      data: templates["payment-failed"].sample(),
      dedupeKey: key,
    });
    await drainMailQueue();

    assert(first.queued === true, "first send with a fresh dedupeKey is queued", first);
    assert(second.skipped === true, "second send with the same dedupeKey is skipped", second);

    const rows = await MailLog.find({ dedupeKey: key }).lean();
    assert(rows.length === 1, `exactly one MailLog row for dedupeKey (found ${rows.length})`);
    assert(["sent", "dry-run"].includes(rows[0]?.status), "the single row reached a terminal success status", rows[0]?.status);
  }

  // 4. Retry classification + the retry pathway ------------------------------
  console.log("\n4. Retry logic");
  {
    assert(isTransient({ code: "ETIMEDOUT" }) === true, "ETIMEDOUT is classified transient");
    assert(isTransient({ responseCode: 450 }) === true, "SMTP 450 is classified transient");
    assert(isTransient({ responseCode: 421 }) === true, "SMTP 421 is classified transient");
    assert(isTransient({ code: "EAUTH", responseCode: 535 }) === false, "EAUTH/535 (bad credentials) is NOT retried");
    assert(isTransient({ responseCode: 550 }) === false, "SMTP 550 (permanent reject) is NOT retried");
    assert(isTransient({ responseCode: 553 }) === false, "SMTP 553 (permanent reject) is NOT retried");

    // The admin "Retry" pathway: manufacture a failed row, retry it, confirm
    // it reaches a terminal success state and its attempt count increments.
    const row = await MailLog.create({
      template: "refund-processed",
      to: TEST_TO,
      subject: "[test-mail] retry pathway",
      html: "<p>retry pathway test</p>",
      text: "retry pathway test",
      status: "failed",
      lastError: "Simulated failure for test-mail.mjs",
      attempts: 1,
    });
    await retryMailLog(row._id);
    await drainMailQueue();
    const after = await MailLog.findById(row._id).lean();
    assert(["sent", "dry-run"].includes(after.status), "retried row reaches a terminal success status", after.status);
    assert(after.attempts > 1, "retry increments the attempt count", after.attempts);
    await MailLog.deleteOne({ _id: row._id });
  }

  // 5. Scheduler sweeps -------------------------------------------------------
  console.log("\n5. Lifecycle scheduler");
  {
    const HOUR = 60 * 60 * 1000;
    const MIN = 60 * 1000;
    const baseGuest = {
      firstName: "Sweep",
      lastName: "Test",
      email: TEST_TO,
      phone: "9876500000",
    };
    const baseBooking = {
      guest: baseGuest,
      roomName: "Test Room",
      ratePlanName: "Room Only",
      nights: 1,
      adults: 1,
      children: 0,
      rooms: 1,
      amount: 5000,
      pricing: { nightlyRate: 5000, subtotal: 5000, taxPercent: 0, taxAmount: 0, total: 5000, currency: "INR" },
      payment: { status: "created", currency: "INR" },
      source: "website",
    };

    const now = Date.now();
    const seeded = await Booking.create([
      {
        ...baseBooking,
        status: "Confirmed",
        payment: { ...baseBooking.payment, status: "paid" },
        checkIn: new Date(now + 48 * HOUR), // inside the 36-60h pre-arrival window
        checkOut: new Date(now + 72 * HOUR),
      },
      {
        ...baseBooking,
        status: "Confirmed",
        payment: { ...baseBooking.payment, status: "paid" },
        checkIn: new Date(now - 48 * HOUR),
        checkOut: new Date(now - 24 * HOUR), // inside the 12-48h post-stay window
      },
      {
        ...baseBooking,
        status: "Pending",
        payment: { ...baseBooking.payment, status: "created" },
        checkIn: new Date(now + 5 * 24 * HOUR),
        checkOut: new Date(now + 6 * 24 * HOUR),
        holdExpiresAt: new Date(now + 2 * MIN), // inside the 5-minute hold-expiring window
      },
      {
        // Control: checkIn far outside every window — must never be touched.
        ...baseBooking,
        status: "Confirmed",
        payment: { ...baseBooking.payment, status: "paid" },
        checkIn: new Date(now + 10 * 24 * HOUR),
        checkOut: new Date(now + 11 * 24 * HOUR),
      },
    ]);
    const [reminderBooking, postStayBooking, holdBooking, controlBooking] = seeded;

    const firstRun = await runMailSweeps();
    assert(firstRun.reminders >= 1, "pre-arrival sweep sends at least the seeded reminder", firstRun);
    assert(firstRun.postStay >= 1, "post-stay sweep sends at least the seeded thank-you", firstRun);
    assert(firstRun.holdExpiring >= 1, "hold-expiring sweep sends at least the seeded warning", firstRun);

    const [remindedAfter, postStayAfter, holdAfter, controlAfter] = await Promise.all([
      Booking.findById(reminderBooking._id).lean(),
      Booking.findById(postStayBooking._id).lean(),
      Booking.findById(holdBooking._id).lean(),
      Booking.findById(controlBooking._id).lean(),
    ]);
    assert(Boolean(remindedAfter.notifications?.reminderSentAt), "reminderSentAt is set on the seeded booking");
    assert(Boolean(postStayAfter.notifications?.postStaySentAt), "postStaySentAt is set on the seeded booking");
    assert(Boolean(holdAfter.notifications?.holdExpiringSentAt), "holdExpiringSentAt is set on the seeded booking");
    assert(
      !controlAfter.notifications?.reminderSentAt &&
        !controlAfter.notifications?.postStaySentAt &&
        !controlAfter.notifications?.holdExpiringSentAt,
      "a booking outside every window is untouched"
    );

    // Re-run: the send-once guards must stop every one of these from firing again.
    const secondRun = await Promise.all([
      sweepPreArrivalReminders(),
      sweepPostStayThankYou(),
      sweepHoldExpiringWarnings(),
    ]);
    assert(
      secondRun.every((n) => n === 0) || secondRun.reduce((a, b) => a + b, 0) === 0,
      "re-running the sweeps sends nothing further for the same bookings",
      secondRun
    );

    await drainMailQueue();
    await Booking.deleteMany({ _id: { $in: seeded.map((b) => b._id) } });
  }

  // 6. Live delivery ------------------------------------------------------------
  console.log(`\n6. Live delivery${LIVE ? "" : " (skipped — pass --live to run)"}`);
  if (LIVE) {
    const { status: loginStatus, data: loginData } = await api("/api/auth/login", {
      body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    assert(loginStatus === 200 && loginData?.token, "admin login succeeds (for the API-driven sends below)");
    const token = loginData?.token;

    const stamp = Date.now();
    for (const key of Object.keys(templates)) {
      // Send directly through mailer.js (not the /api/mail/test route) so
      // every send here gets a unique dedupeKey and can't collide with a
      // previous run's rows — repeated `--live` runs should always deliver
      // fresh mail, not silently skip as a "duplicate".
      const { queued, skipped } = await sendMail({
        template: key,
        to: TEST_TO,
        data: templates[key].sample(),
        dedupeKey: `test-mail-live-${stamp}-${key}`,
      });
      assert(queued === true && !skipped, `${key}: queued for live delivery to ${TEST_TO}`);
    }
    // 14 sequential real Gmail sends can comfortably exceed the 8s default
    // drain timeout (services/mailQueue.js is deliberately serial, not
    // concurrent — see its file comment) — give this drain much more room
    // so the assertions below don't race sends still in flight.
    await drainMailQueue({ timeoutMs: 90000 });

    const rows = await MailLog.find({ dedupeKey: new RegExp(`^test-mail-live-${stamp}-`) }).lean();
    assert(rows.length === 14, `all 14 live sends produced a MailLog row (found ${rows.length})`);
    for (const row of rows) {
      assert(row.status === "sent", `${row.template}: delivered (status=sent)`, row.lastError || row.status);
      assert(Boolean(row.messageId), `${row.template}: has a real messageId`, row.messageId);
    }

    // Also prove the admin API's own send-test path works end to end.
    const { status: testStatus, data: testData } = await api("/api/mail/test", {
      token,
      body: { template: "booking-confirmed", to: TEST_TO },
    });
    assert(testStatus === 201 && testData?.queued, "POST /api/mail/test queues successfully", testData);
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
  console.error("Mail test suite crashed:", err);
  process.exit(1);
});
