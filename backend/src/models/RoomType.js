import mongoose from "mongoose";

// A sellable rate for a room type ("Room Only", "Room with Breakfast", ...).
// Rooms without any rate plan fall back to the room's own price — see
// services/ratePlans.js, which is the only place that resolution happens.
const ratePlanSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, trim: true, lowercase: true }, // "room-only"
    name: { type: String, required: true, trim: true }, // "Room with Breakfast"
    label: { type: String, default: "Standard Rate" }, // small-caps line above the price

    price: { type: Number, required: true, min: 0 }, // rack rate per night, INR
    offerPrice: { type: Number, min: 0 }, // sell rate per night

    breakfast: { type: Boolean, default: false },
    refundable: { type: Boolean, default: true },

    inclusions: { type: [String], default: [] }, // bullet lines shown in the card
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

// One document per bookable room category (Deluxe, Super Deluxe, Suite...).
// Fields mirror what both the public booking UI and the admin panel render.
const roomTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },

    // Primary image path (served from the frontend /public folder) plus an
    // optional gallery.
    image: { type: String, default: "" },
    images: { type: [String], default: [] },

    price: { type: Number, required: true, min: 0 }, // per night, INR
    offerPrice: { type: Number, min: 0 }, // discounted per-night price

    // Sellable rates for this room. Empty means "use the base price above".
    ratePlans: { type: [ratePlanSchema], default: [] },

    size: { type: String, default: "" }, // e.g. "320 sq.ft"
    bed: { type: String, default: "" }, // e.g. "King Bed"
    maxGuests: { type: Number, default: 2, min: 1 },

    amenities: { type: [String], default: [] },
    breakfast: { type: Boolean, default: false },
    cancellation: { type: Boolean, default: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    // Total physical rooms of this type. "Available" is never stored here —
    // it depends on a date range, and is always computed live from current
    // bookings + blocks against this ceiling (see services/availability.js).
    // An earlier `availableRooms` field used to sit next to this one as a
    // static, hand-edited number the admin UI rendered as if it were live
    // occupancy; it was removed for exactly that reason (see
    // services/ratePlans.js#toPublicRoom, which strips it from any legacy
    // document that still has it stored).
    totalRooms: { type: Number, default: 0, min: 0 },

    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RoomType = mongoose.model("RoomType", roomTypeSchema);
