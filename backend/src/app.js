import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  // Behind a proxy (Render/Railway/Fly) so rate-limit & IPs work correctly.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / server-to-server (no Origin header) and any
        // configured browser origin.
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        return cb(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );

  // JSON only, with a small cap — this API never accepts large payloads.
  app.use(express.json({ limit: "100kb" }));

  // Cheap, broad safety net against abuse (login brute-force, scrapers).
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.get("/", (req, res) => res.json({ name: "kalyanam-api", ok: true }));
  app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

  app.use("/api", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
