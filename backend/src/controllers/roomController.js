import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getAvailableCount } from "../services/availability.js";

// GET /api/rooms  (public) — active rooms for the website.
// GET /api/rooms?all=true  (used by admin) — includes inactive rooms.
export const listRooms = asyncHandler(async (req, res) => {
  const includeInactive = req.query.all === "true" && req.admin;
  const filter = includeInactive ? {} : { active: true };

  // .lean() returns plain objects — lighter and faster for read-only lists.
  const rooms = await RoomType.find(filter).sort({ featured: -1, price: 1 }).lean();
  res.json(rooms);
});

// GET /api/rooms/:slug  (public)
export const getRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findOne({ slug: req.params.slug }).lean();
  if (!room) throw new ApiError(404, "Room not found");
  res.json(room);
});

// GET /api/rooms/:slug/availability?checkIn=&checkOut=  (public)
export const getRoomAvailability = asyncHandler(async (req, res) => {
  const room = await RoomType.findOne({ slug: req.params.slug });
  if (!room) throw new ApiError(404, "Room not found");

  const checkIn = new Date(req.query.checkIn);
  const checkOut = new Date(req.query.checkOut);
  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    checkOut <= checkIn
  ) {
    throw new ApiError(400, "Valid checkIn and checkOut query dates are required");
  }

  const counts = await getAvailableCount(room, checkIn, checkOut);
  res.json({ slug: room.slug, ...counts });
});

// POST /api/rooms  (protected)
export const createRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.create(req.body);
  res.status(201).json(room);
});

// PUT /api/rooms/:id  (protected)
export const updateRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new ApiError(404, "Room not found");
  res.json(room);
});

// DELETE /api/rooms/:id  (protected)
export const deleteRoom = asyncHandler(async (req, res) => {
  const room = await RoomType.findByIdAndDelete(req.params.id);
  if (!room) throw new ApiError(404, "Room not found");
  res.json({ success: true });
});
