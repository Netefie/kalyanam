import dotenv from "dotenv";

dotenv.config();

// Small helper so a missing required var fails fast (and loudly) at boot
// instead of surfacing as a confusing runtime error later.
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const isProd = process.env.NODE_ENV === "production";

// Computed ahead of the `env` object below so `siteUrl` can fall back to it.
const corsOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  isProd,
  port: Number(process.env.PORT) || 5000,

  // Mongo. In production the URI is required; in dev we fall back to a
  // local mongod so the app still boots without a .env.
  mongoUri: isProd
    ? required("MONGODB_URI")
    : process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/kalyanam",

  jwtSecret: isProd
    ? required("JWT_SECRET")
    : process.env.JWT_SECRET || "dev-only-insecure-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Comma-separated list of allowed browser origins for CORS.
  // Dev default covers Next on :3000 and its fallback :3001.
  corsOrigins,

  // Public URL of the frontend. Every CTA button in a transactional email
  // (view booking, browse rooms, open the admin record) links here, so it
  // must be the browser-facing origin — not this API's. Falls back to the
  // first configured CORS origin, which in dev is the Next dev server.
  siteUrl: (process.env.SITE_URL || corsOrigins[0] || "").replace(/\/$/, ""),

  // Transactional email. Blank credentials disable sending entirely — the
  // app still boots and every booking/enquiry still works, sends are just
  // skipped (and recorded as `skipped` in the MailLog).
  mail: {
    host: process.env.SMTP_HOST || "",
    // 465 + secure is implicit TLS: the connection is encrypted from the
    // first byte. 587 negotiates STARTTLS afterwards, leaving a brief
    // plaintext window, so 465 is the default here.
    port: Number(process.env.SMTP_PORT) || 465,
    secure: process.env.SMTP_SECURE !== "false",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",

    // Gmail rewrites the From header to the authenticated account unless the
    // alias is verified in the account's "Send mail as" settings. Using an
    // unverified vanity address here doesn't hide the real sender — it just
    // breaks DMARC alignment and pushes the mail to spam. Keep this as the
    // SMTP_USER address (a display name in front of it is fine).
    from: process.env.MAIL_FROM || "Kalyanam Hotel & Resort <kalyanamtechgrp@gmail.com>",
    // Where guest replies land. Same mailbox by default.
    replyTo: process.env.MAIL_REPLY_TO || "",

    // Internal alerts (new booking, new enquiry, payment failed, refund).
    adminTo: process.env.MAIL_ADMIN_TO || "",
    // Inbox used by `npm run test:mail -- --live` and the admin console's
    // "send test" box, so verification never reaches guests or staff.
    testTo: process.env.MAIL_TEST_TO || "",

    // Renders and logs every email but never opens a socket. Lets the test
    // suite exercise the full pipeline without spending send quota.
    dryRun: process.env.MAIL_DRY_RUN === "true",
    // Explicit kill switch, independent of whether credentials exist.
    enabled: process.env.MAIL_ENABLED !== "false",
    maxRetries: Number(process.env.MAIL_MAX_RETRIES) || 3,
  },

  // Seed admin credentials (used only by `npm run seed`).
  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Kalyanam Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@kalyanam.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Kalyanam@346",
  },

  // Razorpay (payments). Required in production — booking payment routes
  // fail fast rather than silently taking no-op payments. Optional in dev so
  // the app still boots without keys (payment routes 503 until configured).
  razorpay: {
    keyId: isProd ? required("RAZORPAY_KEY_ID") : process.env.RAZORPAY_KEY_ID || "",
    keySecret: isProd
      ? required("RAZORPAY_KEY_SECRET")
      : process.env.RAZORPAY_KEY_SECRET || "",
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "",
    currency: process.env.PAYMENT_CURRENCY || "INR",
  },

  // How long a website booking holds its room inventory while the guest is
  // on the payment page. Expired holds are released by services/bookingSweeper.js.
  bookingHoldMinutes: Number(process.env.BOOKING_HOLD_MINUTES) || 15,
};
