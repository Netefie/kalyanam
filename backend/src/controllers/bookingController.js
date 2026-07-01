import { Booking } from "../models/Booking.js";
import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAvailableCount } from "../services/availability.js";
import { sendMail } from "../services/mailer.js";
import { bookingConfirmationEmail } from "../emails/bookingConfirmation.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function nightsBetween(checkIn, checkOut) {
  const n = Math.ceil((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
  return n > 0 ? n : 1;
}

// POST /api/bookings  (public) — created from the website booking flow.
export const createBooking = asyncHandler(async (req, res) => {
  const { guest, roomSlug, roomId, checkIn, checkOut, adults, children, rooms } =
    req.body;

  if (!guest?.firstName || !guest?.email || !guest?.phone) {
    throw new ApiError(400, "Guest name, email and phone are required");
  }

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) {
    throw new ApiError(400, "Valid check-in and check-out dates are required");
  }
  if (outDate <= inDate) {
    throw new ApiError(400, "Check-out must be after check-in");
  }

  // Resolve the room by id or slug so pricing is authoritative (never trust a
  // client-supplied amount).
  const room = await RoomType.findOne(
    roomId ? { _id: roomId } : { slug: roomSlug }
  );
  if (!room) throw new ApiError(404, "Selected room type not found");

  const nights = nightsBetween(inDate, outDate);
  const roomCount = Math.max(1, Number(rooms) || 1);
  const nightlyRate = room.offerPrice ?? room.price;
  const amount = nightlyRate * nights * roomCount;

  // Block overbooking: requested rooms must fit within remaining inventory
  // for the selected dates.
  const { available } = await getAvailableCount(room, inDate, outDate);
  if (roomCount > available) {
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
    checkIn: inDate,
    checkOut: outDate,
    nights,
    adults: Math.max(1, Number(adults) || 1),
    children: Math.max(0, Number(children) || 0),
    rooms: roomCount,
    amount,
    status: "Pending",
    source: "website",
  });

  // Fire-and-forget: a slow/failed email must never block or fail the booking.
  // No-ops silently until SMTP is configured in the environment.
  sendMail({
    to: booking.guest.email,
    ...bookingConfirmationEmail(booking),
  }).catch((err) => console.error("[mail] confirmation failed:", err.message));

  res.status(201).json(booking);
});

// GET /api/bookings  (protected) — paginated + filterable for the admin table.
export const listBookings = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { bookingCode: new RegExp(search, "i") },
      { roomName: new RegExp(search, "i") },
      { "guest.firstName": new RegExp(search, "i") },
      { "guest.lastName": new RegExp(search, "i") },
      { "guest.email": new RegExp(search, "i") },
      { "guest.phone": new RegExp(search, "i") },
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
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json(booking);
});

// DELETE /api/bookings/:id  (protected)
export const deleteBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findByIdAndDelete(req.params.id);
  if (!booking) throw new ApiError(404, "Booking not found");
  res.json({ success: true });
});
