// Single module for "how much of this room type is actually sellable" —
// every read (the guest booking flow, the admin availability calendar) and
// the one write that matters (reserving a room against a stay) go through
// here, so inventory can only ever be counted or committed one way.
import { Booking } from "../models/Booking.js";
import { RoomBlock } from "../models/RoomBlock.js";
import { ApiError } from "../utils/ApiError.js";
import { eachDay, toDayKey } from "../utils/dates.js";

// Statuses that hold inventory. Cancelled / CheckedOut / Expired bookings
// free the room.
const HOLDING_STATUSES = ["Pending", "Confirmed", "CheckedIn"];

// A booking's own overlap + hold-validity match, factored out so the batch
// aggregation (getAvailabilityMap) and the single-room query
// (countBookedRooms) build the exact same filter instead of two hand-copied
// versions drifting apart.
//
// A `Pending` website booking only holds inventory while `holdExpiresAt` is
// unset (legacy/admin bookings) or still in the future — once a guest
// abandons checkout the hold lapses and services/bookingSweeper.js later
// flips the booking to `Expired`, but availability stops counting it the
// moment the hold time passes rather than waiting for the sweep.
function bookingOverlapMatch(checkIn, checkOut) {
  return {
    status: { $in: HOLDING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    $or: [{ holdExpiresAt: null }, { holdExpiresAt: { $gt: new Date() } }],
  };
}

function blockOverlapMatch(checkIn, checkOut) {
  return { from: { $lt: checkOut }, to: { $gt: checkIn } };
}

// Sum of rooms already booked for a room type over a date range. Two stays
// overlap when one starts before the other ends and vice versa (half-open
// interval: checkout day is free again).
//
// `maxId` restricts the sum to bookings created at or before a given
// document — the tie-break reserveInventory() uses to resolve two requests
// that raced for the same last room (Mongo ObjectIds are monotonically
// increasing per-process, so "lowest _id among the overlapping set" is a
// stable, deterministic "who got here first" without needing a DB
// transaction or a second collection to lock).
export async function countBookedRooms(roomTypeId, checkIn, checkOut, { excludeBookingId, maxId } = {}) {
  const match = { roomType: roomTypeId, ...bookingOverlapMatch(checkIn, checkOut) };
  if (excludeBookingId) match._id = { $ne: excludeBookingId };
  if (maxId) match._id = { ...(match._id || {}), $lte: maxId };

  const agg = await Booking.aggregate([
    { $match: match },
    { $group: { _id: null, rooms: { $sum: "$rooms" } } },
  ]);

  return agg[0]?.rooms || 0;
}

// Sum of rooms an admin has blocked out (maintenance, owner stay, group
// hold) for a room type over a date range. Same overlap rule as bookings.
export async function countBlockedRooms(roomTypeId, checkIn, checkOut) {
  const agg = await RoomBlock.aggregate([
    { $match: { roomType: roomTypeId, ...blockOverlapMatch(checkIn, checkOut) } },
    { $group: { _id: null, rooms: { $sum: "$rooms" } } },
  ]);

  return agg[0]?.rooms || 0;
}

// Rooms still bookable for a room type over the given range.
export async function getAvailableCount(room, checkIn, checkOut, excludeBookingId) {
  const [booked, blocked] = await Promise.all([
    countBookedRooms(room._id, checkIn, checkOut, { excludeBookingId }),
    countBlockedRooms(room._id, checkIn, checkOut),
  ]);
  return {
    total: room.totalRooms,
    booked,
    blocked,
    available: Math.max(0, room.totalRooms - booked - blocked),
  };
}

// Availability for every given room type over one shared date range, in two
// aggregations total (bookings + blocks) instead of one round trip per
// room. Backs GET /rooms/availability — the batch endpoint that replaced
// the frontend's former per-room fan-out (see
// frontend/hooks/useRoomAvailability.ts).
//
// Returns a plain object keyed by room _id (as a string, since that's what
// survives a JSON round trip) — callers that need it keyed by slug instead
// (the public API) remap it, since a RoomType's _id isn't meaningful to the
// browser.
export async function getAvailabilityMap(rooms, checkIn, checkOut) {
  const roomIds = rooms.map((r) => r._id);
  if (roomIds.length === 0) return {};

  const [bookedAgg, blockedAgg] = await Promise.all([
    Booking.aggregate([
      { $match: { roomType: { $in: roomIds }, ...bookingOverlapMatch(checkIn, checkOut) } },
      { $group: { _id: "$roomType", rooms: { $sum: "$rooms" } } },
    ]),
    RoomBlock.aggregate([
      { $match: { roomType: { $in: roomIds }, ...blockOverlapMatch(checkIn, checkOut) } },
      { $group: { _id: "$roomType", rooms: { $sum: "$rooms" } } },
    ]),
  ]);

  const bookedById = new Map(bookedAgg.map((r) => [String(r._id), r.rooms]));
  const blockedById = new Map(blockedAgg.map((r) => [String(r._id), r.rooms]));

  const map = {};
  for (const room of rooms) {
    const id = String(room._id);
    const booked = bookedById.get(id) || 0;
    const blocked = blockedById.get(id) || 0;
    map[id] = {
      total: room.totalRooms,
      booked,
      blocked,
      available: Math.max(0, room.totalRooms - booked - blocked),
    };
  }
  return map;
}

// Per-day availability for one room type across a range — the admin
// calendar grid and the guest date-picker's "sold-out days" both need this
// shape. Bookings/blocks in the window are fetched once and folded per day
// in JS rather than one query per day: a calendar month is at most 31 days
// and a handful of stays, so this stays cheap while keeping the query count
// constant regardless of the range length.
export async function getDailyAvailability(room, from, to) {
  const [bookings, blocks] = await Promise.all([
    Booking.find(
      { roomType: room._id, ...bookingOverlapMatch(from, to) },
      { checkIn: 1, checkOut: 1, rooms: 1 }
    ).lean(),
    RoomBlock.find(
      { roomType: room._id, ...blockOverlapMatch(from, to) },
      { from: 1, to: 1, rooms: 1 }
    ).lean(),
  ]);

  return eachDay(from, to).map((day) => {
    const dayTime = day.getTime();
    const booked = bookings
      .filter((b) => b.checkIn.getTime() <= dayTime && b.checkOut.getTime() > dayTime)
      .reduce((sum, b) => sum + b.rooms, 0);
    const blocked = blocks
      .filter((b) => b.from.getTime() <= dayTime && b.to.getTime() > dayTime)
      .reduce((sum, b) => sum + b.rooms, 0);

    return {
      date: toDayKey(day),
      total: room.totalRooms,
      booked,
      blocked,
      available: Math.max(0, room.totalRooms - booked - blocked),
    };
  });
}

// The 409 both booking-creation entry points threw ad hoc before this
// existed — centralized so the guest sees identical copy from
// /bookings/quote's inline validation, /bookings (admin), and
// /payments/order.
export function insufficientAvailabilityError(available) {
  return new ApiError(
    409,
    available > 0
      ? `Only ${available} room(s) left for the selected dates`
      : "No rooms available for the selected dates"
  );
}

// Commits a booking against inventory without a check-then-insert race: two
// requests that both read "1 room available" and both proceed no longer
// both succeed. `build` is an async factory for the Booking fields (so a
// caller can price/build the document only once availability looks viable,
// without the caller doing its own two-phase dance).
//
// Approach: pre-check as a fast-fail for the common already-sold-out case,
// insert speculatively, then re-count including only documents that exist
// at or before the one just inserted (see countBookedRooms's `maxId`). If
// that total — plus whatever's blocked — exceeds the room's stock, this
// request lost the race: it deletes its own row and reports the (now
// current) availability. Ordering by _id needs no transaction or a second
// lock collection, so it works against a standalone mongod as-is.
export async function reserveInventory({ room, checkIn, checkOut, rooms, build }) {
  const preCheck = await getAvailableCount(room, checkIn, checkOut);
  if (rooms > preCheck.available) {
    throw insufficientAvailabilityError(preCheck.available);
  }

  const booking = await Booking.create(await build());

  const [committedRooms, blocked] = await Promise.all([
    countBookedRooms(room._id, checkIn, checkOut, { maxId: booking._id }),
    countBlockedRooms(room._id, checkIn, checkOut),
  ]);

  if (committedRooms + blocked > room.totalRooms) {
    await Booking.deleteOne({ _id: booking._id });
    const after = await getAvailableCount(room, checkIn, checkOut);
    throw insufficientAvailabilityError(after.available);
  }

  return booking;
}
