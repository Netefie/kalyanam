import { Booking } from "../models/Booking.js";
import { RoomType } from "../models/RoomType.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// GET /api/dashboard/stats  (protected) — powers the admin stat cards.
export const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const activeStatuses = ["Confirmed", "CheckedIn"];

  const [todaysAgg, stayingAgg, totalRoomsAgg] = await Promise.all([
    // Bookings created today + revenue from them.
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      { $group: { _id: null, count: { $sum: 1 }, revenue: { $sum: "$amount" } } },
    ]),
    // Guests currently staying + rooms occupied right now.
    Booking.aggregate([
      {
        $match: {
          status: { $in: activeStatuses },
          checkIn: { $lte: now },
          checkOut: { $gt: now },
        },
      },
      {
        $group: {
          _id: null,
          guests: { $sum: { $add: ["$adults", "$children"] } },
          occupiedRooms: { $sum: "$rooms" },
        },
      },
    ]),
    RoomType.aggregate([
      { $group: { _id: null, totalRooms: { $sum: "$totalRooms" } } },
    ]),
  ]);

  const today = todaysAgg[0] || { count: 0, revenue: 0 };
  const staying = stayingAgg[0] || { guests: 0, occupiedRooms: 0 };
  const totalRooms = totalRoomsAgg[0]?.totalRooms || 0;

  res.json({
    todaysBookings: today.count,
    todaysRevenue: today.revenue,
    guestsStaying: staying.guests,
    occupiedRooms: staying.occupiedRooms,
    totalRooms,
  });
});
