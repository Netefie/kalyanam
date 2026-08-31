import { Booking } from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields, isEmail, check } from "../utils/validate.js";
import { env } from "../config/env.js";
import { getAvailableCount } from "../services/availability.js";
import { quoteStay } from "../services/pricing.js";
import { resolveRoomForBooking, resolveStayDates } from "../services/bookingRequest.js";
import {
  createOrder,
  fetchPayment,
  refundPayment,
  verifyCheckoutSignature,
  verifyWebhookSignature,
  isPaymentEnabled,
} from "../services/razorpay.js";
import {
  applyPaymentSuccess,
  applyPaymentFailure,
  applyRefund,
  loadBookingForReconcile,
} from "../services/paymentReconciler.js";

function guardPaymentsEnabled() {
  if (!isPaymentEnabled()) {
    throw new ApiError(503, "Payments are not configured. Please try again later.");
  }
}

// POST /api/payments/order  (public) — prices the stay, holds the requested
// rooms for BOOKING_HOLD_MINUTES, and opens a Razorpay order for the total.
// The booking created here is `Pending` / `payment.status: created` until
// POST /api/payments/verify (or the webhook) confirms it.
export const createPaymentOrder = asyncHandler(async (req, res) => {
  guardPaymentsEnabled();

  const { guest, roomSlug, roomId, ratePlanCode, checkIn, checkOut, adults, children, rooms } =
    req.body;

  requireFields(guest || {}, ["firstName", "email", "phone"]);
  check(isEmail(guest.email), "Enter a valid email address");

  const room = await resolveRoomForBooking({ roomId, roomSlug });
  const { inDate, outDate } = resolveStayDates(checkIn, checkOut);
  const quote = await quoteStay({ room, ratePlanCode, checkIn: inDate, checkOut: outDate, rooms });

  const { available } = await getAvailableCount(room, inDate, outDate);
  if (quote.rooms > available) {
    throw new ApiError(
      409,
      available > 0
        ? `Only ${available} room(s) left for the selected dates`
        : "No rooms available for the selected dates"
    );
  }

  const holdExpiresAt = new Date(Date.now() + env.bookingHoldMinutes * 60 * 1000);

  const booking = await Booking.create({
    guest,
    roomType: room._id,
    roomName: room.name,
    ratePlanCode: quote.plan.code,
    ratePlanName: quote.plan.name,
    nightlyRate: quote.nightlyRate,
    checkIn: inDate,
    checkOut: outDate,
    nights: quote.nights,
    adults: Math.max(1, Number(adults) || 1),
    children: Math.max(0, Number(children) || 0),
    rooms: quote.rooms,
    amount: quote.total,
    pricing: {
      nightlyRate: quote.nightlyRate,
      subtotal: quote.subtotal,
      taxPercent: quote.taxPercent,
      taxAmount: quote.taxAmount,
      total: quote.total,
      currency: quote.currency,
    },
    status: "Pending",
    payment: { status: "created", currency: quote.currency },
    holdExpiresAt,
    source: "website",
  });

  // The order must exist for the booking to be payable — if Razorpay is
  // unreachable, don't leave an unpayable hold sitting on the inventory.
  let order;
  try {
    order = await createOrder({
      amount: quote.total,
      currency: quote.currency,
      receipt: booking.bookingCode,
      notes: { bookingId: booking._id.toString(), bookingCode: booking.bookingCode },
    });
  } catch (err) {
    await Booking.deleteOne({ _id: booking._id });
    throw err;
  }

  booking.payment.orderId = order.id;
  await booking.save();

  res.status(201).json({
    booking,
    order: { id: order.id, amount: order.amount, currency: order.currency },
    keyId: env.razorpay.keyId,
    holdExpiresAt,
    prefill: {
      name: `${guest.firstName} ${guest.lastName || ""}`.trim(),
      email: guest.email,
      contact: guest.phone,
    },
  });
});

// POST /api/payments/verify  (public) — called by the browser right after
// Razorpay Checkout returns. The checkout signature alone is not treated as
// proof of payment: we additionally re-fetch the payment from Razorpay and
// assert its order/amount/currency/status before confirming anything. This
// is what makes it safe to run alongside (and race with) the webhook.
export const verifyPayment = asyncHandler(async (req, res) => {
  guardPaymentsEnabled();

  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  requireFields(req.body, [
    "bookingId",
    "razorpay_order_id",
    "razorpay_payment_id",
    "razorpay_signature",
  ]);

  const booking = await loadBookingForReconcile(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (booking.payment.status === "paid") {
    return res.json({ booking, status: "paid" }); // idempotent: webhook may have already confirmed it
  }

  if (booking.payment.orderId !== razorpay_order_id) {
    throw new ApiError(400, "Payment verification failed");
  }

  const signatureValid = verifyCheckoutSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });
  if (!signatureValid) {
    throw new ApiError(400, "Payment verification failed");
  }

  // Never trust the signature alone — confirm the payment's real state,
  // amount and currency directly with Razorpay.
  const rpPayment = await fetchPayment(razorpay_payment_id);
  const expectedPaise = Math.round(booking.pricing.total * 100);
  const amountMatches = rpPayment.order_id === razorpay_order_id && rpPayment.amount === expectedPaise;
  const currencyMatches = rpPayment.currency === booking.pricing.currency;

  if (!amountMatches || !currencyMatches) {
    throw new ApiError(400, "Payment verification failed");
  }

  // All three outcomes below are 200s: a declined card or a payment still
  // settling are normal business outcomes of "we successfully checked",
  // not request errors — the frontend branches on the `status` field, not
  // the HTTP status. 4xx here is reserved for actual request problems
  // (forged signature, mismatched order/amount, missing fields).
  if (rpPayment.status === "captured") {
    const confirmed = await applyPaymentSuccess({ booking, rpPayment });
    return res.json({ booking: confirmed, status: "paid" });
  }

  if (rpPayment.status === "failed") {
    const failed = await applyPaymentFailure({
      booking,
      reason: rpPayment.error_description || "Payment failed",
    });
    return res.json({ booking: failed, status: "failed" });
  }

  // authorized-but-not-yet-captured (manual capture) or another transient
  // state — the webhook will settle this shortly; ask the client to wait.
  res.json({ booking, status: "processing" });
});

