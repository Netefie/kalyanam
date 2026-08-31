import { Booking } from "../models/Booking.js";
import { RoomType } from "../models/RoomType.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Payment states that represent money actually collected (a partial refund
// still leaves some of the original charge collected).
const COLLECTED_STATUSES = ["paid", "partially_refunded"];

// GET /api/dashboard/stats  (protected) — powers the admin stat cards.
export const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const activeStatuses = ["Confirmed", "CheckedIn"];

  const [todaysAgg, stayingAgg, totalRoomsAgg] = await Promise.all([
    // Bookings created today, split into collected vs still-pending revenue
    // and refunds issued today — `amount` alone overstated revenue before
    // payments existed (it counted unpaid/cancelled bookings too).
    Booking.aggregate([
      { $match: { createdAt: { $gte: startOfDay, $lt: endOfDay } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $in: ["$payment.status", COLLECTED_STATUSES] }, "$payment.amountPaid", 0],
            },
          },
          pendingRevenue: {
            $sum: {
              $cond: [{ $in: ["$payment.status", ["created", "authorized", "failed"]] }, "$amount", 0],
            },
          },
          refundedToday: { $sum: "$payment.refundedAmount" },
        },
      },
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

  const today = todaysAgg[0] || { count: 0, revenue: 0, pendingRevenue: 0, refundedToday: 0 };
  const staying = stayingAgg[0] || { guests: 0, occupiedRooms: 0 };
  const totalRooms = totalRoomsAgg[0]?.totalRooms || 0;

  res.json({
    todaysBookings: today.count,
    todaysRevenue: today.revenue,
    pendingRevenue: today.pendingRevenue,
    refundedToday: today.refundedToday,
    guestsStaying: staying.guests,
    occupiedRooms: staying.occupiedRooms,
    totalRooms,
  });
});
