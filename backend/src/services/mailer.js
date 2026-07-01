import nodemailer from "nodemailer";
import { env } from "../config/env.js";

// Reused across the process (opening a transport per email is wasteful).
let transporter = null;

// Email is only attempted when host + credentials are present. This keeps the
// app fully working before SMTP is configured (bookings still succeed).
export function isMailEnabled() {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function getTransporter() {
  if (transporter) return transporter;
  if (!isMailEnabled()) return null;

  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: { user: env.smtp.user, pass: env.smtp.pass },
  });
  return transporter;
}

// Sends an email, or no-ops (with a log line) when SMTP isn't configured yet.
// Never throws for a missing config — callers can await it safely.
export async function sendMail({ to, subject, html, text }) {
  const tx = getTransporter();

  if (!tx) {
    console.warn(
      `[mail] SMTP not configured — skipped "${subject}" to ${to}. ` +
        `Set SMTP_HOST/SMTP_USER/SMTP_PASS to enable email.`
    );
    return { skipped: true };
  }

  const info = await tx.sendMail({ from: env.smtp.from, to, subject, html, text });
  console.log(`[mail] sent "${subject}" to ${to} (${info.messageId})`);
  return info;
}
