// Low-level mail transport: renders a registered template, claims a MailLog
// row (idempotently, when a dedupeKey is given), and hands the actual SMTP
// delivery to services/mailQueue.js. This is the only file that talks to
// nodemailer — controllers/services never build a transport or a message
// themselves, they call sendMail({ template, ... }).
import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { MailLog } from "../models/MailLog.js";
import { getTemplate } from "../emails/templates/index.js";
import { enqueue, drain, queueDepth } from "./mailQueue.js";

let transporter = null;
let smtpVerified = false; // last known verifyTransport() outcome — for /api/mail/status

// Email is only attempted when explicitly enabled and host + credentials are
// present. This keeps the app fully working before SMTP is configured —
// bookings, enquiries and subscribers all still succeed, sends just log as
// `skipped` in the MailLog instead.
export function isMailEnabled() {
  return Boolean(env.mail.enabled && env.mail.host && env.mail.user && env.mail.pass);
}

function getTransporter() {
  if (transporter) return transporter;
  if (!isMailEnabled()) return null;

  // Pooled + rate-limited: a fresh connection per email is what gets a
  // Gmail account throttled under any real send volume. maxMessages caps
  // how many messages one pooled connection sends before nodemailer cycles
  // it, which keeps a single long-lived connection from tripping Gmail's
  // per-connection message limit.
  transporter = nodemailer.createTransport({
    host: env.mail.host,
    port: env.mail.port,
    secure: env.mail.secure,
    auth: { user: env.mail.user, pass: env.mail.pass },
    pool: true,
    maxConnections: 3,
    maxMessages: 50,
  });
  return transporter;
}

// Verifies SMTP credentials once at boot (server.js) so a misconfiguration
// shows up as one clear log line instead of a confusing failure buried in
// the first real send. Never throws — mail staying broken must never stop
// the app from starting.
//
// Runs the real handshake even when MAIL_DRY_RUN is set: verify() only logs
// in and confirms the connection (an EHLO/AUTH round-trip), it never sends
// a message, so dry-run — which exists to stop actual message delivery —
// has no reason to skip it. Skipping it would also blind scripts/test-mail.mjs's
// default (non---live) run to a real credential problem, which is exactly
// the kind of misconfiguration that check exists to catch early.
export async function verifyTransport() {
  const tx = getTransporter();
  if (!tx) {
    console.warn(
      "[mail] SMTP not configured — emails will be skipped. Set SMTP_HOST/SMTP_USER/SMTP_PASS to enable."
    );
    smtpVerified = false;
    return false;
  }

  try {
    await tx.verify();
    smtpVerified = true;
    console.log(
      `[mail] SMTP ready (${env.mail.host}:${env.mail.port} as ${env.mail.user})` +
        (env.mail.dryRun ? " — MAIL_DRY_RUN=true, so sends are rendered and logged, never delivered." : "")
    );
    return true;
  } catch (err) {
    smtpVerified = false;
    console.error(`[mail] SMTP verification failed: ${err.message}`);
    return false;
  }
}

// Snapshot for GET /api/mail/status.
export function mailStatus() {
  return {
    enabled: isMailEnabled(),
    dryRun: env.mail.dryRun,
    smtpVerified,
    queueDepth: queueDepth(),
    host: env.mail.host,
    from: env.mail.from,
  };
}

/* --------------------------------- delivery -------------------------------- */

// Node/nodemailer connection-level codes worth retrying.
const RETRYABLE_CODES = new Set(["ETIMEDOUT", "ECONNECTION", "ESOCKET", "ECONNRESET", "EDNS"]);

// Transient SMTP failures (network blips, greylisting, the receiving server
// briefly out of resources — RFC 5321 4xx replies) are worth a retry.
// Permanent ones (bad credentials, a rejected recipient — 5xx, or EAUTH) are
// not: retrying a bad password three times just burns send quota for a
// guaranteed-identical failure.
// Exported (only) so scripts/test-mail.mjs can unit-test the retry/no-retry
// classification directly against synthetic error objects, without needing
// to simulate real SMTP failures or sit through the real backoff delays.
export function isTransient(err) {
  if (RETRYABLE_CODES.has(err.code)) return true;
  const code = Number(err.responseCode);
  return code >= 400 && code < 500;
}

const BACKOFF_MS = [1000, 4000, 16000];

