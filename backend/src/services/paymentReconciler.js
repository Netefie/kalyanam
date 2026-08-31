// Single place that mutates a booking's payment state. Both the checkout
// verify endpoint (controllers/paymentController.js#verifyPayment) and the
// webhook (controllers/paymentController.js#handleWebhook) funnel through
// here, so "mark this booking paid" is written once and is safe to run
// twice — the guest's browser and Razorpay's webhook race for the same
// event, and either one (or both) may arrive first.
import { Booking } from "../models/Booking.js";
import { onBookingConfirmed, onPaymentFailed, onRefundProcessed } from "./notifications.js";

// Extracts the bits of a Razorpay payment object we store/display.
function paymentSnapshot(rpPayment) {
  return {
    paymentId: rpPayment.id,
    method: rpPayment.method || "",
    cardLast4: rpPayment.card?.last4 || "",
    amountPaid: Math.round((rpPayment.amount || 0) / 100),
    currency: rpPayment.currency || "INR",
  };
}

/**
 * Confirms a booking after independently verifying the payment with
 * Razorpay (callers must pass the fetched payment object — this function
 * never trusts a client-supplied status). Idempotent: if the booking is
 * already `paid`, returns it unchanged instead of re-confirming or
 * re-emailing.
 */
export async function applyPaymentSuccess({ booking, rpPayment }) {
  if (booking.payment.status === "paid") {
    return booking; // already reconciled — e.g. webhook arrived after verify already did this
  }

  const snap = paymentSnapshot(rpPayment);
  booking.payment.status = "paid";
  booking.payment.paymentId = snap.paymentId;
  booking.payment.method = snap.method;
  booking.payment.cardLast4 = snap.cardLast4;
  booking.payment.amountPaid = snap.amountPaid;
  booking.payment.currency = snap.currency;
  booking.payment.paidAt = new Date();
  booking.payment.failureReason = "";
  booking.holdExpiresAt = undefined;
  if (booking.status === "Pending") booking.status = "Confirmed";

  await booking.save();

  onBookingConfirmed(booking);

  return booking;
}

/**
 * Records a failed payment attempt without touching the room hold — the
 * guest may retry against the same order until it expires.
 */
export async function applyPaymentFailure({ booking, reason }) {
  if (booking.payment.status === "paid") {
    return booking; // a later duplicate failure event after an earlier success — ignore
  }

  booking.payment.status = "failed";
  booking.payment.failureReason = reason || "Payment failed";
  booking.payment.attempts += 1;
  await booking.save();

  onPaymentFailed(booking);

  return booking;
}

/**
 * Records a refund (full or partial) already processed by Razorpay.
 * Idempotent per refund id — replaying the same refund event is a no-op.
 */
export async function applyRefund({ booking, rpRefund, reason }) {
  const amount = Math.round((rpRefund.amount || 0) / 100);

  const alreadyRecorded = booking.payment.refunds.some((r) => r.refundId === rpRefund.id);
  if (alreadyRecorded) return booking;

  booking.payment.refunds.push({
    refundId: rpRefund.id,
    amount,
    status: rpRefund.status || "processed",
    reason: reason || "",
  });
  booking.payment.refundedAmount += amount;
  booking.payment.status =
    booking.payment.refundedAmount >= booking.payment.amountPaid ? "refunded" : "partially_refunded";

  if (booking.payment.status === "refunded" && booking.status !== "Cancelled") {
    booking.status = "Cancelled";
  }

  await booking.save();

  const refundRecord = booking.payment.refunds[booking.payment.refunds.length - 1];
  onRefundProcessed(booking, refundRecord);

  return booking;
}

// Re-fetches a booking by id fresh from the DB (not .lean() — callers need
// to call .save()). Shared by every reconciliation entry point.
export async function loadBookingForReconcile(bookingId) {
  return Booking.findById(bookingId);
}
