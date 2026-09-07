// Internal alert whenever a refund is processed
// (services/notifications.js#onRefundProcessed) — a financial event staff
// should always see a record of, independent of the guest-facing copy.
import { textRow, referenceBlock, kvTable, button, escapeHtml, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, siteLink } from "./helpers.js";
import { sampleBooking, sampleRefund } from "./sampleData.js";

export function build({ booking, refund }) {
  const name = guestName(booking);
  const isFull = booking.payment?.status === "refunded";
  const subject = `Refund Processed — ${booking.bookingCode} (${fmtMoney(refund.amount)})`;

  const blocks = [
    textRow(`<strong>${isFull ? "Full" : "Partial"} refund processed.</strong>`),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode }),
    kvTable([
      { label: "Guest", value: escapeHtml(name) },
      { label: "Amount Refunded", value: fmtMoney(refund.amount) },
      { label: "Total Refunded to Date", value: fmtMoney(booking.payment?.refundedAmount ?? refund.amount) },
      { label: "Refund Reference", value: escapeHtml(refund.refundId) },
      refund.reason ? { label: "Reason", value: escapeHtml(refund.reason) } : null,
    ]),
    button({ label: "Open Payments", href: siteLink("/admin/payments") }),
  ];

  return renderEmail({
    subject,
    preview: `${fmtMoney(refund.amount)} refunded for booking ${booking.bookingCode}`,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-refund",
  label: "Staff: Refund Processed",
  description: "Internal alert sent whenever a refund is processed.",
  audience: "staff",
  build,
  sample: () => ({
    booking: sampleBooking({ payment: { status: "partially_refunded", amountPaid: 23600, refundedAmount: 5000 } }),
    refund: sampleRefund(),
  }),
};
