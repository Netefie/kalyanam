import { createApp } from "./app.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { startBookingSweeper, stopBookingSweeper } from "./services/bookingSweeper.js";
import { startMailScheduler, stopMailScheduler } from "./services/mailScheduler.js";
import { verifyTransport, drainMailQueue } from "./services/mailer.js";
import { ensureBookingCounterSeeded } from "./models/Counter.js";
import { Booking, backfillLegacyPaymentDefaults } from "./models/Booking.js";

async function start() {
  await connectDB();
  await ensureBookingCounterSeeded(Booking);
  await backfillLegacyPaymentDefaults();

  // Confirms SMTP credentials work (or logs a clear reason they don't) once
  // at boot, instead of finding out on the first real send. Never throws —
  // mail staying broken must never stop the app from starting.
  await verifyTransport();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`[server] listening on :${env.port} (${env.nodeEnv})`);
  });

  startBookingSweeper();
  startMailScheduler();

  // Graceful shutdown so the single instance releases its DB pool cleanly
  // on redeploys / SIGTERM (matters on free tiers that recycle often).
  const shutdown = async (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    stopBookingSweeper();
    stopMailScheduler();
    // Let any mail already queued (e.g. from a request just before the
    // signal arrived) actually go out before the process exits, instead of
    // silently dropping it.
    await drainMailQueue();
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    // Hard exit if graceful close hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
