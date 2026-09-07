// Internal alert on every new confirmed/paid booking — website checkout or
// an admin-entered offline booking (services/notifications.js#onBookingConfirmed).
import { textRow, referenceBlock, kvTable, button, escapeHtml, fmtDate, fmtMoney } from "../components.js";
import { renderEmail } from "../render.js";
import { guestName, guestCountLabel, siteLink } from "./helpers.js";
import { sampleBooking } from "./sampleData.js";

export function build({ booking }) {
  const name = guestName(booking);
  // Subject is a raw mail header, not HTML — no escaping here (that's only
  // for values interpolated into the HTML body below).
  const subject = `New Booking — ${booking.bookingCode} (${booking.roomName})`;

  const blocks = [
    textRow(`<strong>New ${booking.source === "admin" ? "offline" : "website"} booking confirmed.</strong>`),
    referenceBlock({ label: "Booking Reference", value: booking.bookingCode }),
    kvTable([
      { label: "Guest", value: escapeHtml(name) },
      { label: "Email", value: escapeHtml(booking.guest.email) },
      { label: "Phone", value: escapeHtml(booking.guest.phone) },
      { label: "Room", value: escapeHtml(booking.roomName) },
      { label: "Check-in", value: fmtDate(booking.checkIn) },
      { label: "Check-out", value: fmtDate(booking.checkOut) },
      { label: "Guests", value: escapeHtml(guestCountLabel(booking)) },
      { label: "Amount", value: fmtMoney(booking.payment?.amountPaid ?? booking.amount) },
      booking.payment?.method ? { label: "Paid Via", value: escapeHtml(booking.payment.method) } : null,
    ]),
    button({ label: "Open Bookings", href: siteLink("/admin/bookings") }),
  ];

  return renderEmail({
    subject,
    preview: `New booking ${booking.bookingCode} — ${name}`,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-new-booking",
  label: "Staff: New Booking",
  description: "Internal alert sent on every new confirmed or paid booking.",
  audience: "staff",
  build,
  sample: () => ({ booking: sampleBooking() }),
};
