// Sent whenever an admin issues a full or partial refund
// (services/notifications.js#onRefundProcessed, via
// services/paymentReconciler.js#applyRefund).
import { titleBlock, textRow, referenceBlock, totalBlock, signatureRow, escapeHtml, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName } from "./helpers.js";
import { sampleBooking, sampleRefund } from "./sampleData.js";

export function build({ booking, refund }) {
  const name = guestName(booking);
  const isFull = booking.payment?.status === "refunded";
  const subject = `Refund Processed — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("Refund Processed"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      A refund has been processed for your booking. Here are the details:`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode }),
    totalBlock({
      label: isFull ? "Amount Refunded (Full)" : "Amount Refunded",
      value: fmtMoney(refund.amount),
    }),
    textRow(
      `<span style="font-size:12px;color:#9a9080;">Refund reference: ${escapeHtml(refund.refundId)}${
        !isFull ? ` &middot; Total refunded to date: ${fmtMoney(booking.payment.refundedAmount)}` : ""
      }</span>`
    ),
    textRow(
      "Refunds typically reflect in your original payment method within 5-7 business days, depending on your bank."
    ),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: `A refund of ${fmtMoney(refund.amount)} has been processed for booking ${booking.bookingCode}.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "refund-processed",
  label: "Refund Processed",
  description: "Sent to the guest when an admin issues a full or partial refund.",
  audience: "guest",
  build,
  sample: () => ({
    booking: sampleBooking({ payment: { status: "partially_refunded", amountPaid: 23600, refundedAmount: 5000 } }),
    refund: sampleRefund(),
  }),
};