// POST /api/payments/webhook  (Razorpay → us) — the safety net for a guest
// who pays successfully but closes the tab before the browser can call
// /verify. Mounted with express.raw() ahead of the global JSON parser (see
// app.js) so the signature can be checked against the exact request bytes.
export const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const rawBody = req.body; // Buffer, thanks to express.raw() on this route

  if (!verifyWebhookSignature({ rawBody, signature })) {
    return res.status(400).json({ error: "Invalid webhook signature" });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  // From here on, always 200 — a malformed/unexpected event or a booking we
  // can't find won't be fixed by Razorpay retrying it, and 200 stops the
  // retry storm. Errors are logged for investigation instead.
  try {
    await routeWebhookEvent(event);
  } catch (err) {
    console.error("[webhook] processing failed:", event?.event, err.message);
  }

  res.status(200).json({ received: true });
});

async function routeWebhookEvent(event) {
  switch (event.event) {
    case "payment.captured":
    case "order.paid": {
      const payment = event.payload?.payment?.entity;
      if (!payment) return;
      const booking = await Booking.findOne({ "payment.orderId": payment.order_id });
      if (!booking) return;
      await applyPaymentSuccess({ booking, rpPayment: payment });
      return;
    }
    case "payment.failed": {
      const payment = event.payload?.payment?.entity;
      if (!payment) return;
      const booking = await Booking.findOne({ "payment.orderId": payment.order_id });
      if (!booking) return;
      await applyPaymentFailure({ booking, reason: payment.error_description || "Payment failed" });
      return;
    }
    case "refund.processed": {
      const refund = event.payload?.refund?.entity;
      if (!refund) return;
      const booking = await Booking.findOne({ "payment.paymentId": refund.payment_id });
      if (!booking) return;
      await applyRefund({ booking, rpRefund: refund, reason: "Processed via Razorpay" });
      return;
    }
    default:
      // Unhandled event type — nothing to reconcile.
      return;
  }
}

// GET /api/payments/lookup?code=BK-1001&email=guest@example.com  (public) —
// lets a guest pull up their own receipt without an account. Both the code
// and the email on the booking must match, so a leaked/guessed booking code
// alone can't be used to look someone else's stay up.
export const lookupBooking = asyncHandler(async (req, res) => {
  const { code, email } = req.query;
  check(code && email, "Booking reference and email are required");

  const booking = await Booking.findOne({
    bookingCode: String(code).trim(),
    "guest.email": String(email).trim().toLowerCase(),
  }).lean();

  if (!booking) throw new ApiError(404, "We couldn't find a booking with those details");
  res.json(booking);
});

// GET /api/payments  (admin) — transaction list: bookings that went through
// a Razorpay order, i.e. actual gateway payments (excludes offline/admin
// bookings, which never get an orderId).
export const listPayments = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const { status, search, from, to } = req.query;

  const filter = { "payment.orderId": { $ne: null, $exists: true } };
  if (status) filter["payment.status"] = status;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  if (search) {
    filter.$or = [
      { bookingCode: new RegExp(search, "i") },
      { "guest.firstName": new RegExp(search, "i") },
      { "guest.lastName": new RegExp(search, "i") },
      { "guest.email": new RegExp(search, "i") },
      { "payment.paymentId": new RegExp(search, "i") },
      { "payment.orderId": new RegExp(search, "i") },
    ];
  }

  const [items, total, totalsAgg] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
    Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          collected: { $sum: "$payment.amountPaid" },
          refunded: { $sum: "$payment.refundedAmount" },
        },
      },
    ]),
  ]);

  const totals = totalsAgg[0] || { collected: 0, refunded: 0 };

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    totals: { collected: totals.collected, refunded: totals.refunded, net: totals.collected - totals.refunded },
  });
});

// POST /api/payments/:bookingId/refund  (admin) — full or partial refund.
export const refundBooking = asyncHandler(async (req, res) => {
  guardPaymentsEnabled();

  const booking = await loadBookingForReconcile(req.params.bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");

  if (!["paid", "partially_refunded"].includes(booking.payment.status)) {
    throw new ApiError(400, "This booking has no completed payment to refund");
  }

  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;
  if (remaining <= 0) {
    throw new ApiError(400, "Nothing left to refund on this booking");
  }

  const requested = req.body.amount != null ? Number(req.body.amount) : remaining;
  if (!(requested > 0) || requested > remaining) {
    throw new ApiError(400, `Refund amount must be between ₹1 and ₹${remaining}`);
  }

  const rpRefund = await refundPayment({
    paymentId: booking.payment.paymentId,
    amount: requested,
    notes: { bookingCode: booking.bookingCode, reason: req.body.reason || "" },
  });

  const updated = await applyRefund({ booking, rpRefund, reason: req.body.reason });
  res.json(updated);
});
