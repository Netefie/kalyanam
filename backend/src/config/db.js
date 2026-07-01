import mongoose from "mongoose";
import { env } from "./env.js";

// Reuse a single connection across the process (and across serverless
// invocations, if this is ever deployed that way). Opening a new pool per
// request is a common and expensive mistake — this keeps us on one small pool.
let connectionPromise = null;

export function connectDB() {
  if (connectionPromise) return connectionPromise;

  // Fail fast rather than buffering queries forever when the DB is unreachable.
  mongoose.set("bufferTimeoutMS", 8000);
  mongoose.set("strictQuery", true);

  connectionPromise = mongoose
    .connect(env.mongoUri, {
      // A small pool keeps memory/connection cost low on free tiers (Atlas M0
      // caps connections). Tune up only if throughput actually needs it.
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    })
    .then((m) => {
      console.log(`[db] connected: ${m.connection.host}/${m.connection.name}`);
      return m.connection;
    })
    .catch((err) => {
      // Reset so a later call can retry instead of reusing a rejected promise.
      connectionPromise = null;
      throw err;
    });

  return connectionPromise;
}

export async function disconnectDB() {
  if (!connectionPromise) return;
  await mongoose.disconnect();
  connectionPromise = null;
}
