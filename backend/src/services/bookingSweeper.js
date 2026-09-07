// Releases inventory held by abandoned checkouts. availability.js already
// stops counting a hold the instant holdExpiresAt passes, so this sweep
// isn't load-bearing for correctness — it exists so an abandoned booking
// visibly becomes `Expired` in the admin panel instead of sitting as
// `Pending` forever.
//
// This is already a single long-running process (see server.js /
// config/db.js's cost-optimization notes), so a plain unref'd interval is
// the right tool — no separate cron/worker infra to run or pay for.
import { Booking } from "../models/Booking.js";

const SWEEP_INTERVAL_MS = 2 * 60 * 1000;

// Exported (not just used internally) so scripts/test-payment-flow.mjs can
// invoke a real sweep synchronously instead of waiting up to 2 minutes for
// the interval, or reimplementing this query by hand.
export async function sweepExpiredHolds() {
  try {
    const result = await Booking.updateMany(
      {
        status: "Pending",
        "payment.status": { $in: ["created", "failed"] },
        holdExpiresAt: { $lte: new Date() },
      },
      { $set: { status: "Expired" } }
    );
    if (result.modifiedCount > 0) {
      console.log(`[sweeper] expired ${result.modifiedCount} unpaid booking hold(s)`);
    }
  } catch (err) {
    console.error("[sweeper] failed:", err.message);
  }
}

let timer = null;

export function startBookingSweeper() {
  if (timer) return timer;
  timer = setInterval(sweepExpiredHolds, SWEEP_INTERVAL_MS);
  timer.unref(); // never keep the process alive on its own
  return timer;
}

export function stopBookingSweeper() {
  if (timer) clearInterval(timer);
  timer = null;
}
