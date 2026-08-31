// Internal alert when a guest's payment attempt fails
// (services/notifications.js#onPaymentFailed) — lets staff spot a guest
// who's stuck at checkout instead of them just abandoning silently.
import { textRow, referenceBlock, kvTable, button, escapeHtml, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const subject = `Payment Failed — ${booking.bookingCode}`;
  const reason = booking.payment?.failureReason || "Unknown reason";

  const blocks = [
    textRow(`<strong>A payment attempt failed.</strong> The room hold is still active until it expires.`),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode, accent: "#B91C1C" }),
    kvTable([
      { label: "Guest", value: escapeHtml(name) },
      { label: "Email", value: escapeHtml(booking.guest.email) },
      { label: "Phone", value: escapeHtml(booking.guest.phone) },
      { label: "Room", value: escapeHtml(booking.roomName) },
      { label: "Amount Due", value: fmtMoney(booking.pricing?.total ?? booking.amount) },
      { label: "Attempts", value: String(booking.payment?.attempts ?? 1) },
      { label: "Reason", value: escapeHtml(reason) },
    ]),
    button({ label: "Open Payments", href: siteLink("/admin/payments") }),
  ];

  return renderEmail({
    subject,
    preview: `Payment failed for booking ${booking.bookingCode} — ${name}`,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-payment-failed",
  label: "Staff: Payment Failed",
  description: "Internal alert sent when a guest's payment attempt fails.",
  audience: "staff",
  build,
  sample: () => ({
    booking: sampleBooking({
      payment: { status: "failed", failureReason: "Your card issuer declined the payment.", attempts: 1 },
    }),
  }),
};
