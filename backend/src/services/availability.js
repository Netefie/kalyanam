import { Booking } from "../models/Booking.js";

// Statuses that hold inventory. Cancelled / CheckedOut / Expired bookings
// free the room.
const HOLDING_STATUSES = ["Pending", "Confirmed", "CheckedIn"];

// Sum of rooms already booked for a room type over a date range. Two stays
// overlap when one starts before the other ends and vice versa (half-open
// interval: checkout day is free again).
//
// A `Pending` website booking only holds inventory while `holdExpiresAt` is
// unset (legacy/admin bookings) or still in the future — once a guest
// abandons checkout the hold lapses and services/bookingSweeper.js later
// flips the booking to `Expired`, but availability stops counting it the
// moment the hold time passes rather than waiting for the sweep.
export async function countBookedRooms(roomTypeId, checkIn, checkOut, excludeBookingId) {
  const match = {
    roomType: roomTypeId,
    status: { $in: HOLDING_STATUSES },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
    $or: [{ holdExpiresAt: null }, { holdExpiresAt: { $gt: new Date() } }],
  };
  if (excludeBookingId) match._id = { $ne: excludeBookingId };

  const agg = await Booking.aggregate([
    { $match: match },
    { $group: { _id: null, rooms: { $sum: "$rooms" } } },
  ]);

  return agg[0]?.rooms || 0;
}

// Rooms still bookable for a room type over the given range.
export async function getAvailableCount(room, checkIn, checkOut, excludeBookingId) {
  const booked = await countBookedRooms(room._id, checkIn, checkOut, excludeBookingId);
  return {
    total: room.totalRooms,
    booked,
    available: Math.max(0, room.totalRooms - booked),
  };
}
