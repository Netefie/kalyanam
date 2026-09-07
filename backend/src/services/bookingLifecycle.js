// The stay-lifecycle `status` state machine (Pending/Confirmed/CheckedIn/
// CheckedOut/Cancelled/Expired) — deliberately separate from
// services/paymentReconciler.js, which owns `payment.status` (the money
// lifecycle). Before this module existed, PATCH /bookings/:id/status wrote
// any enum value onto any prior status: a currently-staying guest's booking
// could be flipped straight back to `Pending`, and — the sharper bug — a
// booking with a captured payment could be set to `Cancelled` with a single
// PATCH, releasing its room and emailing the guest a cancellation with no
// refund ever issued.
import { ApiError } from "../utils/ApiError.js";
import { onBookingCancelled } from "./notifications.js";
import { applyRefund } from "./paymentReconciler.js";
import { refundPayment } from "./razorpay.js";

// Every legal forward move. `Cancelled` is deliberately reachable from every
// non-terminal status but is never a plain PATCH target (see
// applyStatusChange below) — cancelling always goes through cancelBooking()
// so a captured payment can't be dropped on the floor.
const ALLOWED_TRANSITIONS = {
  Pending: ["Confirmed", "Cancelled", "Expired"],
  Confirmed: ["CheckedIn", "Cancelled"],
  CheckedIn: ["CheckedOut", "Cancelled"],
  CheckedOut: [], // terminal — a completed stay isn't editable via status
  Cancelled: [], // terminal — reopening one is a new booking, not an edit
  // paymentReconciler reviving a capture that settled after the hold lapsed
  // but the room turned out to still be free — see applyPaymentSuccess.
  Expired: ["Confirmed"],
};

export function assertTransitionAllowed(from, to) {
  if (from === to) return; // idempotent no-op, not an error
  const allowed = ALLOWED_TRANSITIONS[from] || [];
  if (!allowed.includes(to)) {
    throw new ApiError(409, `Cannot move a booking from ${from} to ${to}`);
  }
}

// Admin-driven routine status change (PATCH /bookings/:id/status): the
// forward progression through a stay, plus Expired→Confirmed revival.
// Cancellation is refused here on purpose — see cancelBooking().
export async function applyStatusChange({ booking, next, reason }) {
  if (next === "Cancelled") {
    throw new ApiError(400, "Cancel this booking from the cancel action, not a plain status change.");
  }
  assertTransitionAllowed(booking.status, next);

  booking.status = next;
  if (next === "CheckedIn") booking.checkedInAt = new Date();
  if (next === "CheckedOut") booking.checkedOutAt = new Date();
  if (next === "Confirmed" && booking.notifications?.needsAttentionAt) {
    booking.notifications.needsAttentionAt = undefined;
  }

  await booking.save();
  return booking;
}

// Cancels a booking, requiring an explicit refund decision whenever there is
// captured money to account for. Shared by the admin "cancel" action and the
// guest-facing self-service cancel (POST /bookings/cancel) — "cancel a
// booking" has exactly one implementation regardless of who initiates it.
//
// `refund`, when given, is `{ amount, reason }` — `amount` defaults to
// whatever remains uncaptured-refunded. A partial refund (e.g. a retained
// cancellation fee) still cancels the stay; only the money differs.
export async function cancelBooking({ booking, reason, refund, by = "staff" }) {
  if (booking.status === "Cancelled") return booking; // idempotent
  assertTransitionAllowed(booking.status, "Cancelled");

  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;
  const hasUnrefundedCapture =
    ["paid", "partially_refunded"].includes(booking.payment.status) && remaining > 0;

  if (hasUnrefundedCapture && !refund) {
    throw new ApiError(
      400,
      `This booking has ₹${remaining} captured — a refund amount is required to cancel it.`
    );
  }

  if (refund) {
    const amount = refund.amount != null ? Number(refund.amount) : remaining;
    if (!(amount > 0) || amount > remaining) {
      throw new ApiError(400, `Refund amount must be between ₹1 and ₹${remaining}`);
    }
    const rpRefund = await refundPayment({
      paymentId: booking.payment.paymentId,
      amount,
      notes: { bookingCode: booking.bookingCode, reason: refund.reason || reason || "" },
    });
    // Records the refund and emails the guest a refund receipt.
    // applyRefund() only flips `status` to Cancelled itself when the refund
    // happens to be full — the explicit transition below always finishes
    // the job, since a partial refund still means the stay itself is off.
    await applyRefund({ booking, rpRefund, reason: refund.reason || reason });
  }

  booking.status = "Cancelled";
  booking.cancellation = { at: new Date(), reason: reason || "", by };
  booking.holdExpiresAt = undefined;
  await booking.save();

  if (!refund) {
    // No money moved — a plain cancellation still needs its own email. When
    // a refund did happen, onRefundProcessed (fired inside applyRefund)
    // already told the guest their money is on its way, which doubles as
    // cancellation confirmation, so a second "cancelled" mail would be
    // redundant.
    await onBookingCancelled(booking, {
      reason: reason || (by === "guest" ? "Cancelled by guest" : "Cancelled by hotel staff"),
    });
  }

  return booking;
}
