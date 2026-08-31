// Display-only money helpers for the booking flow.
//
// The payable total (subtotal, tax, grand total) now comes exclusively from
// the backend — POST /bookings/quote via hooks/useBookingQuote.ts — because
// the browser previously computed its own 18%-flat GST client-side while the
// backend stored a tax-free `amount`, so the number a guest saw never
// matched what got charged. What's left here is purely cosmetic: the
// per-night rate shown on a rate-plan card before the guest has even picked
// dates (PriceCard), and currency formatting used everywhere.
interface Priced {
  price: number;
  offerPrice?: number;
}

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// The per-night rate to display: the selected rate plan when there is one,
// otherwise the room's own offer price. Mirrors the backend's
// services/ratePlans.js fallback so this never disagrees with what the
// server would quote once dates are chosen.
export function nightlyRate(plan?: Priced | null, room?: Priced | null): number {
  if (plan) return plan.offerPrice ?? plan.price;
  if (room) return room.offerPrice ?? room.price;
  return 0;
}