async function deliverWithRetry(tx, mail) {
  for (let attempt = 0; ; attempt++) {
    try {
      const info = await tx.sendMail(mail);
      return { info, attempts: attempt + 1 };
    } catch (err) {
      const isLastAttempt = attempt === BACKOFF_MS.length;
      if (!isTransient(err) || isLastAttempt) {
        throw Object.assign(err, { attemptsMade: attempt + 1 });
      }
      await new Promise((resolve) => setTimeout(resolve, BACKOFF_MS[attempt]));
    }
  }
}

// Runs the actual send for one already-claimed MailLog row and records the
// outcome on it. Only ever called from the queue (never directly), so a
// burst of sends never opens more concurrent traffic against Gmail than the
// pooled transport allows.
async function processLogRow(logId) {
  const row = await MailLog.findById(logId);
  if (!row) return; // defensive only — the row was just created by sendMail()

  if (env.mail.dryRun) {
    row.status = "dry-run";
    row.attempts += 1;
    await row.save();
    console.log(`[mail] (dry-run) "${row.subject}" -> ${row.to}`);
    return;
  }

  const tx = getTransporter();
  if (!tx) {
    row.status = "skipped";
    row.lastError = "SMTP not configured";
    await row.save();
    console.warn(`[mail] SMTP not configured — skipped "${row.subject}" to ${row.to}`);
    return;
  }

  try {
    const { info, attempts } = await deliverWithRetry(tx, {
      from: env.mail.from,
      to: row.to,
      replyTo: env.mail.replyTo || undefined,
      subject: row.subject,
      html: row.html,
      text: row.text,
    });
    row.status = "sent";
    row.attempts += attempts;
    row.messageId = info.messageId || "";
    row.sentAt = new Date();
    row.lastError = "";
    await row.save();
    console.log(`[mail] sent "${row.subject}" to ${row.to} (${info.messageId})`);
  } catch (err) {
    row.status = "failed";
    row.attempts += err.attemptsMade || 1;
    row.lastError = err.message;
    await row.save();
    console.error(`[mail] failed "${row.subject}" to ${row.to}: ${err.message}`);
  }
}

/* --------------------------------- sendMail -------------------------------- */

/**
 * Renders `template` (a key from emails/templates/index.js) against `data`,
 * claims a MailLog row, and hands delivery to the queue. Resolves as soon as
 * the row is claimed — never waits on the SMTP round-trip, so a slow or
 * failed send can never block or fail the request that triggered it (a
 * booking, an enquiry, ...). Failures surface only via the MailLog / admin
 * console and a console.error — callers don't need a `.catch()` for mail to
 * be safe, though services/notifications.js still adds one as a second line
 * of defense against a bug in this function itself.
 *
 * `dedupeKey`, when given, makes the send idempotent: a second call with the
 * same key (e.g. the Razorpay webhook and the browser's /verify racing for
 * the same booking) is a silent no-op rather than a duplicate email — see
 * models/MailLog.js.
 */
export async function sendMail({ template, to, data, dedupeKey, refs }) {
  const tpl = getTemplate(template);
  if (!tpl) throw new Error(`Unknown mail template: "${template}"`);
  if (!to) throw new Error(`sendMail("${template}"): missing recipient`);

  const { subject, html, text } = tpl.build(data);

  let row;
  try {
    row = await MailLog.create({
      template,
      to,
      subject,
      html,
      text,
      status: "queued",
      dedupeKey: dedupeKey || undefined,
      refs: refs || undefined,
    });
  } catch (err) {
    if (err.code === 11000) {
      // Already claimed by an earlier call — not an error, just a no-op.
      console.log(`[mail] skipped duplicate send for dedupeKey="${dedupeKey}"`);
      return { skipped: true, reason: "duplicate" };
    }
    throw err;
  }

  enqueue(() => processLogRow(row._id));
  return { queued: true, logId: row._id };
}

/**
 * Re-runs the send for an existing MailLog row (the admin console's "Retry"
 * button, POST /api/mail/logs/:id/retry). Resends the row's already-rendered
 * html/text/subject rather than re-rendering from the original event data
 * (which the row doesn't retain — see models/MailLog.js), so a retry sends
 * exactly what failed, not a fresh render against whatever the underlying
 * booking looks like right now.
 */
export async function retryMailLog(logId) {
  const row = await MailLog.findById(logId);
  if (!row) throw new Error("Mail log entry not found");
  if (row.status === "sent") return { alreadySent: true };

  row.status = "queued";
  row.lastError = "";
  await row.save();
  enqueue(() => processLogRow(row._id));
  return { queued: true };
}

export { drain as drainMailQueue };
