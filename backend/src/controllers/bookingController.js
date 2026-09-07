import { Booking } from "../models/Booking.js";
import { Settings } from "../models/Settings.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields, check } from "../utils/validate.js";
import { getAvailableCount, reserveInventory } from "../services/availability.js";
import { quoteStay } from "../services/pricing.js";
import { resolveStayRequest } from "../services/bookingRequest.js";
import { applyStatusChange, cancelBooking } from "../services/bookingLifecycle.js";
import { onBookingConfirmed } from "../services/notifications.js";

// POST /api/bookings/quote  (public) — the authoritative price breakdown for
// a room/plan/dates/rooms selection, plus live availability for that range.
// The booking flow renders this rather than re-deriving totals client-side
// (see frontend hooks/useBookingQuote.ts) — see services/pricing.js for why.
export const quoteBooking = asyncHandler(async (req, res) => {
  const { roomSlug, roomId, ratePlanCode, checkIn, checkOut, rooms, adults, children } = req.body;

  const { room, inDate, outDate, rooms: roomCount } = await resolveStayRequest({
    roomId,
    roomSlug,
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
  });

  const quote = await quoteStay({ room, ratePlanCode, checkIn: inDate, checkOut: outDate, rooms: roomCount });
  const availability = await getAvailableCount(room, inDate, outDate);

  res.json({
    roomSlug: room.slug,
    roomName: room.name,
    ...quote,
    plan: { code: quote.plan.code, name: quote.plan.name, label: quote.plan.label },
    availability,
  });
});

// POST /api/bookings  (admin-only) — direct/manual booking creation that
// bypasses payment entirely (e.g. a phone reservation the front desk is
// recording). The website flow now creates bookings via
// POST /api/payments/order, which prices, holds inventory with an
// expiry, and only confirms once a payment is verified. This endpoint
// requires admin auth (see routes/bookingRoutes.js) specifically so it
// can't be used to plant unpaid, non-expiring holds on public inventory.
export const createBooking = asyncHandler(async (req, res) => {
  const { guest, roomSlug, roomId, ratePlanCode, checkIn, checkOut, adults, children, rooms } =
    req.body;

  requireFields(guest || {}, ["firstName", "email", "phone"]);

  // Staff can record a booking for a room currently hidden from the public
  // site (e.g. mid-relaunch, or one about to be retired) — only the guest
  // booking path requires the room to be `active`.
  const { room, inDate, outDate, rooms: roomCount } = await resolveStayRequest({
    roomId,
    roomSlug,
    checkIn,
    checkOut,
    rooms,
    adults,
    children,
    requireActive: false,
  });

  const quote = await quoteStay({ room, ratePlanCode, checkIn: inDate, checkOut: outDate, rooms: roomCount });

  const guestCount = Math.max(1, Number(adults) || 1);
  const childCount = Math.max(0, Number(children) || 0);

  // reserveInventory both blocks overbooking against the current count and
  // resolves the race where two requests both saw the last room free — see
  // services/availability.js.
  const booking = await reserveInventory({
    room,
    checkIn: inDate,
    checkOut: outDate,
    rooms: roomCount,
    build: () => ({
      guest,
      roomType: room._id,
      roomName: room.name,
      ratePlanCode: quote.plan.code,
      ratePlanName: quote.plan.name,
      ratePlanRefundable: quote.plan.refundable !== false,
      nightlyRate: quote.nightlyRate,
      checkIn: inDate,
      checkOut: outDate,
      nights: quote.nights,
      adults: guestCount,
      children: childCount,
      rooms: roomCount,
      amount: quote.total,
      pricing: {
        nightlyRate: quote.nightlyRate,
        subtotal: quote.subtotal,
        taxPercent: quote.taxPercent,
        taxAmount: quote.taxAmount,
        total: quote.total,
        currency: quote.currency,
      },
      // Admin-entered bookings are treated as already settled (cash/offline)
      // — confirmed immediately, no room hold/expiry to manage.
      status: "Confirmed",
      payment: { status: "paid", amountPaid: quote.total, paidAt: new Date(), method: "offline" },
      source: "admin",
    }),
  });

  // Awaited, but this still cannot fail or reject the request: notifications.js#safeSend
  // catches everything. sendMail() returns once the MailLog row is written and the job is
  // queued - milliseconds, not SMTP - so the cost here is a DB write, and the actual send is
  // flushed by drainMailQueue() in lambda.js. Without this await the handler could return
  // before the row was even created, and Lambda froze the write mid-flight: no row, no mail,
  // no error anywhere.
  await onBookingConfirmed(booking);

  res.status(201).json(booking);
});

