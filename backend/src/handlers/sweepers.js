// EventBridge-scheduled Lambda handlers. Each just connects and calls the
// same sweep functions server.js runs on a setInterval in the long-running
// deploy (services/bookingSweeper.js, services/mailScheduler.js) — no sweep
// logic is duplicated here, this only supplies the "wake up every N minutes"
// trigger that a Lambda deploy needs in place of the interval timer.
import { connectDB } from "../config/db.js";
import { sweepExpiredHolds } from "../services/bookingSweeper.js";
import { runMailSweeps } from "../services/mailScheduler.js";
import { drainMailQueue } from "../services/mailer.js";

// Both handlers drain before returning, for the same reason lambda.js does: a scheduled
// invocation freezes on return too, so mail these sweeps enqueue would otherwise be abandoned
// mid-send and left sitting at "queued". drain() is a no-op on an empty queue, so it costs
// nothing on the runs that send nothing.
export const sweepBookings = async () => {
  await connectDB();
  await sweepExpiredHolds();
  await drainMailQueue();
};

export const sweepMail = async () => {
  await connectDB();
  await runMailSweeps();
  await drainMailQueue();
};
