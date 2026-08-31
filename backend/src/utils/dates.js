// Shared date helpers for the booking/pricing flow. Single source so
// "how many nights is this stay" is computed identically everywhere
// (pricing quotes, order creation, booking records).
const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Whole nights between two dates, floored at 1 (a same-day range still books
// a single night rather than zero).
export function nightsBetween(checkIn, checkOut) {
  const n = Math.ceil((checkOut.getTime() - checkIn.getTime()) / MS_PER_DAY);
  return n > 0 ? n : 1;
}

// Parses check-in/check-out into valid Date objects, or returns null if
// either is invalid or checkout doesn't come after checkin. Callers turn a
// null into their own 400 with the right message.
export function parseStayDates(checkIn, checkOut) {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (Number.isNaN(inDate.getTime()) || Number.isNaN(outDate.getTime())) return null;
  if (outDate <= inDate) return null;
  return { inDate, outDate };
}
