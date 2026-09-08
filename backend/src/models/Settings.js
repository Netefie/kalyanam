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
    whatsapp: { type: String, default: "" },

    // Free text, newline-separated — rendered verbatim in the footer and on
    // the contact page. The structured parts below exist only because
    // schema.org's PostalAddress wants them as separate properties; the
    // street line is taken from the first line of `address`.
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    country: { type: String, default: "IN" },

    // Where the "Get directions" links point, and the src of the embedded
    // map iframe on the contact page.
    mapsUrl: { type: String, default: "" },
    mapsEmbedUrl: { type: String, default: "" },

    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "11:00" },

    taxPercent: { type: Number, default: 18, min: 0, max: 100 },
    currency: { type: String, default: "INR" },

    // How close to check-in a guest can still self-cancel a refundable
    // booking for a full refund — controllers/bookingController.js
    // #cancelBookingSelf reads this; inside the window (or on a
    // non-refundable rate plan) the guest is asked to contact the hotel
    // instead of the refund happening automatically.
    cancellationWindowHours: { type: Number, default: 24, min: 0 },

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
