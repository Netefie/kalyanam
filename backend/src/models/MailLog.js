import mongoose from "mongoose";

// One row per email attempt — backs the admin Emails console (activity log,
// filters, retry) and, via the unique sparse `dedupeKey` index, makes
// send-once real. Without it, the Razorpay webhook and the browser's
// /payments/verify call can race for the same booking (see
// controllers/paymentController.js) and both attempt to send
// "booking-confirmed"; claiming `booking-confirmed:BK-1042` on this unique
// index before sending means only one ever wins, regardless of which path
// gets there first, and the guarantee survives a process restart (unlike an
// in-memory lock).
//
// `html`/`text` are stored as the exact rendered snapshot at send time (not
// just the template key + a data pointer) so a later manual retry resends
// precisely what failed — not a fresh render against whatever the booking
// looks like *now*, which could have moved on (e.g. since refunded).
const mailLogSchema = new mongoose.Schema(
  {
    template: { type: String, required: true, index: true }, // registry key, e.g. "booking-confirmed"
    to: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true },
    html: { type: String, required: true },
    text: { type: String, default: "" },

    status: {
      type: String,
      enum: [
        "queued", // claimed, not yet attempted
        "sent",
        "failed", // attempts exhausted or a permanent SMTP error
        "skipped", // SMTP not configured, or a duplicate dedupeKey
        "dry-run", // MAIL_DRY_RUN — rendered and logged, never sent
      ],
      default: "queued",
      index: true,
    },
    attempts: { type: Number, default: 0 },
    lastError: { type: String, default: "" },
    messageId: { type: String, default: "" },

    // Absent for one-off sends (e.g. an admin's "send test") that have no
    // natural single-fire identity to dedupe against.
    dedupeKey: { type: String },

    // Optional back-references so the admin console can filter "mail for
    // this booking" without parsing `to`/`subject`.
    refs: {
      booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
      enquiry: { type: mongoose.Schema.Types.ObjectId, ref: "Enquiry" },
      subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "Subscriber" },
    },

    sentAt: { type: Date },
  },
  { timestamps: true }
);

// Admin console's default view: most recent first.
mailLogSchema.index({ createdAt: -1 });
// The idempotency guarantee described above. Sparse so rows without a
// dedupeKey (test sends) never collide with each other.
mailLogSchema.index({ dedupeKey: 1 }, { unique: true, sparse: true });

export const MailLog = mongoose.model("MailLog", mailLogSchema);
