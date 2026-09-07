// Sent when a payment attempt fails (declined card, timeout, etc.) so the
// guest isn't left wondering why their booking never confirmed. The room
// hold is still live until it expires, so the copy invites a retry.
import { titleBlock, textRow, referenceBlock, button, signatureRow, escapeHtml, fmtDate } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const subject = `Payment Unsuccessful — ${booking.bookingCode} · Kalyanam Hotel & Resort`;
  const reason = booking.payment?.failureReason || "the payment could not be completed";

  const blocks = [
    titleBlock("Payment Unsuccessful"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      We couldn't process your payment for the reservation below (${escapeHtml(reason)}). No amount was charged.`
    ),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode, accent: "#B91C1C" }),
    textRow(
      `Your selected room — <strong>${escapeHtml(booking.roomName)}</strong>, ${fmtDate(booking.checkIn)} to ${fmtDate(
        booking.checkOut
      )} — is still on hold for a short while. Please return to the booking page to try again before the hold expires.`
    ),
    textRow("If you believe this is a mistake, simply reply to this email and our team will help."),
    button({ label: "Try Payment Again", href: siteLink("/accommodations"), tone: "danger" }),
    signatureRow(),
  ];

  return renderEmail({
    subject,
    preview: `We couldn't process your payment for booking ${booking.bookingCode}.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "payment-failed",
  label: "Payment Unsuccessful",
  description: "Sent to the guest when a payment attempt fails.",
  audience: "guest",
  build,
  sample: () => ({
    booking: sampleBooking({
      payment: { status: "failed", failureReason: "Your card issuer declined the payment.", attempts: 1 },
    }),
  }),
};
