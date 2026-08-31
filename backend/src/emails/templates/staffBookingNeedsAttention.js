// Internal alert for the one case payments can't resolve on their own: a
// guest's payment captured (real money, successfully charged) for a room
// that had already sold to someone else — the guest's hold lapsed while
// they were on the payment page, and by the time Razorpay's capture caught
// up, the last room for those dates had gone to a different booking. See
// services/paymentReconciler.js#applyPaymentSuccess, which sets
// `notifications.needsAttentionAt` instead of silently confirming a stay
// the hotel can't actually give.
import { textRow, referenceBlock, kvTable, alertBox, button, escapeHtml, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const subject = `Action needed — payment captured, room unavailable — ${booking.bookingCode}`;

  const blocks = [
    alertBox({
      tone: "danger",
      title: "Payment captured, but the room was already resold",
      body: "This guest's payment settled after their hold expired and the room sold to another booking. Contact the guest and issue a refund from the Payments console.",
    }),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode, accent: "#B91C1C" }),
    kvTable([
      { label: "Guest", value: escapeHtml(name) },
      { label: "Email", value: escapeHtml(booking.guest.email) },
      { label: "Phone", value: escapeHtml(booking.guest.phone) },
      { label: "Room", value: escapeHtml(booking.roomName) },
      { label: "Amount Captured", value: fmtMoney(booking.payment?.amountPaid ?? booking.amount) },
      { label: "Payment ID", value: escapeHtml(booking.payment?.paymentId || "—") },
    ]),
    button({ label: "Open Payments", href: siteLink("/admin/payments") }),
  ];

  return renderEmail({
    subject,
    preview: `Payment captured but room unavailable for booking ${booking.bookingCode} — ${name}`,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-booking-needs-attention",
  label: "Staff: Booking Needs Attention",
  description: "Internal alert when a captured payment lands for a room that no longer has stock.",
  audience: "staff",
  build,
  sample: () => ({
    booking: sampleBooking({
      status: "Cancelled",
      payment: { status: "paid" },
    }),
  }),
};
