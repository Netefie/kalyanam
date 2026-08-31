// The one place that maps a business event to who gets emailed and with
// which template. Controllers and services call these — never sendMail()
// directly — so "what mail does a new booking trigger" has a single answer
// instead of being reconstructed independently at each call site (which is
// how bookingController.js and paymentReconciler.js used to each compose
// their own copy of the confirmation email).
//
// Every export here resolves — it never rejects. Each send is wrapped so a
// failure (a bad template, a DB hiccup while claiming the MailLog row) is
// logged and contained instead of propagating to the caller, which means
// none of these ever need a `.catch()` at the call site: a booking/enquiry/
// subscriber write must never fail or block because mail had a problem.
import { env } from "../config/env.js";
import { sendMail } from "./mailer.js";

async function safeSend(args) {
  try {
    await sendMail(args);
  } catch (err) {
    console.error(`[mail] ${args.template} -> ${args.to} failed to queue: ${err.message}`);
  }
}

// Internal alerts default to the sending mailbox itself when MAIL_ADMIN_TO
// is blank, so staff notifications work out of the box off just SMTP_USER.
function staffAddress() {
  return env.mail.adminTo || env.mail.user || "";
}

function sendToStaff(args) {
  const to = staffAddress();
  if (!to) return Promise.resolve(); // mail not configured at all — nothing to notify
  return safeSend({ ...args, to });
}

/* ------------------------------- bookings ------------------------------- */

// Payment verified (services/paymentReconciler.js#applyPaymentSuccess) or an
// admin recorded an already-settled offline booking
// (controllers/bookingController.js#createBooking).
export function onBookingConfirmed(booking) {
  const refs = { booking: booking._id };
  return Promise.all([
    safeSend({
      template: "booking-confirmed",
      to: booking.guest.email,
      data: { booking },
      dedupeKey: `booking-confirmed:${booking.bookingCode}`,
      refs,
    }),
    sendToStaff({
      template: "staff-new-booking",
      data: { booking },
      dedupeKey: `staff-new-booking:${booking.bookingCode}`,
      refs,
    }),
  ]);
}

// A booking's status moves to Cancelled
// (controllers/bookingController.js#updateBookingStatus).
export function onBookingCancelled(booking, { reason } = {}) {
  return safeSend({
    template: "booking-cancelled",
    to: booking.guest.email,
    data: { booking, reason },
    dedupeKey: `booking-cancelled:${booking.bookingCode}`,
    refs: { booking: booking._id },
  });
}

// A payment attempt fails (services/paymentReconciler.js#applyPaymentFailure).
// Keyed by attempt number so a guest who fails, retries, and fails again is
// notified each time, while the webhook/`verify` race for the *same*
// attempt only ever sends one email.
export function onPaymentFailed(booking) {
  const refs = { booking: booking._id };
  const key = `payment-failed:${booking.bookingCode}:${booking.payment.attempts}`;
  return Promise.all([
    safeSend({ template: "payment-failed", to: booking.guest.email, data: { booking }, dedupeKey: key, refs }),
    sendToStaff({ template: "staff-payment-failed", data: { booking }, dedupeKey: `staff-${key}`, refs }),
  ]);
}

// A refund (full or partial) is recorded (services/paymentReconciler.js#applyRefund).
// Keyed by Razorpay's refund id — already this codebase's idempotency key
// for "has this refund been recorded" (see applyRefund's alreadyRecorded
// check), so reusing it here keeps one refund from ever emailing twice.
export function onRefundProcessed(booking, refund) {
  const refs = { booking: booking._id };
  return Promise.all([
    safeSend({
      template: "refund-processed",
      to: booking.guest.email,
      data: { booking, refund },
      dedupeKey: `refund-processed:${refund.refundId}`,
      refs,
    }),
    sendToStaff({
      template: "staff-refund",
      data: { booking, refund },
      dedupeKey: `staff-refund:${refund.refundId}`,
      refs,
    }),
  ]);
}

// A room hold on an unpaid Pending booking is about to expire
// (services/mailScheduler.js). No staff alert — this is guest-recovery
// mail, not an event staff need to act on.
export function onHoldExpiring(booking) {
  return safeSend({
    template: "hold-expiring",
    to: booking.guest.email,
    data: { booking },
    dedupeKey: `hold-expiring:${booking.bookingCode}`,
    refs: { booking: booking._id },
  });
}

// ~2 days before check-in (services/mailScheduler.js).
export function onPreArrival(booking) {
  return safeSend({
    template: "booking-reminder",
    to: booking.guest.email,
    data: { booking },
    dedupeKey: `booking-reminder:${booking.bookingCode}`,
    refs: { booking: booking._id },
  });
}

// A day or two after check-out (services/mailScheduler.js).
export function onPostStay(booking) {
  return safeSend({
    template: "booking-post-stay",
    to: booking.guest.email,
    data: { booking },
    dedupeKey: `booking-post-stay:${booking.bookingCode}`,
    refs: { booking: booking._id },
  });
}

/* --------------------------- enquiries & subscribers --------------------------- */

// New contact-form or reservation enquiry
// (controllers/enquiryController.js#createEnquiry). The guest ack only
// fires when an email was given — the reservation popup's email field is
// optional — but staff always hears about it either way.
export function onEnquiryCreated(enquiry) {
  const refs = { enquiry: enquiry._id };
  const sends = [
    sendToStaff({ template: "staff-new-enquiry", data: { enquiry }, dedupeKey: `staff-new-enquiry:${enquiry._id}`, refs }),
  ];
  if (enquiry.email) {
    sends.push(
      safeSend({
        template: "enquiry-received",
        to: enquiry.email,
        data: { enquiry },
        dedupeKey: `enquiry-received:${enquiry._id}`,
        refs,
      })
    );
  }
  return Promise.all(sends);
}

// A genuinely new newsletter signup
// (controllers/subscriberController.js#createSubscriber). The endpoint
// upserts by email, so a repeat popup submission from an existing
// subscriber must not re-trigger the welcome mail — callers pass `isNew`
// from the upsert result (`result.lastErrorObject.upserted` / equivalent)
// rather than this function guessing from the document alone.
export function onSubscriberCreated(subscriber, { isNew } = {}) {
  if (!isNew) return Promise.resolve();
  const refs = { subscriber: subscriber._id };
  return Promise.all([
    safeSend({
      template: "subscriber-welcome",
      to: subscriber.email,
      data: { subscriber },
      dedupeKey: `subscriber-welcome:${subscriber._id}`,
      refs,
    }),
    sendToStaff({
      template: "staff-new-subscriber",
      data: { subscriber },
      dedupeKey: `staff-new-subscriber:${subscriber._id}`,
      refs,
    }),
  ]);
}
