import mongoose from "mongoose";

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

    size: { type: String, default: "" }, // e.g. "320 sq.ft"
    bed: { type: String, default: "" }, // e.g. "King Bed"
    maxGuests: { type: Number, default: 2, min: 1 },

    amenities: { type: [String], default: [] },
    breakfast: { type: Boolean, default: false },
    cancellation: { type: Boolean, default: true },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0, min: 0 },

    // Inventory counts used by the admin dashboard.
    totalRooms: { type: Number, default: 0, min: 0 },
    availableRooms: { type: Number, default: 0, min: 0 },

    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const RoomType = mongoose.model("RoomType", roomTypeSchema);
