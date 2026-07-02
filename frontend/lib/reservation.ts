// Shared helpers to carry a reservation selection (from the hero bar or the
// navbar popup) to the /accommodations page via URL query params, and to read
// them back there to prefill "PLAN YOUR STAY".

export interface ReservationSelection {
  roomType?: string; // room slug, e.g. "deluxe-room"
  checkIn?: Date | string | null;
  checkOut?: Date | string | null;
  adults?: number;
  children?: number;
  rooms?: number;
}

function toDateParam(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  return value; // already a string (e.g. "2026-07-10")
}

export function buildAccommodationsUrl(selection: ReservationSelection): string {
  const params = new URLSearchParams();

  if (selection.roomType) params.set("roomType", selection.roomType);

  const checkIn = toDateParam(selection.checkIn);
  const checkOut = toDateParam(selection.checkOut);
  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);

  if (selection.adults != null) params.set("adults", String(selection.adults));
  if (selection.children != null) params.set("children", String(selection.children));
  if (selection.rooms != null) params.set("rooms", String(selection.rooms));

  const qs = params.toString();
  return `/accommodations${qs ? `?${qs}` : ""}`;
}

export interface ParsedReservation {
  roomType: string;
  checkIn: Date | null;
  checkOut: Date | null;
  adults?: number;
  children?: number;
  rooms?: number;
  hasDates: boolean;
}

// Reads reservation params from a query string (client-side, no Suspense needed).
export function readReservationParams(search: string): ParsedReservation | null {
  const params = new URLSearchParams(search);
  if ([...params.keys()].length === 0) return null;

  const parseDate = (key: string): Date | null => {
    const raw = params.get(key);
    if (!raw) return null;
    const d = new Date(raw);
    return Number.isNaN(d.getTime()) ? null : d;
  };
  const parseNum = (key: string): number | undefined => {
    const raw = params.get(key);
    if (raw == null) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };

  const checkIn = parseDate("checkIn");
  const checkOut = parseDate("checkOut");

  return {
    roomType: params.get("roomType") || "",
    checkIn,
    checkOut,
    adults: parseNum("adults"),
    children: parseNum("children"),
    rooms: parseNum("rooms"),
    hasDates: Boolean(checkIn && checkOut),
  };
}
