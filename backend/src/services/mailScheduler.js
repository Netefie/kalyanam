// Time-based lifecycle mail: pre-arrival reminders, post-stay thank-yous,
// and hold-expiring warnings — none of which are triggered by a request,
// only by the clock. Structural copy of services/bookingSweeper.js (unref'd
// interval, exported sweep functions so scripts/test-mail.mjs can run a
// sweep synchronously instead of waiting on the timer, start/stop pair from
// server.js) — this is already a single long-running process, so a plain
// interval is the right tool, no separate cron/worker infra to run or pay for.
import { Booking } from "../models/Booking.js";
import { MailLog } from "../models/MailLog.js";
import { onPreArrival, onPostStay, onHoldExpiring } from "./notifications.js";
import { retryMailLog } from "./mailer.js";

const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

// Pre-arrival reminder window: check-in 36-60h out. 24h wide (vs. this
// sweeper's 10-minute cadence) so a booking is never at risk of slipping
// through between ticks.
const PRE_ARRIVAL_MIN_MS = 36 * HOUR_MS;
const PRE_ARRIVAL_MAX_MS = 60 * HOUR_MS;

// A row is only considered stranded once it has sat in "queued" for this long. The floor is the
// whole point: a row is created as "queued" and is legitimately mid-send for the next second or
// two, so re-driving anything newer would deliver it twice.
const STUCK_QUEUED_MS = 5 * MIN_MS;

// Bounded so one sweep can't run past the 30s function timeout - serial SMTP, remember. Any
// overflow is simply picked up by the next tick.
const STUCK_QUEUED_BATCH = 25;

// Post-stay thank-you window: check-out 12-48h in the past.
const POST_STAY_MIN_MS = 12 * HOUR_MS;
const POST_STAY_MAX_MS = 48 * HOUR_MS;

// Hold-expiring warning: fires once a Pending, unpaid hold has 5 minutes or
// less left — late enough to be urgent, early enough a guest who acts on it
// can still get through checkout before services/bookingSweeper.js marks
// the booking Expired.
const HOLD_WARNING_WINDOW_MS = 5 * MIN_MS;

export async function sweepPreArrivalReminders() {
  const now = Date.now();
  const bookings = await Booking.find({
    status: "Confirmed",
    checkIn: { $gte: new Date(now + PRE_ARRIVAL_MIN_MS), $lte: new Date(now + PRE_ARRIVAL_MAX_MS) },
    "notifications.reminderSentAt": { $exists: false },
  }).lean();

  for (const booking of bookings) {
    await onPreArrival(booking);
    await Booking.updateOne({ _id: booking._id }, { $set: { "notifications.reminderSentAt": new Date() } });
  }
  if (bookings.length) console.log(`[mail-scheduler] sent ${bookings.length} pre-arrival reminder(s)`);
  return bookings.length;
}

export async function sweepPostStayThankYou() {
  const now = Date.now();
  const bookings = await Booking.find({
    status: { $in: ["Confirmed", "CheckedIn", "CheckedOut"] },
    checkOut: { $gte: new Date(now - POST_STAY_MAX_MS), $lte: new Date(now - POST_STAY_MIN_MS) },
    "notifications.postStaySentAt": { $exists: false },
  }).lean();

  for (const booking of bookings) {
    await onPostStay(booking);
    await Booking.updateOne({ _id: booking._id }, { $set: { "notifications.postStaySentAt": new Date() } });
  }
  if (bookings.length) console.log(`[mail-scheduler] sent ${bookings.length} post-stay thank-you(s)`);
  return bookings.length;
}

export async function sweepHoldExpiringWarnings() {
  const now = Date.now();
  const bookings = await Booking.find({
    status: "Pending",
    "payment.status": { $in: ["created", "failed"] },
    holdExpiresAt: { $gt: new Date(now), $lte: new Date(now + HOLD_WARNING_WINDOW_MS) },
    "notifications.holdExpiringSentAt": { $exists: false },
  }).lean();

  for (const booking of bookings) {
    await onHoldExpiring(booking);
    await Booking.updateOne({ _id: booking._id }, { $set: { "notifications.holdExpiringSentAt": new Date() } });
  }
  if (bookings.length) console.log(`[mail-scheduler] sent ${bookings.length} hold-expiring warning(s)`);
  return bookings.length;
}

// Runs all three sweeps. Exported (not just used internally) so
// scripts/test-mail.mjs can invoke a real sweep synchronously rather than
// waiting on the interval, or reimplementing these queries by hand.
/**
 * Re-drives MailLog rows stranded in "queued".
 *
 * services/mailer.js#sendMail hands delivery to the queue and returns, so a row is "queued"
 * until its job runs. If the process stops between those two moments the row is orphaned: no
 * error is recorded, nothing retries it, and the mail simply never arrives. On Lambda that was
 * the normal case, because the environment freezes the moment a response is returned - the
 * drains in lambda.js and handlers/sweepers.js close that window, and this is the backstop for
 * whatever still slips through (a drain that hit its deadline, a container killed mid-send, SMTP
 * that hung).
 *
 * retryMailLog() is reused rather than re-implemented so a recovered row follows exactly the
 * same path as the admin console's Retry button.
 */
export async function sweepStuckQueuedMail() {
  const cutoff = new Date(Date.now() - STUCK_QUEUED_MS);
  const rows = await MailLog.find({ status: "queued", updatedAt: { $lte: cutoff } })
    .sort({ updatedAt: 1 })
    .limit(STUCK_QUEUED_BATCH)
    .select("_id")
    .lean();

  let requeued = 0;
  for (const row of rows) {
    try {
      await retryMailLog(row._id);
      requeued += 1;
    } catch (err) {
      // One unrecoverable row must not stop the rest of the batch.
      console.error(`[mail-scheduler] could not re-drive MailLog ${row._id}:`, err.message);
    }
  }

  if (requeued) {
    console.log(`[mail-scheduler] re-drove ${requeued} stranded mail row(s)`);
  }
  return requeued;
}

export async function runMailSweeps() {
  try {
    const [reminders, postStay, holdExpiring] = await Promise.all([
      sweepPreArrivalReminders(),
      sweepPostStayThankYou(),
      sweepHoldExpiringWarnings(),
    ]);
    // Runs after the others so anything they just enqueued isn't inspected while still in flight
    // — those rows are newer than the cutoff anyway, but ordering makes the intent explicit.
    const requeued = await sweepStuckQueuedMail();
    return { reminders, postStay, holdExpiring, requeued };
  } catch (err) {
    console.error("[mail-scheduler] sweep failed:", err.message);
    return { reminders: 0, postStay: 0, holdExpiring: 0, requeued: 0 };
  }
}

let timer = null;

export function startMailScheduler() {
  if (timer) return timer;
  timer = setInterval(runMailSweeps, SWEEP_INTERVAL_MS);
  timer.unref(); // never keep the process alive on its own
  return timer;
}

export function stopMailScheduler() {
  if (timer) clearInterval(timer);
  timer = null;
}
