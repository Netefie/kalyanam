// Lambda entry point. Wraps the same Express app used by server.js
// (createApp() in app.js) so route/middleware behavior is identical between
// `npm run dev` (server.js, a long-running process) and the deployed Lambda
// — the only thing that differs is how a request reaches the app.
import serverlessExpress from "@vendia/serverless-express";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { ensureBookingCounterSeeded } from "./models/Counter.js";
import { Booking, backfillLegacyPaymentDefaults } from "./models/Booking.js";

// Built once per cold start, reused by every invocation the same warm
// container handles — connectDB() itself already caches the connection
// promise (config/db.js), this just caches the serverless-express wrapper
// on top of it so warm invocations skip re-building the app entirely.
let handlerPromise = null;

async function bootstrap() {
  await connectDB();
  // Cheap no-ops after the first real run (Counter.findOne / an indexed
  // updateMany against already-migrated docs) — safe to repeat on every
  // cold start rather than tracking "have we done this yet" separately.
  await ensureBookingCounterSeeded(Booking);
  await backfillLegacyPaymentDefaults();

  const app = createApp();
  return serverlessExpress({ app });
}

export const handler = async (event, context) => {
  // A DB hiccup mid-request must not hang the invocation until Lambda's
  // timeout — let it fail fast and retry cold on the next request instead
  // of reusing a rejected bootstrap promise forever.
  context.callbackWaitsForEmptyEventLoop = false;

  if (!handlerPromise) {
    handlerPromise = bootstrap().catch((err) => {
      handlerPromise = null;
      throw err;
    });
  }

  const serverlessHandler = await handlerPromise;
  return serverlessHandler(event, context);
};
