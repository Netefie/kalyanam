// Realistic fixture data for template previews (admin gallery) and
// scripts/test-mail.mjs. Dates are relative to "now" so a preview taken any
// day still reads sensibly — e.g. a pre-arrival reminder for a stay that's
// genuinely a couple of days out, not a hardcoded date in the past.
const DAY_MS = 24 * 60 * 60 * 1000;

function inDays(n) {
  return new Date(Date.now() + n * DAY_MS);
}

export function sampleBooking(overrides = {}) {
  return {
    _id: "665f1a2b3c4d5e6f7a8b9c0d",
    bookingCode: "BK-1042",
    guest: {
      title: "Mr",
      firstName: "Arjun",
      lastName: "Mehta",
      email: "arjun.mehta@example.com",
      phone: "+91 98765 43210",
    },
    roomName: "Royal Heritage Suite",
    ratePlanName: "Room with Breakfast",
    checkIn: inDays(2),
    checkOut: inDays(4),
    nights: 2,
    adults: 2,
    children: 1,
    rooms: 1,
    amount: 23600,
    pricing: {
      nightlyRate: 10000,
      subtotal: 20000,
      taxPercent: 18,
      taxAmount: 3600,
      total: 23600,
      currency: "INR",
    },
    payment: {
      status: "paid",
      paymentId: "pay_QW3xample1234",
      method: "card",
      amountPaid: 23600,
      refundedAmount: 0,
      refunds: [],
      failureReason: "Your card issuer declined the payment.",
    },
    holdExpiresAt: new Date(Date.now() + 4 * 60 * 1000),
    status: "Confirmed",
    source: "website",
    ...overrides,
  };
}

export function sampleRefund(overrides = {}) {
  return {
    refundId: "rfnd_QW3xample5678",
    amount: 5000,
    status: "processed",
    reason: "Guest requested a date change",
    ...overrides,
  };
}

export function sampleEnquiry(overrides = {}) {
  return {
    _id: "665f1a2b3c4d5e6f7a8b9c1e",
    type: "contact",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 91234 56789",
    subject: "Wedding venue availability",
    message:
      "Hi, we're looking at hosting a 200-guest wedding this December. Could you share availability and package details?",
    roomType: "",
    checkIn: null,
    checkOut: null,
    rooms: null,
    adults: null,
    children: null,
    createdAt: new Date(),
    ...overrides,
  };
}

export function sampleReservationEnquiry(overrides = {}) {
  return sampleEnquiry({
    type: "reservation",
    subject: "",
    message: "",
    roomType: "Royal Heritage Suite",
    checkIn: inDays(10),
    checkOut: inDays(13),
    rooms: 1,
    adults: 2,
    children: 0,
    ...overrides,
  });
}

export function sampleSubscriber(overrides = {}) {
  return {
    _id: "665f1a2b3c4d5e6f7a8b9c2f",
    name: "Neha Kapoor",
    email: "neha.kapoor@example.com",
    phone: "+91 99887 76655",
    source: "offer-popup",
    createdAt: new Date(),
    ...overrides,
  };
}