// GET /api/bookings  (protected) — paginated + filterable for the admin table.
export const listBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const { status, paymentStatus, search } = req.query;

  // Soft-deleted bookings (see deleteBooking below) never appear in the
  // admin table — `{ deletedAt: null }` also matches rows where the field
  // was never set, so this needs no `$or`.
  const filter = { deletedAt: null };
  if (status) filter.status = status;
  if (paymentStatus) filter["payment.status"] = paymentStatus;
  if (search) {
    filter.$or = [
      { bookingCode: new RegExp(search, "i") },
      { roomName: new RegExp(search, "i") },
      { "guest.firstName": new RegExp(search, "i") },
      { "guest.lastName": new RegExp(search, "i") },
      { "guest.email": new RegExp(search, "i") },
      { "guest.phone": new RegExp(search, "i") },
      { "payment.paymentId": new RegExp(search, "i") },
    ];
  }

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  res.json({
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  });
});

// GET /api/bookings/:id  (protected)
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null }).lean();
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json(booking);
});

// PATCH /api/bookings/:id/status  (protected) — the routine forward
// progression through a stay (Confirmed → CheckedIn → CheckedOut, or
// reviving an Expired hold). Cancelling is refused here on purpose (see
// services/bookingLifecycle.js#applyStatusChange) — use the cancel actions
// below, which require an explicit refund decision whenever money was
// captured.
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null });
  if (!booking) throw new ApiError(404, "Booking not found");

  const updated = await applyStatusChange({ booking, next: status });
  res.json(updated);
});

// POST /api/bookings/:id/cancel  (protected) — admin cancellation. `refund`
// (optional) is `{ amount, reason }`; a captured, unrefunded payment
// requires it (see services/bookingLifecycle.js#cancelBooking).
export const cancelBookingAdmin = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null });
  if (!booking) throw new ApiError(404, "Booking not found");

  const { reason, refund } = req.body;
  const updated = await cancelBooking({ booking, reason, refund, by: "staff" });
  res.json(updated);
});

// POST /api/bookings/cancel  (public) — guest self-service cancellation.
// Same code+email pairing as GET /payments/lookup, so a leaked/guessed
// booking code alone can't cancel someone else's stay.
//
// A captured payment is only auto-refunded when the stay is still outside
// the configured free-cancellation window *and* the chosen rate plan was
// refundable — otherwise the guest is asked to contact the hotel rather
// than the refund happening (or being silently denied) automatically.
export const cancelBookingSelf = asyncHandler(async (req, res) => {
  const { code, email, reason } = req.body;
  check(code && email, "Booking reference and email are required");

  const booking = await Booking.findOne({
    bookingCode: String(code).trim(),
    "guest.email": String(email).trim().toLowerCase(),
    deletedAt: null,
  });
  if (!booking) throw new ApiError(404, "We couldn't find a booking with those details");

  if (booking.status === "Cancelled") {
    return res.json(booking); // idempotent — already cancelled
  }
  if (!["Pending", "Confirmed"].includes(booking.status)) {
    throw new ApiError(
      400,
      `This booking is ${booking.status.toLowerCase()} and can no longer be cancelled online — please contact us.`
    );
  }

  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;
  const hasCapturedPayment =
    ["paid", "partially_refunded"].includes(booking.payment.status) && remaining > 0;

  if (hasCapturedPayment) {
    const settings = await Settings.findOne({ key: "site" }).select("cancellationWindowHours").lean();
    const windowHours = settings?.cancellationWindowHours ?? 24;
    const hoursUntilCheckIn = (booking.checkIn.getTime() - Date.now()) / (60 * 60 * 1000);
    const eligible = booking.ratePlanRefundable !== false && hoursUntilCheckIn >= windowHours;

    if (!eligible) {
      throw new ApiError(
        400,
        booking.ratePlanRefundable === false
          ? "This is a non-refundable rate — please contact us to discuss cancelling this booking."
          : `Free cancellation closes ${windowHours}h before check-in — please contact us to cancel this booking.`
      );
    }
  }

  const updated = await cancelBooking({
    booking,
    reason: reason || "Cancelled by guest",
    refund: hasCapturedPayment ? { amount: remaining } : undefined,
    by: "guest",
  });

  res.json(updated);
});

// DELETE /api/bookings/:id  (protected) — soft delete: sets `deletedAt`
// instead of removing the document. A booking with captured, unrefunded
// money is refused outright (cancel + refund it first) so the refund
// ledger and the audit trail of what was actually charged can never be
// erased by an accidental or malicious delete.
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, deletedAt: null });
  if (!booking) throw new ApiError(404, "Booking not found");

  const remaining = booking.payment.amountPaid - booking.payment.refundedAmount;
  if (["paid", "partially_refunded"].includes(booking.payment.status) && remaining > 0) {
    throw new ApiError(
      400,
      `This booking has ₹${remaining} captured — cancel and refund it before deleting.`
    );
  }

  booking.deletedAt = new Date();
  await booking.save();
  res.json({ success: true });
});
