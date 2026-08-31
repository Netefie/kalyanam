// Shared "resolve what's being booked" step used by every entry point that
// needs a priced stay: the public quote, order creation, and the legacy
// direct booking create. Pulled out so room lookup + date validation is
// defined exactly once instead of drifting between controllers.
import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { parseStayDates } from "../utils/dates.js";

// Resolves the room by id (preferred) or slug. Pricing is always derived
// server-side from this document — a client-supplied price is never trusted.
export async function resolveRoomForBooking({ roomId, roomSlug }) {
  const room = await RoomType.findOne(roomId ? { _id: roomId } : { slug: roomSlug });
  if (!room) throw new ApiError(404, "Selected room type not found");
  return room;
}

// Parses + validates checkIn/checkOut, throwing the same 400 message the
// booking flow has always shown for a bad date range.
export function resolveStayDates(checkIn, checkOut) {
  const parsed = parseStayDates(checkIn, checkOut);
  if (!parsed) throw new ApiError(400, "Valid check-in and check-out dates are required");
  return parsed;
}
