import mongoose from "mongoose";

// Newsletter / "exclusive offers" opt-ins from the site popup.
const subscriberSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true },
    email: {
      type: String,
      required: true,
      unique: true, // dedupe — one row per email
      lowercase: true,
      trim: true,
    },
    phone: { type: String, default: "", trim: true },
    source: { type: String, default: "offer-popup" },
  },
  { timestamps: true }
);

subscriberSchema.index({ createdAt: -1 });

export const Subscriber = mongoose.model("Subscriber", subscriberSchema);
