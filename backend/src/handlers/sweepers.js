// EventBridge-scheduled Lambda handlers. Each just connects and calls the
// same sweep functions server.js runs on a setInterval in the long-running
// deploy (services/bookingSweeper.js, services/mailScheduler.js) — no sweep
// logic is duplicated here, this only supplies the "wake up every N minutes"
// trigger that a Lambda deploy needs in place of the interval timer.
import { connectDB } from "../config/db.js";
import { sweepExpiredHolds } from "../services/bookingSweeper.js";
import { runMailSweeps } from "../services/mailScheduler.js";

export const sweepBookings = async () => {
  await connectDB();
  await sweepExpiredHolds();
};

export const sweepMail = async () => {
  await connectDB();
  await runMailSweeps();
};
