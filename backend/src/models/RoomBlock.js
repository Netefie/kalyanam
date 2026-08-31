import mongoose from "mongoose";

// An admin-created hold on inventory that isn't a guest booking —
// maintenance, an owner stay, a group hold pending contract. Without this,
// "block these rooms out" had no representation at all: the only way to
// stop a room type from being sold was to lower `totalRooms`, which also
// (wrongly) shrinks every other date range's availability along with it.
//
// A block consumes inventory exactly like a booking does — see
// services/availability.js, which sums both against the same `totalRooms`
// ceiling — so the admin Availability calendar (backend/src/controllers/
// roomBlockController.js) and the public booking flow always agree on what's
// actually sellable.
const roomBlockSchema = new mongoose.Schema(
  {
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType", required: true },

    // Half-open range, same convention as Booking's checkIn/checkOut —
    // `from` inclusive, `to` exclusive, both hotel-day-anchored (see
    // utils/dates.js). A block on [Sep 10, Sep 12) occupies the nights of
    // the 10th and 11th, freeing back up on the 12th.
    from: { type: Date, required: true },
    to: { type: Date, required: true },

    rooms: { type: Number, required: true, min: 1 },
    reason: { type: String, default: "" },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// Every availability read filters by roomType and range — see
// services/availability.js#countBlockedRooms / #getDailyAvailability.
roomBlockSchema.index({ roomType: 1, from: 1, to: 1 });

export const RoomBlock = mongoose.model("RoomBlock", roomBlockSchema);
