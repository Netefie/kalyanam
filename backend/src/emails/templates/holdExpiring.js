// Abandoned-checkout recovery — fired by services/mailScheduler.js when a
// Pending, unpaid booking's room hold (see services/availability.js /
// bookingSweeper.js) is within ~5 minutes of lapsing. Guarded by
// booking.notifications.holdExpiringSentAt so it fires exactly once per hold.
import { titleBlock, textRow, referenceBlock, stayCard, alertBox, totalBlock, button, signatureRow, escapeHtml, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, guestCountLabel, minutesUntil, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const minutes = minutesUntil(booking.holdExpiresAt);
  const subject = `Your Room is Waiting — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("Your Room is Waiting"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      You started a booking with us but haven't completed payment yet. We're holding your room for a few more minutes — here's what you selected:`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode, accent: "#9A6B1E" }),
    stayCard({
      roomName: booking.roomName,
      ratePlanName: booking.ratePlanName,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      nights: booking.nights,
      guestCount: guestCountLabel(booking),
      rooms: booking.rooms,
    }),
    totalBlock({ label: "Amount Due", value: fmtMoney(booking.pricing?.total ?? booking.amount) }),
    alertBox({
      tone: "warning",
      title: "Hold expiring soon",
      body: `Your room is held for approximately ${minutes} more minute(s). After that, it's released back to general availability and this exact rate may no longer be guaranteed.`,
    }),
    button({ label: "Complete Your Booking", href: siteLink("/accommodations"), tone: "warning" }),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: `Your room at Kalyanam is held for a few more minutes.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "hold-expiring",
  label: "Room Hold Expiring",
  description: "Sent to the guest when an unpaid room hold is about to lapse.",
  audience: "guest",
  build,
  sample: () => ({
    booking: sampleBooking({
      status: "Pending",
      payment: { status: "created" },
      holdExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
    }),
  }),
};
