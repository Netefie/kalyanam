// Time-based lifecycle mail: pre-arrival reminders, post-stay thank-yous,
// and hold-expiring warnings — none of which are triggered by a request,
// only by the clock. Structural copy of services/bookingSweeper.js (unref'd
// interval, exported sweep functions so scripts/test-mail.mjs can run a
// sweep synchronously instead of waiting on the timer, start/stop pair from
// server.js) — this is already a single long-running process, so a plain
// interval is the right tool, no separate cron/worker infra to run or pay for.
import { Booking } from "../models/Booking.js";
import { onPreArrival, onPostStay, onHoldExpiring } from "./notifications.js";

const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const MIN_MS = 60 * 1000;

// Pre-arrival reminder window: check-in 36-60h out. 24h wide (vs. this
// sweeper's 10-minute cadence) so a booking is never at risk of slipping
// through between ticks.
const PRE_ARRIVAL_MIN_MS = 36 * HOUR_MS;
const PRE_ARRIVAL_MAX_MS = 60 * HOUR_MS;

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
export async function runMailSweeps() {
  try {
    const [reminders, postStay, holdExpiring] = await Promise.all([
      sweepPreArrivalReminders(),
      sweepPostStayThankYou(),
      sweepHoldExpiringWarnings(),
    ]);
    return { reminders, postStay, holdExpiring };
  } catch (err) {
    console.error("[mail-scheduler] sweep failed:", err.message);
    return { reminders: 0, postStay: 0, holdExpiring: 0 };
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
