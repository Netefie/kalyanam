// Sent once a payment is verified (services/notifications.js#onBookingConfirmed,
// called from paymentReconciler.js and the admin-created-booking path in
// bookingController.js), not at booking creation, so nobody receives
// "Booking Confirmed" for a stay they never paid for.
import {
  titleBlock,
  textRow,
  referenceBlock,
  stayCard,
  kvTable,
  totalBlock,
  button,
  signatureRow,
  escapeHtml,
  fmtMoney,
} from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, guestCountLabel, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  const pricing = booking.pricing || {};
  const payment = booking.payment || {};
  const subject = `Booking Confirmed — ${booking.bookingCode} · Kalyanam Hotel & Resort`;

  const blocks = [
    titleBlock("Booking Confirmed"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      Thank you for choosing Kalyanam Hotel &amp; Resort. Your payment was received and we're delighted to confirm your reservation. Here are your booking details:`
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
    pricing.subtotal != null
      ? kvTable([
          { label: "Subtotal", value: fmtMoney(pricing.subtotal) },
          { label: `Taxes &amp; GST (${pricing.taxPercent ?? 0}%)`, value: fmtMoney(pricing.taxAmount) },
        ])
      : null,
    totalBlock({ label: "Total Paid", value: fmtMoney(payment.amountPaid || booking.amount) }),
    payment.paymentId
      ? textRow(
          `<span style="font-size:12px;color:#9a9080;">Payment ID: ${escapeHtml(payment.paymentId)}${
            payment.method ? ` &middot; Paid via ${escapeHtml(payment.method)}` : ""
          }</span>`
        )
      : null,
    textRow(
      "Our team will be in touch shortly to finalise the details of your stay. If you have any special requests, simply reply to this email."
    ),
    button({ label: "View Cancellation & Stay Policies", href: siteLink("/cancellation-policy") }),
    signatureRow(),
  ].filter(Boolean);

  return renderEmail({
    subject,
    preview: `Your Kalyanam reservation ${booking.bookingCode} is confirmed.`,
    blocks,
    footerNote: `This is an automated email for booking ${booking.bookingCode}.`,
  });
}

export default {
  key: "booking-confirmed",
  label: "Booking Confirmed",
  description: "Sent to the guest once a payment is verified.",
  audience: "guest",
  build,
  sample: () => ({ booking: sampleBooking() }),
};
