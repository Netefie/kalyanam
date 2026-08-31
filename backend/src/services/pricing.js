// Single source of truth for stay pricing. Every caller that needs a total —
// the public quote endpoint, order creation, webhook re-verification — goes
// through quoteStay() so the browser never has to (and never gets to)
// re-derive the number that ends up charged.
import { Settings } from "../models/Settings.js";
import { findRatePlan } from "./ratePlans.js";
import { nightsBetween } from "../utils/dates.js";

const SETTINGS_KEY = "site";

// Tax rate as configured in the singleton Settings document, defaulting the
// same way the schema does (18%) if the document doesn't exist yet.
async function getTaxPercent() {
  const settings = await Settings.findOne({ key: SETTINGS_KEY }).select("taxPercent").lean();
  return settings?.taxPercent ?? 18;
}

// Rounds to the nearest rupee — Razorpay orders are paise-integer amounts,
// and half-rupee tax lines are not something guests should ever see.
function roundRupees(n) {
  return Math.round(n);
}

/**
 * Prices a stay against a resolved RoomType document. Returns the full
 * breakdown; `total` (in rupees) is what gets charged.
 */
export async function quoteStay({ room, ratePlanCode, checkIn, checkOut, rooms }) {
  const nights = nightsBetween(checkIn, checkOut);
  const roomCount = Math.max(1, Number(rooms) || 1);
  const plan = findRatePlan(room, ratePlanCode);
  const nightlyRate = plan.offerPrice ?? plan.price;

  const subtotal = roundRupees(nightlyRate * nights * roomCount);
  const taxPercent = await getTaxPercent();
  const taxAmount = roundRupees((subtotal * taxPercent) / 100);
  const total = subtotal + taxAmount;

  return {
    nights,
    rooms: roomCount,
    plan,
    nightlyRate,
    subtotal,
    taxPercent,
    taxAmount,
    total,
    currency: "INR",
  };
}
