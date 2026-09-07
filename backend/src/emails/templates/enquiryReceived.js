// Acknowledgement sent to a guest right after they submit the contact form
// or the reservation "check availability" popup
// (controllers/enquiryController.js#createEnquiry via
// services/notifications.js#onEnquiryCreated). Only fires when the guest
// gave an email — the reservation popup's email field is optional.
import { titleBlock, textRow, kvTable, button, signatureRow, escapeHtml, fmtDate } from "../components.js";
import { renderEmail } from "../render.js";
import { siteLink } from "./helpers.js";
import { sampleEnquiry } from "./sampleData.js";

export function build({ enquiry }) {
  const isReservation = enquiry.type === "reservation";
  const name = enquiry.name?.trim() || "there";
  const subject = isReservation
    ? "We've Received Your Reservation Request · Kalyanam Hotel & Resort"
    : "We've Received Your Enquiry · Kalyanam Hotel & Resort";

  const summaryRows = isReservation
    ? [
        enquiry.roomType ? { label: "Room Type", value: escapeHtml(enquiry.roomType) } : null,
        enquiry.checkIn ? { label: "Check-in", value: fmtDate(enquiry.checkIn) } : null,
        enquiry.checkOut ? { label: "Check-out", value: fmtDate(enquiry.checkOut) } : null,
        enquiry.rooms ? { label: "Rooms", value: String(enquiry.rooms) } : null,
      ]
    : [
        enquiry.subject ? { label: "Subject", value: escapeHtml(enquiry.subject) } : null,
        { label: "Message", value: escapeHtml(enquiry.message).replace(/\n/g, "<br />") },
      ];

  const blocks = [
    titleBlock("Thank You For Reaching Out"),
    textRow(
      `Dear <strong style="color:#2d2318;">${escapeHtml(name)}</strong>,<br /><br />
      ${
        isReservation
          ? "Thank you for your interest in staying with us. We've received your reservation request and our team will get back to you shortly with availability and rates."
          : "Thank you for getting in touch. We've received your message and our team will respond within 24 hours."
      }`
    ),
    summaryRows.filter(Boolean).length ? kvTable(summaryRows) : null,
    button({ label: "Explore Our Rooms & Suites", href: siteLink("/accommodations") }),
    signatureRow(),
  ].filter(Boolean);

  return renderEmail({
    subject,
    preview: isReservation
      ? "We've received your reservation request."
      : "We've received your message and will respond shortly.",
    blocks,
  });
}

export default {
  key: "enquiry-received",
  label: "Enquiry Received",
  description: "Sent to the guest right after they submit the contact form or a reservation enquiry.",
  audience: "guest",
  build,
  sample: () => ({ enquiry: sampleEnquiry() }),
};
