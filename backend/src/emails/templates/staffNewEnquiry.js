// Internal alert on every new contact-form or reservation enquiry
// (services/notifications.js#onEnquiryCreated).
import { textRow, kvTable, button, escapeHtml, fmtDate } from "../components.js";
import { renderEmail } from "../render.js";
import { siteLink } from "./helpers.js";
import { sampleEnquiry } from "./sampleData.js";

export function build({ enquiry }) {
  const isReservation = enquiry.type === "reservation";
  const subject = `New ${isReservation ? "Reservation" : "Contact"} Enquiry — ${enquiry.name || "Unnamed"}`;

  const rows = [
    { label: "Type", value: isReservation ? "Reservation" : "Contact" },
    enquiry.name ? { label: "Name", value: escapeHtml(enquiry.name) } : null,
    enquiry.email ? { label: "Email", value: escapeHtml(enquiry.email) } : null,
    enquiry.phone ? { label: "Phone", value: escapeHtml(enquiry.phone) } : null,
    isReservation && enquiry.roomType ? { label: "Room Type", value: escapeHtml(enquiry.roomType) } : null,
    isReservation && enquiry.checkIn ? { label: "Check-in", value: fmtDate(enquiry.checkIn) } : null,
    isReservation && enquiry.checkOut ? { label: "Check-out", value: fmtDate(enquiry.checkOut) } : null,
    !isReservation && enquiry.subject ? { label: "Subject", value: escapeHtml(enquiry.subject) } : null,
  ];

  const blocks = [
    textRow(`<strong>New ${isReservation ? "reservation" : "contact"} enquiry received.</strong>`),
    kvTable(rows),
    !isReservation && enquiry.message
      ? textRow(`<em>"${escapeHtml(enquiry.message).replace(/\n/g, "<br />")}"</em>`)
      : null,
    button({ label: "Open Enquiries", href: siteLink("/admin/enquiries") }),
  ].filter(Boolean);

  return renderEmail({
    subject,
    preview: subject,
    blocks,
    audience: "staff",
  });
}

export default {
  key: "staff-new-enquiry",
  label: "Staff: New Enquiry",
  description: "Internal alert sent on every new contact or reservation enquiry.",
  audience: "staff",
  build,
  sample: () => ({ enquiry: sampleEnquiry() }),
};
