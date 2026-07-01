import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" }, // Mr / Mrs / Ms
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, default: "", trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    gstNumber: { type: String, default: "" },
    specialRequest: { type: String, default: "" },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    // Human-friendly reference (BK-1001) shown in the admin table.
    bookingCode: { type: String, unique: true, index: true },

    guest: { type: guestSchema, required: true },

    // Reference plus a name snapshot, so the booking still reads correctly
    // even if the room type is later renamed or removed.
    roomType: { type: mongoose.Schema.Types.ObjectId, ref: "RoomType" },
    roomName: { type: String, required: true },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, default: 1, min: 1 },

    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    rooms: { type: Number, default: 1, min: 1 },

    amount: { type: Number, required: true, min: 0 }, // total INR

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "CheckedIn", "CheckedOut"],
      default: "Pending",
      index: true,
    },
    source: { type: String, enum: ["website", "admin"], default: "website" },
  },
  { timestamps: true }
);

// Common admin query: recent bookings, filtered by status.
bookingSchema.index({ createdAt: -1 });

// Auto-assign a sequential-ish booking code (BK-1001, BK-1002, ...).
bookingSchema.pre("save", async function (next) {
  if (this.bookingCode) return next();
  const count = await this.constructor.estimatedDocumentCount();
  this.bookingCode = `BK-${1001 + count}`;
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);
