import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

// Reused across the process, mirroring services/mailer.js's transporter
// pattern — one client, created lazily, not per request.
let client = null;

export function isPaymentEnabled() {
  return Boolean(env.razorpay.keyId && env.razorpay.keySecret);
}

function getClient() {
  if (client) return client;
  if (!isPaymentEnabled()) return null;
  client = new Razorpay({
    key_id: env.razorpay.keyId,
    key_secret: env.razorpay.keySecret,
  });
  return client;
}

function requireClient() {
  const c = getClient();
  if (!c) {
    throw new ApiError(503, "Payments are not configured. Please try again later.");
  }
  return c;
}

// Rupees -> paise. Razorpay amounts are always integer paise.
function toPaise(rupees) {
  return Math.round(rupees * 100);
}

/**
 * Creates a Razorpay order for the given rupee amount. `receipt` should be
 * short and unique-ish (the booking code works well) — Razorpay caps it at
 * 40 chars.
 */
export async function createOrder({ amount, currency = env.razorpay.currency, receipt, notes }) {
  const rp = requireClient();
  try {
    return await rp.orders.create({
      amount: toPaise(amount),
      currency,
      receipt: String(receipt).slice(0, 40),
      notes,
    });
  } catch (err) {
    const message = err?.error?.description || err.message || "Failed to create payment order";
    throw new ApiError(err?.statusCode || 502, message);
  }
}

export async function fetchPayment(paymentId) {
  const rp = requireClient();
  try {
    return await rp.payments.fetch(paymentId);
  } catch (err) {
    const message = err?.error?.description || err.message || "Failed to fetch payment";
    throw new ApiError(err?.statusCode || 502, message);
  }
}

export async function fetchOrder(orderId) {
  const rp = requireClient();
  try {
    return await rp.orders.fetch(orderId);
  } catch (err) {
    const message = err?.error?.description || err.message || "Failed to fetch order";
    throw new ApiError(err?.statusCode || 502, message);
  }
}

/**
 * Issues a refund for a captured payment. `amount` is in rupees; omit for a
 * full refund of whatever remains uncaptured-refunded.
 */
export async function refundPayment({ paymentId, amount, notes }) {
  const rp = requireClient();
  try {
    const payload = { notes };
    if (amount != null) payload.amount = toPaise(amount);
    return await rp.payments.refund(paymentId, payload);
  } catch (err) {
    const message = err?.error?.description || err.message || "Failed to process refund";
    throw new ApiError(err?.statusCode || 502, message);
  }
}

// Timing-safe compare so response timing can't leak how much of the
// signature was guessed correctly.
function safeEqual(a, b) {
  const bufA = Buffer.from(a || "", "utf8");
  const bufB = Buffer.from(b || "", "utf8");
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Verifies the signature Razorpay Checkout hands back to the browser after a
// successful payment: HMAC_SHA256(order_id + "|" + payment_id, key_secret).
// This alone is NOT proof of payment (a forged order_id/payment_id pair
// could theoretically be signed if the secret leaked) — callers must always
// follow this with fetchPayment() and check its status/amount/order before
// trusting it. See services/paymentReconciler.js.
export function verifyCheckoutSignature({ orderId, paymentId, signature }) {
  if (!env.razorpay.keySecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return safeEqual(expected, signature);
}

// Verifies a webhook POST's signature: HMAC_SHA256(rawBody, webhookSecret).
// `rawBody` must be the exact, unparsed request bytes — see app.js, which
// mounts express.raw() on this route ahead of the global express.json().
export function verifyWebhookSignature({ rawBody, signature }) {
  if (!env.razorpay.webhookSecret) return false;
  const expected = crypto
    .createHmac("sha256", env.razorpay.webhookSecret)
    .update(rawBody)
    .digest("hex");
  return safeEqual(expected, signature);
}
