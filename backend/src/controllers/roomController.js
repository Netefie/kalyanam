import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getAvailableCount,
  getAvailabilityMap,
  getDailyAvailability,
} from "../services/availability.js";
import { toPublicRoom } from "../services/ratePlans.js";
import { parseStayDates, toHotelDay, toDayKey } from "../utils/dates.js";

// GET /api/rooms  (public) — active rooms for the website.
// GET /api/rooms?all=true  (used by admin) — includes inactive rooms.
export const listRooms = asyncHandler(async (req, res) => {
  const includeInactive = req.query.all === "true" && req.admin;
  const filter = includeInactive ? {} : { active: true };

  // .lean() returns plain objects — lighter and faster for read-only lists.
  const rooms = await RoomType.find(filter).sort({ featured: -1, price: 1 }).lean();
  res.json(rooms.map(toPublicRoom));
});

// GET /api/rooms/availability?checkIn=&checkOut=  (public) — one batch
// availability read for every active room over a shared date range,
// replacing the guest booking flow's former per-room fan-out (one request
// per room, per date change — see frontend/hooks/useRoomAvailability.ts).
// Keyed by slug, since that's the identifier the browser already works
// with (services/availability.js#getAvailabilityMap keys its own result by
// _id, which isn't meaningful to the browser).
export const getBatchAvailability = asyncHandler(async (req, res) => {
  const parsed = parseStayDates(req.query.checkIn, req.query.checkOut);
  if (!parsed.ok) throw new ApiError(400, parsed.message);

  const rooms = await RoomType.find({ active: true }).select("slug totalRooms").lean();
  const byId = await getAvailabilityMap(rooms, parsed.inDate, parsed.outDate);

  const bySlug = {};
  for (const room of rooms) {
    bySlug[room.slug] = byId[String(room._id)];
  }

  res.json({ checkIn: parsed.inDate, checkOut: parsed.outDate, rooms: bySlug });
});

// GET /api/rooms/availability/calendar?from=&to=[&slug=]  (public) — per-day
// availability across a range: which days are sold out, for the guest
// date-picker, and the source data for the admin Availability calendar
// grid. Omit `slug` to get every active room; admins can pass a specific
// (possibly inactive) slug to inspect one room type.
export const getAvailabilityCalendar = asyncHandler(async (req, res) => {
  const from = toHotelDay(req.query.from);
  const to = toHotelDay(req.query.to);
  if (!from || !to || to <= from) {
    throw new ApiError(400, "Valid from and to query dates are required");
  }

  const filter = req.query.slug ? { slug: req.query.slug } : { active: true };
  const rooms = await RoomType.find(filter).select("slug name totalRooms").lean();

  const perRoom = await Promise.all(
    rooms.map(async (room) => ({
      slug: room.slug,
      name: room.name,
      totalRooms: room.totalRooms,
      days: await getDailyAvailability(room, from, to),
    }))
  );

  res.json({ from: toDayKey(from), to: toDayKey(to), rooms: perRoom });
});

// GET /api/rooms/:slug  (public)
export const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findOne({ slug: req.params.slug }).lean();
  if (!room) throw new ApiError(404, "Room not found");
  res.json(toPublicRoom(room));
});

// GET /api/rooms/:slug/availability?checkIn=&checkOut=  (public) — a single
// room's availability, used by the room detail view. The guest booking list
// uses the batch endpoint above instead.
export const getRoomAvailability = asyncHandler(async (req, res) => {
  const room = await RoomType.findOne({ slug: req.params.slug });
  if (!room) throw new ApiError(404, "Room not found");

  const parsed = parseStayDates(req.query.checkIn, req.query.checkOut);
  if (!parsed.ok) throw new ApiError(400, parsed.message);

  const counts = await getAvailableCount(room, parsed.inDate, parsed.outDate);
  res.json({ slug: room.slug, ...counts });
});

// POST /api/rooms  (protected)
export const createRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.create(req.body);
  res.status(201).json(toPublicRoom(room));
});

// PUT /api/rooms/:id  (protected)
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new ApiError(404, "Room not found");
  res.json(toPublicRoom(room));
});

// DELETE /api/rooms/:id  (protected)
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndDelete(req.params.id);
  if (!room) throw new ApiError(404, "Room not found");
  res.json({ success: true });
});
