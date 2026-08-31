// Single registry of every transactional email template — keyed by the
// same `key` each module declares on its default export. Drives:
//   - services/notifications.js (which key + data to send for an event)
//   - controllers/mailController.js (admin preview gallery, send-test)
//   - scripts/test-mail.mjs (renders + sends every registered template)
// Adding a template is: write the file, add one line here. Nothing else
// needs to know a new template exists.
import bookingConfirmed from "./bookingConfirmed.js";
import bookingCancelled from "./bookingCancelled.js";
import bookingReminder from "./bookingReminder.js";
import bookingPostStay from "./bookingPostStay.js";
import holdExpiring from "./holdExpiring.js";
import paymentFailed from "./paymentFailed.js";
import refundProcessed from "./refundProcessed.js";
import enquiryReceived from "./enquiryReceived.js";
import subscriberWelcome from "./subscriberWelcome.js";
import staffNewBooking from "./staffNewBooking.js";
import staffNewEnquiry from "./staffNewEnquiry.js";
import staffPaymentFailed from "./staffPaymentFailed.js";
import staffRefund from "./staffRefund.js";
import staffNewSubscriber from "./staffNewSubscriber.js";
import staffBookingNeedsAttention from "./staffBookingNeedsAttention.js";

const all = [
  bookingConfirmed,
  bookingCancelled,
  bookingReminder,
  bookingPostStay,
  holdExpiring,
  paymentFailed,
  refundProcessed,
  enquiryReceived,
  subscriberWelcome,
  staffNewBooking,
  staffNewEnquiry,
  staffPaymentFailed,
  staffRefund,
  staffNewSubscriber,
  staffBookingNeedsAttention,
];

export const templates = Object.fromEntries(all.map((t) => [t.key, t]));

export function getTemplate(key) {
  return templates[key] || null;
}

// Listing shape for the admin gallery — no `build` function (not JSON-safe
// / not needed client-side).
export function listTemplates() {
  return all.map(({ key, label, description, audience }) => ({ key, label, description, audience }));
}
