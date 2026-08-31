// Shared "resolve what's being booked" step used by every entry point that
// needs a priced stay: the public quote, order creation, and the admin
// direct booking create. Pulled out so room lookup + date/occupancy
// validation is defined exactly once instead of drifting between
// controllers.
import { RoomType } from "../models/RoomType.js";
import { ApiError } from "../utils/ApiError.js";
import { parseStayDates } from "../utils/dates.js";
import { env } from "../config/env.js";

// Resolves the room by id (preferred) or slug. Pricing is always derived
// server-side from this document — a client-supplied price is never trusted.
//
// `requireActive` (default true) keeps a room an admin has hidden from the
// live site off the public booking path too — listRooms() already excludes
// it from GET /rooms, but nothing previously stopped a guest who had the
// slug/id from booking it directly. Admin's own manual entry
// (controllers/bookingController.js#createBooking) passes
// `requireActive: false` so staff can still book a room they're about to
// retire, or one hidden while its listing photos are being redone.
export async function resolveRoomForBooking({ roomId, roomSlug, requireActive = true }) {
  const filter = roomId ? { _id: roomId } : { slug: roomSlug };
  if (requireActive) filter.active = true;

  const room = await RoomType.findOne(filter);
  if (!room) throw new ApiError(404, "Selected room type not found");
  return room;
}

// Parses + validates checkIn/checkOut against the site's booking policy
// (utils/dates.js#parseStayDates), throwing a 400 with the specific reason
// (past date / too long / too far ahead / malformed) instead of one generic
// message for every kind of bad range.
export function resolveStayDates(checkIn, checkOut, limits) {
  const parsed = parseStayDates(checkIn, checkOut, limits);
  if (!parsed.ok) throw new ApiError(400, parsed.message);
  return parsed;
}

// Rooms requested must fit within the configured cap, and the party must
// fit within the room's own per-room guest cap multiplied by rooms booked
// (a party of 4 across 2 double rooms fits even though no single room
// holds 4). Neither check previously existed anywhere in the backend — a
// request for 200 rooms or a party of 50 in one Deluxe room priced and
// created successfully as long as inventory happened to allow it.
function checkOccupancy(room, { rooms, adults, children }) {
  if (rooms > env.booking.maxRooms) {
    throw new ApiError(400, `A single booking is limited to ${env.booking.maxRooms} rooms`);
  }
  const guests = adults + children;
  const capacity = room.maxGuests * rooms;
  if (guests > capacity) {
    throw new ApiError(
      400,
      `${room.name} fits up to ${room.maxGuests} guest(s) per room — ${rooms} room(s) hold up to ${capacity}`
    );
  }
}

// The full "what is being booked" resolution: room, dates, and occupancy,
// in one call so /bookings/quote, /bookings, and /payments/order can't
// silently drift out of sync on which rules they enforce.
export async function resolveStayRequest({
  roomId,
  roomSlug,
  checkIn,
  checkOut,
  rooms,
  adults,
  children,
  requireActive = true,
  dateLimits,
}) {
  const room = await resolveRoomForBooking({ roomId, roomSlug, requireActive });
  const { inDate, outDate, nights } = resolveStayDates(checkIn, checkOut, dateLimits);

  const roomCount = Math.max(1, Number(rooms) || 1);
  checkOccupancy(room, {
    rooms: roomCount,
    adults: Math.max(1, Number(adults) || 1),
    children: Math.max(0, Number(children) || 0),
  });

  return { room, inDate, outDate, nights, rooms: roomCount };
}
