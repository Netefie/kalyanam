// Shared date helpers for the booking/pricing flow. Single source so
// "how many nights is this stay" and "which calendar day is this" are
// computed identically everywhere (pricing quotes, order creation, booking
// records, availability counts).
//
// Every stay date is normalized to the *hotel's* calendar day before it is
// stored or compared. Without this, the anchor depends on whoever sent the
// request: a browser in IST sends local midnight (18:30Z the previous day),
// while a script or admin tool sends "2026-09-10" (00:00Z). Two bookings for
// the same night then differ by 5h30m, and the half-open overlap test in
// services/availability.js both misses real overlaps and invents phantom
// ones. Anchoring both ends to hotel-local midnight makes the comparison
// exact and makes `nights` an integer count of real nights.
import { env } from "../config/env.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Intl rather than a tz library: Node ships full ICU, so this needs no
// dependency and stays correct across DST without a lookup table.
const dayParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: env.hotelTimezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function toDate(value) {
  if (value instanceof Date) return value;
  // A bare "YYYY-MM-DD" is already a calendar day with no zone of its own —
  // Date parses it as UTC midnight, which toHotelDay would then shift back a
  // day for any timezone east of UTC. Read the parts directly instead.
  if (typeof value === "string") {
    const bare = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
    if (bare) return new Date(Date.UTC(+bare[1], +bare[2] - 1, +bare[3]));
  }
  return new Date(value);
}

/**
 * The UTC instant representing midnight of `value`'s hotel-local calendar
 * day. This is the canonical anchor every stored checkIn/checkOut uses.
 * Returns null for an unparseable input so callers can 400 on it.
 */
export function toHotelDay(value) {
  const date = toDate(value);
  if (Number.isNaN(date.getTime())) return null;

  // A bare date string is already anchored (see toDate) — re-projecting it
  // through the formatter would be a no-op at best and a day-shift at worst.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return date;
  }

  const { year, month, day } = Object.fromEntries(
    dayParts.formatToParts(date).map((p) => [p.type, p.value])
  );
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

// Today's hotel-local calendar day, anchored the same way. The floor for
// "is this check-in in the past".
export function todayHotelDay() {
  return toHotelDay(new Date());
}

// Whole nights between two dates, floored at 1 (a same-day range still books
// a single night rather than zero). On hotel-day-anchored dates this is exact
// integer division rather than a rounding guess.
export function nightsBetween(checkIn, checkOut) {
  const n = Math.round((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
  return n > 0 ? n : 1;
}

// Whole days between two anchored days — like nightsBetween but without the
// floor-at-1, for lead-time checks where zero is a meaningful answer.
export function daysBetween(from, to) {
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
}

// Every stay-date rejection, as a code plus the guest-facing message. Callers
// map these onto their own HTTP errors (see services/bookingRequest.js) —
// keeping the copy here means the same bad range reads the same way whether
// it arrived at /bookings/quote, /bookings, or /payments/order.
export const STAY_DATE_ERRORS = {
  invalid: "Valid check-in and check-out dates are required",
  order: "Valid check-in and check-out dates are required",
  past: "Check-in cannot be in the past",
  tooLong: "Stays are limited to {maxNights} nights — please contact us for a longer booking",
  tooFarAhead: "Bookings can be made up to {maxAdvanceDays} days in advance",
};

function fail(reason, replacements = {}) {
  const message = Object.entries(replacements).reduce(
    (text, [key, value]) => text.replace(`{${key}}`, value),
    STAY_DATE_ERRORS[reason]
  );
  return { ok: false, reason, message };
}

/**
 * Normalizes and validates a requested stay. Returns
 * `{ ok: true, inDate, outDate, nights }` with both ends anchored to
 * hotel-local midnight, or `{ ok: false, reason, message }`.
 *
 * Limits default to the configured booking policy so callers don't each
 * repeat them; pass overrides only where a rule genuinely differs.
 */
export function parseStayDates(checkIn, checkOut, limits = {}) {
  const {
    maxNights = env.booking.maxNights,
    maxAdvanceDays = env.booking.maxAdvanceDays,
    allowPast = false,
  } = limits;

  const inDate = toHotelDay(checkIn);
  const outDate = toHotelDay(checkOut);
  if (!inDate || !outDate) return fail("invalid");
  if (outDate <= inDate) return fail("order");

  const today = todayHotelDay();
  if (!allowPast && inDate < today) return fail("past");

  const nights = nightsBetween(inDate, outDate);
  if (nights > maxNights) return fail("tooLong", { maxNights });

  if (daysBetween(today, inDate) > maxAdvanceDays) {
    return fail("tooFarAhead", { maxAdvanceDays });
  }

  return { ok: true, inDate, outDate, nights };
}

// Every hotel-day between `from` (inclusive) and `to` (exclusive) — the
// nights a stay actually occupies. Used to fold bookings into per-day
// availability (services/availability.js#getDailyAvailability).
export function eachDay(from, to) {
  const days = [];
  for (let t = from.getTime(); t < to.getTime(); t += MS_PER_DAY) {
    days.push(new Date(t));
  }
  return days;
}

// "2026-09-10" for a hotel-day anchor — the key shape the availability
// calendar endpoints and their UI agree on.
export function toDayKey(date) {
  return date.toISOString().slice(0, 10);
}
