// Pure formatters for the admin-editable contact details.
//
// Deliberately has no "use client" directive: both the Server Components that
// call getSiteSettings() directly and the Client Components that read the
// settings context need these, and a helper exported from a client module
// can't be called on the server.

// tel:/mailto: need digits and an optional leading +, nothing else.
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const mailHref = (email: string) => `mailto:${email}`;

// wa.me wants the number bare, country code included, no + or separators.
export const whatsappHref = (number: string) =>
  `https://wa.me/${number.replace(/\D/g, "")}`;

// The address is stored as free text; split it so the footer and contact card
// can render it as separate lines. Accepts newlines or commas, since an admin
// typing into a textarea will use either.
export const addressLines = (address: string): string[] =>
  address
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);

// "14:00" → "2:00 PM". Times are stored as 24h strings so an <input type="time">
// round-trips them, but every guest-facing surface shows 12h.
export function formatTime(value: string): string {
  const [rawHours, rawMinutes] = value.split(":");
  const hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return value;

  const suffix = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}
