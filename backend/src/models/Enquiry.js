import mongoose from "mongoose";

// Captures both the "check availability" reservation popup and the general
// contact form. Type discriminates which fields are meaningful.
const enquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["reservation", "contact"],
      default: "reservation",
      index: true,
    },

    name: { type: String, default: "", trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, default: "", trim: true },

    // Reservation-specific
    roomType: { type: String, default: "" },
    checkIn: { type: Date },
    checkOut: { type: Date },
    rooms: { type: Number, min: 1 },
    adults: { type: Number, min: 1 },
    children: { type: Number, min: 0 },

    // Contact-specific
    subject: { type: String, default: "" },
    message: { type: String, default: "" },

    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });

export const Enquiry = mongoose.model("Enquiry", enquirySchema);
