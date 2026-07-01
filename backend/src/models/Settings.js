import mongoose from "mongoose";

// Single-document collection holding site-wide settings (contact info,
// policies, socials). Pinned to a fixed `key` so there's only ever one.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "site", unique: true },

    hotelName: { type: String, default: "Kalyanam Hotel & Resort" },
    tagline: { type: String, default: "" },

    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },

    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },

    taxPercent: { type: Number, default: 18, min: 0, max: 100 },
    currency: { type: String, default: "INR" },

    socials: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    policies: {
      cancellation: { type: String, default: "" },
      houseRules: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
