import mongoose from "mongoose";

// Tiny generic sequence counter. Booking.pre("save") used to derive its code
// from estimatedDocumentCount(), which two concurrent requests (or any
// request after a delete) could both resolve to the same number — and
// bookingCode is unique, so that surfaced as a confusing 409 right at the
// moment money changes hands. findOneAndUpdate's $inc is atomic at the
// database level, so concurrent callers always get distinct values.
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // sequence name, e.g. "booking"
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

// Returns 1, 2, 3, ... for the named sequence, atomically. Note: a schema
// `default` would NOT apply here even if declared — $inc on an upserted
// document starts MongoDB's missing field at 0 regardless of the schema,
// since $inc/upsert bypasses Mongoose document defaults entirely. Callers
// that want a friendlier starting number (e.g. booking codes at BK-1001)
// should add their own fixed offset on top of the returned value.
export async function nextSequence(name) {
  const doc = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return doc.seq;
}

// One-time migration guard, called at server startup (see server.js). Any
// database that already has bookings from before this counter existed (the
// old scheme derived codes from estimatedDocumentCount()) would otherwise
// have its very first BK-1001 collide with a real legacy booking the moment
// the new counter starts counting from 0. Seeds the counter to the highest
// existing "BK-<n>" suffix (minus the fixed 1000 offset Booking.js adds) so
// numbering continues past whatever's already there. A no-op once the
// counter document exists — safe to call on every boot.
export async function ensureBookingCounterSeeded(Booking) {
  const existing = await Counter.findOne({ _id: "booking" }).lean();
  if (existing) return;

  const highest = await Booking.find({ bookingCode: /^BK-\d+$/ })
    .sort({ bookingCode: -1 })
    .limit(1)
    .select("bookingCode")
    .lean();

  const maxCode = highest[0]?.bookingCode;
  const maxNumber = maxCode ? Number(maxCode.slice(3)) : 1000;
  const seedSeq = Math.max(0, maxNumber - 1000);

  await Counter.findOneAndUpdate(
    { _id: "booking" },
    { $setOnInsert: { seq: seedSeq } },
    { upsert: true }
  );
}
