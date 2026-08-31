// Pre-arrival reminder — fired by services/mailScheduler.js roughly 36-60h
// before check-in for Confirmed, unpaid-nothing bookings. Guarded by
// booking.notifications.reminderSentAt so a booking is reminded exactly once
// regardless of how many sweep ticks see it in that window.
import { titleBlock, textRow, referenceBlock, stayCard, bulletList, button, signatureRow, escapeHtml } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, guestCountLabel, daysUntil, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const days = daysUntil(booking.checkIn);
  const dayPhrase = days <= 0 ? "very soon" : days === 1 ? "tomorrow" : `in ${days} days`;
  const subject = `Your Stay is Coming Up — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("We Look Forward to Welcoming You"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      Your stay at Kalyanam Hotel &amp; Resort begins <strong>${dayPhrase}</strong>. Here's a quick recap of your reservation:`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode }),
    stayCard({
      roomName: booking.roomName,
      ratePlanName: booking.ratePlanName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guestCount: guestCountLabel(booking),
      rooms: booking.rooms,
    }),
    bulletList([
      "Check-in from 2:00 PM, check-out by 11:00 AM.",
      "Please carry a valid government-issued photo ID for every adult guest.",
      "Need an early check-in or have a special request? Just reply to this email.",
    ]),
    button({ label: "Contact the Front Desk", href: siteLink("/contact") }),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: `Your Kalyanam stay begins ${dayPhrase} — booking ${booking.bookingCode}.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "booking-reminder",
  label: "Pre-Arrival Reminder",
  description: "Sent to the guest a couple of days before check-in.",
  audience: "guest",
  build,
  sample: () => ({ booking: sampleBooking() }),
};
