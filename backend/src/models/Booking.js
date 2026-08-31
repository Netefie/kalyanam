import mongoose from "mongoose";
import { nextSequence } from "./Counter.js";

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

// Snapshot of the price breakdown at the moment the booking/order was
// created. Kept alongside the top-level `amount` (== total) so admin and
// email always have subtotal/tax available without recomputing.
const pricingSchema = new mongoose.Schema(
  {
    nightlyRate: { type: Number, min: 0 },
    subtotal: { type: Number, min: 0 },
    taxPercent: { type: Number, min: 0, max: 100 },
    taxAmount: { type: Number, min: 0 },
    total: { type: Number, min: 0 },
    currency: { type: String, default: "INR" },
  },
  { _id: false }
);

// Send-once guards for the scheduler-driven lifecycle emails (see
// services/mailScheduler.js). Distinct from MailLog's dedupeKey, which
// guards a single send attempt at the transport layer — these flags are
// what the scheduler's own query filters on, so a booking already reminded
// simply doesn't match the next sweep's criteria instead of matching again
// and relying on the dedupe layer to catch it.
const notificationsSchema = new mongoose.Schema(
  {
    reminderSentAt: { type: Date },
    postStaySentAt: { type: Date },
    holdExpiringSentAt: { type: Date },
    cancelledSentAt: { type: Date },
  },
  { _id: false }
);

const refundSchema = new mongoose.Schema(
  {
    refundId: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 }, // INR
    status: { type: String, default: "processed" },
    reason: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

// Money lifecycle — deliberately separate from `status` (the stay lifecycle:
// Pending/Confirmed/CheckedIn/...). A booking's reservation status and its
// payment status can move independently (e.g. Confirmed + partially_refunded).
const paymentSchema = new mongoose.Schema(
  {
    provider: { type: String, default: "razorpay" },
    status: {
      type: String,
      enum: [
        "created", // Razorpay order created, no attempt yet
        "authorized", // payment made, capture pending (rare with auto-capture)
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ],
      default: "created",
      index: true,
    },
    // No `default: ""` here deliberately: orderId has a sparse *unique*
    // index (see bookingSchema below), and a sparse index only excludes
    // documents where the field is genuinely absent — an empty string is
    // still a value, so every booking created before its order exists would
    // otherwise collide on `orderId: ""` the moment a second one is created
    // concurrently. Leaving it unset until assigned keeps the field truly
    // absent (`undefined`) so sparse means what it's supposed to.
    orderId: { type: String }, // Razorpay order_...
    paymentId: { type: String }, // Razorpay pay_...
    method: { type: String, default: "" }, // card / upi / netbanking / wallet
    cardLast4: { type: String, default: "" },
    amountPaid: { type: Number, default: 0, min: 0 }, // INR actually captured
    currency: { type: String, default: "INR" },
    paidAt: { type: Date },
    failureReason: { type: String, default: "" },
    attempts: { type: Number, default: 0 },
    refunds: { type: [refundSchema], default: [] },
    refundedAmount: { type: Number, default: 0, min: 0 },
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

    // Snapshot of the rate plan chosen at booking time (e.g. "Room with
    // Breakfast"), so later edits to the room's plans don't rewrite history.
    ratePlanCode: { type: String, default: "" },
    ratePlanName: { type: String, default: "" },
    nightlyRate: { type: Number, min: 0 },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, default: 1, min: 1 },

    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    rooms: { type: Number, default: 1, min: 1 },

    // Total INR payable, GST-inclusive — mirrors pricing.total. Kept as the
    // top-level field since admin table/dashboard/email already read `amount`.
    amount: { type: Number, required: true, min: 0 },
    pricing: { type: pricingSchema, default: () => ({}) },
    payment: { type: paymentSchema, default: () => ({}) },
    notifications: { type: notificationsSchema, default: () => ({}) },

    // Website bookings hold their room inventory until this time while
    // awaiting payment; cleared once paid. See services/availability.js and
    // services/bookingSweeper.js.
    holdExpiresAt: { type: Date },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "CheckedIn", "CheckedOut", "Expired"],
      default: "Pending",
      index: true,
    },
    source: { type: String, enum: ["website", "admin"], default: "website" },
  },
  { timestamps: true }
);

// Common admin query: recent bookings, filtered by status.
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ "payment.orderId": 1 }, { unique: true, sparse: true });
bookingSchema.index({ "payment.paymentId": 1 }, { sparse: true });
bookingSchema.index({ holdExpiresAt: 1 });

// Auto-assign a sequential booking code (BK-1001, BK-1002, ...) from an
// atomic counter — safe under concurrent creates, unlike a document count.
// nextSequence returns 1, 2, 3, ...; +1000 keeps the same starting number
// the old count-based scheme used.
bookingSchema.pre("save", async function (next) {
  if (this.bookingCode) return next();
  const seq = await nextSequence("booking");
  this.bookingCode = `BK-${1000 + seq}`;
  next();
});

export const Booking = mongoose.model("Booking", bookingSchema);

// One-time migration guard, called at server startup (see server.js).
// Mongoose only applies schema defaults when hydrating a document (.save(),
// or a non-.lean() find) — a booking that was inserted before the
// `payment`/`pricing`/`notifications` subdocuments existed on this schema
// has none of those fields in MongoDB at all, and every read path here uses
// .lean() for performance, which returns the raw stored document with no
// default-filling. Without this, admin UI reading `booking.payment.status`
// on a pre-payments-feature booking throws (`Cannot read properties of
// undefined`), and services/mailScheduler.js's queries on
// `notifications.reminderSentAt` would silently never match a legacy
// booking that predates the field. A no-op once every booking has all three
// fields — safe to call on every boot.
export async function backfillLegacyPaymentDefaults() {
  const paymentDefault = {
    provider: "razorpay",
    status: "created",
    method: "",
    cardLast4: "",
    amountPaid: 0,
    currency: "INR",
    failureReason: "",
    attempts: 0,
    refunds: [],
    refundedAmount: 0,
  };
  const [paymentResult, notificationsResult, pricingResult] = await Promise.all([
    Booking.updateMany({ payment: { $exists: false } }, { $set: { payment: paymentDefault } }),
    Booking.updateMany(
      { notifications: { $exists: false } },
      { $set: { notifications: {} } }
    ),
    // Aggregation-pipeline update (not a flat $set) so the backfilled
    // subtotal/total can reference each document's own pre-existing
    // `amount` — these bookings predate the tax-inclusive pricing model
    // entirely, so `amount` *was* the full (untaxed) price; treating it as
    // both subtotal and total avoids the admin UI showing a nonsensical
    // "Subtotal ₹0 / Total ₹32,893" for old records.
    Booking.updateMany({ pricing: { $exists: false } }, [
      {
        $set: {
          pricing: {
            nightlyRate: { $ifNull: ["$nightlyRate", 0] },
            subtotal: "$amount",
            taxPercent: 0,
            taxAmount: 0,
            total: "$amount",
            currency: "INR",
          },
        },
      },
    ]),
  ]);

  const total = paymentResult.modifiedCount + pricingResult.modifiedCount + notificationsResult.modifiedCount;
  if (total > 0) {
    console.log(
      `[migrate] backfilled payment/pricing/notifications defaults on ` +
        `${paymentResult.modifiedCount}/${pricingResult.modifiedCount}/${notificationsResult.modifiedCount} legacy booking(s)`
    );
  }
}
