import { RoomBlock } from "../models/RoomBlock.js";
import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { requireFields } from "../utils/validate.js";
import { toHotelDay } from "../utils/dates.js";

// GET /api/room-blocks?roomType=&from=&to=  (admin) — powers the
// Availability calendar's block list. `from`/`to` are optional; when given,
// only blocks overlapping that range are returned (same half-open
// convention as everywhere else — see services/availability.js).
export const listRoomBlocks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.roomType) filter.roomType = req.query.roomType;

  const from = req.query.from ? toHotelDay(req.query.from) : null;
  const to = req.query.to ? toHotelDay(req.query.to) : null;
  if (from && to) {
    filter.from = { $lt: to };
    filter.to = { $gt: from };
  }

  const blocks = await RoomBlock.find(filter).sort({ from: 1 }).lean();
  res.json({ items: blocks });
});

// POST /api/room-blocks  (admin) — block out inventory (maintenance, an
// owner stay, a group hold) for a date range. Consumes stock exactly like a
// booking — see services/availability.js, which sums both against the same
// `totalRooms` ceiling.
export const createRoomBlock = asyncHandler(async (req, res) => {
  const { roomType, from, to, rooms, reason } = req.body;
  requireFields(req.body, ["roomType", "from", "to", "rooms"]);

  const room = await RoomType.findById(roomType).select("totalRooms").lean();
  if (!room) throw new ApiError(404, "Room type not found");

  const fromDate = toHotelDay(from);
  const toDate = toHotelDay(to);
  if (!fromDate || !toDate || toDate <= fromDate) {
    throw new ApiError(400, "Valid from and to dates are required");
  }

  const roomCount = Number(rooms);
  if (!(roomCount > 0)) throw new ApiError(400, "rooms must be a positive number");
  if (roomCount > room.totalRooms) {
    throw new ApiError(400, `This room type only has ${room.totalRooms} room(s) total`);
  }

  const block = await RoomBlock.create({
    roomType,
    from: fromDate,
    to: toDate,
    rooms: roomCount,
    reason: reason || "",
    createdBy: req.admin?.sub,
  });

  res.status(201).json(block);
});

// DELETE /api/room-blocks/:id  (admin)
export const deleteRoomBlock = asyncHandler(async (req, res) => {
  const block = await RoomBlock.findByIdAndDelete(req.params.id);
  if (!block) throw new ApiError(404, "Block not found");
  res.json({ success: true });
});
