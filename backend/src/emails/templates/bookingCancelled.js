// Sent when a booking's status moves to Cancelled — most commonly an admin
// cancelling on the guest's behalf (services/notifications.js#onBookingCancelled,
// called from controllers/bookingController.js#updateBookingStatus). Distinct
// from refund-processed.js: this reflects the *reservation* status change,
// not a specific refund transaction (those may or may not follow separately).
import { titleBlock, textRow, referenceBlock, stayCard, alertBox, button, signatureRow, escapeHtml } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, guestCountLabel, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking, reason }) {
  const name = guestName(booking);
  const wasPaid = ["paid", "partially_refunded", "refunded"].includes(booking.payment?.status);
  const subject = `Booking Cancelled — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("Booking Cancelled"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      Your reservation below has been cancelled${reason ? ` (${escapeHtml(reason)})` : ""}.`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode, accent: "#B91C1C" }),
    stayCard({
      roomName: booking.roomName,
      ratePlanName: booking.ratePlanName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guestCount: guestCountLabel(booking),
      rooms: booking.rooms,
    }),
    wasPaid
      ? alertBox({
          tone: "info",
          title: "About your payment",
          body: "If a refund is due, our team will process it separately and you'll receive a confirmation email once it's complete.",
        })
      : null,
    textRow("If this cancellation wasn't expected, simply reply to this email and we'll help sort it out."),
    button({ label: "Browse Other Dates", href: siteLink("/accommodations") }),
    signatureRow(),
  ].filter(Boolean);

  return renderEmail({
    subject,
    preview: `Your Kalyanam booking ${booking.bookingCode} has been cancelled.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "booking-cancelled",
  label: "Booking Cancelled",
  description: "Sent to the guest when a booking's status is set to Cancelled.",
  audience: "guest",
  build,
  sample: () => ({ booking: sampleBooking({ status: "Cancelled" }), reason: "Requested by guest" }),
};
