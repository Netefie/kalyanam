// Post-stay thank-you — fired by services/mailScheduler.js roughly 12-48h
// after check-out. Guarded by booking.notifications.postStaySentAt.
import { titleBlock, textRow, referenceBlock, button, signatureRow, escapeHtml } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const subject = `Thank You for Staying With Us — Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("Thank You for Staying With Us"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      It was a pleasure hosting you at Kalyanam Hotel &amp; Resort. We hope your stay in <strong>${escapeHtml(
        booking.roomName
      )}</strong> was everything you'd hoped for.`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode }),
    textRow(
      "If anything about your stay didn't meet expectations, simply reply to this email — we read every message and would love the chance to make it right."
    ),
    textRow("We'd be delighted to host you again."),
    button({ label: "Plan Your Next Stay", href: siteLink("/accommodations") }),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: `Thank you for staying at Kalyanam Hotel & Resort.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "booking-post-stay",
  label: "Post-Stay Thank You",
  description: "Sent to the guest a day or two after check-out.",
  audience: "guest",
  build,
  sample: () => ({ booking: sampleBooking({ status: "CheckedOut" }) }),
};
