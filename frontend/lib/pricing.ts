// Shared money helpers for the booking flow. Centralised so the subtotal /
// tax / total maths (and the GST rate) is defined exactly once instead of
// being re-implemented in PriceCard, BookingSummary and PaymentConfirmation.
//
// Structural (not imported) types on purpose: both lib/api.ts's `Room` and
// AvailableRooms.tsx's view-model `Room` carry price/offerPrice, and callers
// pass whichever one they have.
interface Priced {
  price: number;
  offerPrice?: number;
}

export const TAX_RATE = 0.18;

export function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// The per-night rate to charge: the selected rate plan when there is one,
// otherwise the room's own offer price. Mirrors the backend's
// services/ratePlans.js fallback so the UI and API never disagree.
export function nightlyRate(plan?: Priced | null, room?: Priced | null): number {
  if (plan) return plan.offerPrice ?? plan.price;
  if (room) return room.offerPrice ?? room.price;
  return 0;
}

// The struck-through "before discount" rate, same fallback order.
export function nightlyRackRate(plan?: Priced | null, room?: Priced | null): number {
  if (plan) return plan.price;
  if (room) return room.price;
  return 0;
}

export interface StayTotals {
  subtotal: number;
  originalSubtotal: number;
  taxes: number;
  total: number;
}

// nights/rooms multiplied out, with optional GST. `applyTax: false` is used
// where a card shows a plain nightly total without taxes (e.g. PriceCard);
// the guest-details and review steps apply tax for the real payable amount.
export function computeStayTotals({
  rate,
  rackRate,
  nights,
  rooms,
  applyTax = true,
}: {
  rate: number;
  rackRate?: number;
  nights: number;
  rooms: number;
  applyTax?: boolean;
}): StayTotals {
  const subtotal = rate * nights * rooms;
  const originalSubtotal = (rackRate ?? rate) * nights * rooms;
  const taxes = applyTax ? Math.round(subtotal * TAX_RATE) : 0;

  return { subtotal, originalSubtotal, taxes, total: subtotal + taxes };
}
