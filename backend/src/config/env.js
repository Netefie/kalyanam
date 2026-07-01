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
  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  // Seed admin credentials (used only by `npm run seed`).
  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Kalyanam Admin",
    email: process.env.SEED_ADMIN_EMAIL || "admin@kalyanam.com",
    password: process.env.SEED_ADMIN_PASSWORD || "Kalyanam@346",
  },
};
