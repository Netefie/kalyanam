// Single place that mutates a booking's payment state. Both the checkout
// verify endpoint (controllers/paymentController.js#verifyPayment) and the
// webhook (controllers/paymentController.js#handleWebhook) funnel through
// here, so "mark this booking paid" is written once and is safe to run
// twice — the guest's browser and Razorpay's webhook race for the same
// event, and either one (or both) may arrive first.
import { Booking } from "../models/Booking.js";
import { RoomType } from "../models/RoomType.js";
import { getAvailableCount } from "./availability.js";
import {
  onBookingConfirmed,
  onPaymentFailed,
  onRefundProcessed,
  onBookingNeedsAttention,
} from "./notifications.js";

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

  let strandedNoRoom = false;

  if (booking.status === "Pending") {
    booking.status = "Confirmed";
  } else if (booking.status === "Expired" || booking.status === "Cancelled") {
    // The hold lapsed (services/bookingSweeper.js flipped this to Expired —
    // or a guest cancelled) before Razorpay's capture caught up: a slow
    // bank, a webhook delayed behind a retry queue, or a guest who paid
    // right as the hold's last second ticked over. Whether this can still
    // be confirmed depends on whether the room got sold to someone else in
    // the meantime — availability.js excludes Expired/Cancelled bookings
    // from every count, so this booking currently holds nothing regardless
    // of what its `rooms` field says.
    const room = await RoomType.findById(booking.roomType).select("totalRooms").lean();
    const { available } = room
      ? await getAvailableCount(room, booking.checkIn, booking.checkOut, booking._id)
      : { available: 0 };

    if (room && available >= booking.rooms) {
      booking.status = "Confirmed";
    } else {
      // Already sold, or the room type itself is gone. The payment stands
      // — this is real money genuinely captured — but the stay does not.
      // Left Cancelled and flagged rather than silently emailing "Booking
      // Confirmed" for a room the guest does not have.
      booking.status = "Cancelled";
      booking.notifications.needsAttentionAt = new Date();
      strandedNoRoom = true;
    }
  }

  await booking.save();

  if (strandedNoRoom) {
    onBookingNeedsAttention(booking);
  } else {
    onBookingConfirmed(booking);
  }

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
