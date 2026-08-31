// Single source for turning a raw "N rooms available" number into what the
// guest actually sees — copy and tone together, so a room card, the price
// panel, and the admin grid never independently invent slightly different
// wording for the same three states.
export type AvailabilityTone = "available" | "low" | "soldOut" | "unknown";

export interface AvailabilityStatus {
  tone: AvailabilityTone;
  label: string;
}

// Below this many rooms remaining (relative to what the guest actually
// wants), the copy switches from a flat "Available" to a specific count —
// the nudge that tells someone their exact dates are getting scarce instead
// of leaving them to find out at checkout.
const LOW_STOCK_THRESHOLD = 3;

/**
 * `available` is the room type's live count for the selected dates;
 * `requested` is how many the guest is currently asking for (defaults to 1
 * for a plain "is this room type sellable at all" check, e.g. a calendar
 * day). `available` of `undefined` means "not known yet" (no dates chosen).
 */
export function availabilityLabel(
  available: number | undefined,
  requested: number = 1
): AvailabilityStatus {
  if (available == null) {
    return { tone: "unknown", label: "" };
  }
  if (available < requested) {
    return { tone: "soldOut", label: "Sold out" };
  }
  if (available <= LOW_STOCK_THRESHOLD) {
    return { tone: "low", label: `Only ${available} left` };
  }
  return { tone: "available", label: "Available" };
}
