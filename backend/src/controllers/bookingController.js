import { Booking } from "../models/Booking.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields } from "../utils/validate.js";
import { getAvailableCount } from "../services/availability.js";
import { quoteStay } from "../services/pricing.js";
import { resolveRoomForBooking, resolveStayDates } from "../services/bookingRequest.js";
import { onBookingConfirmed, onBookingCancelled } from "../services/notifications.js";

// POST /api/bookings/quote  (public) — the authoritative price breakdown for
// a room/plan/dates/rooms selection, plus live availability for that range.
// The booking flow renders this rather than re-deriving totals client-side
// (see frontend hooks/useBookingQuote.ts) — see services/pricing.js for why.
export const quoteBooking = asyncHandler(async (req, res) => {
  const { roomSlug, roomId, ratePlanCode, checkIn, checkOut, rooms } = req.body;

  const room = await resolveRoomForBooking({ roomId, roomSlug });
  const { inDate, outDate } = resolveStayDates(checkIn, checkOut);

  const quote = await quoteStay({ room, ratePlanCode, checkIn: inDate, checkOut: outDate, rooms });
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

  const room = await resolveRoomForBooking({ roomId, roomSlug });
  const { inDate, outDate } = resolveStayDates(checkIn, checkOut);

  const quote = await quoteStay({ room, ratePlanCode, checkIn: inDate, checkOut: outDate, rooms });

  // Block overbooking: requested rooms must fit within remaining inventory
  // for the selected dates.
  const { available } = await getAvailableCount(room, inDate, outDate);
  if (quote.rooms > available) {
    throw new ApiError(
      409,
      available > 0
        ? `Only ${available} room(s) left for the selected dates`
        : "No rooms available for the selected dates"
    );
  }

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
    // Admin-entered bookings are treated as already settled (cash/offline) —
    // confirmed immediately, no room hold/expiry to manage.
    status: "Confirmed",
    payment: { status: "paid", amountPaid: quote.total, paidAt: new Date(), method: "offline" },
    source: "admin",
  });

  // Fire-and-forget: a slow/failed email must never block or fail the
  // booking. onBookingConfirmed() no-ops silently until SMTP is configured.
  onBookingConfirmed(booking);

  res.status(201).json(booking);
});

// GET /api/bookings  (protected) — paginated + filterable for the admin table.
export const listBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const { status, paymentStatus, search } = req.query;

  const filter = {};
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
  const booking = await Booking.findById(req.params.id).lean();
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json(booking);
});

// PATCH /api/bookings/:id/status  (protected)
export const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Read the prior status first so a cancellation email only fires on the
  // actual transition into Cancelled, not on every PATCH that happens to
  // (re-)set a booking that was already Cancelled.
  const previous = await Booking.findById(req.params.id).select("status").lean();
  if (!previous) throw new ApiError(404, "Booking not found");

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (status === "Cancelled" && previous.status !== "Cancelled") {
    onBookingCancelled(booking, { reason: "Cancelled by hotel staff" });
  }

  res.json(booking);
});

// DELETE /api/bookings/:id  (protected)
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ success: true });
});
