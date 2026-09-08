import type { SiteSettings } from "./api";
import {
  ADDRESS,
  EMAIL,
  MAPS_EMBED_URL,
  MAPS_URL,
  PHONE,
  PHONE_IS_PLACEHOLDER,
  POSTAL_CODE,
  SITE_NAME,
  SOCIALS,
} from "./site";

// Server-side reader for the admin-editable site settings singleton
// (backend/src/models/Settings.js, exposed publicly at GET /api/settings).
//
// The public site is statically prerendered, so this is fetched with a
// revalidate window rather than per request: an admin's save shows up within
// five minutes on its own, and immediately when the admin page pings
// /api/revalidate-settings after saving.

// Prefer a server-only host so SSR traffic doesn't have to egress through the
// public domain, but fall back to the browser-facing one, which is the only
// variable currently set in deployments.
const API_BASE = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export const SETTINGS_TAG = "site-settings";

// What the site renders when the backend can't be reached — at build time, or
// during an outage. These are the values the pages hardcoded before settings
// were wired through, so a failed fetch degrades to the previous behaviour
// instead of blanking the footer. Placeholders stay empty on purpose: an empty
// field is omitted from the JSON-LD, a fake one would be published as fact.
export const SETTINGS_FALLBACK: SiteSettings = {
  key: "site",
  hotelName: SITE_NAME,
  tagline: "",
  email: EMAIL,
  phone: PHONE_IS_PLACEHOLDER ? "" : PHONE,
  whatsapp: "",
  address: `${ADDRESS.line1}\n${ADDRESS.line2}\n${ADDRESS.country}`,
  city: "Sikar",
  state: "Rajasthan",
  postalCode: POSTAL_CODE,
  country: "IN",
  mapsUrl: MAPS_URL,
  mapsEmbedUrl: MAPS_EMBED_URL,
  checkInTime: "14:00",
  checkOutTime: "11:00",
  taxPercent: 18,
  currency: "INR",
  cancellationWindowHours: 24,
  socials: {
    instagram: SOCIALS.instagram,
    facebook: SOCIALS.facebook,
    youtube: "",
  },
  policies: { cancellation: "", houseRules: "" },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API_BASE}/api/settings`, {
      next: { revalidate: 300, tags: [SETTINGS_TAG] },
    });

    if (!res.ok) return SETTINGS_FALLBACK;

    const data = (await res.json()) as Partial<SiteSettings> | null;
    if (!data) return SETTINGS_FALLBACK;

    // Picked field by field rather than spread, for two reasons: a document
    // saved before a field existed comes back without it (and `undefined`
    // reaching a component reads as a hole in the page), and the raw Mongoose
    // document also carries _id/__v/timestamps that would otherwise be
    // serialised into the RSC payload of every page.
    const pick = <K extends keyof SiteSettings>(key: K): SiteSettings[K] =>
      data[key] ?? SETTINGS_FALLBACK[key];

    return {
      key: SETTINGS_FALLBACK.key,
      hotelName: pick("hotelName"),
      tagline: pick("tagline"),
      email: pick("email"),
      phone: pick("phone"),
      whatsapp: pick("whatsapp"),
      address: pick("address"),
      city: pick("city"),
      state: pick("state"),
      postalCode: pick("postalCode"),
      country: pick("country"),
      mapsUrl: pick("mapsUrl"),
      mapsEmbedUrl: pick("mapsEmbedUrl"),
      checkInTime: pick("checkInTime"),
      checkOutTime: pick("checkOutTime"),
      taxPercent: pick("taxPercent"),
      currency: pick("currency"),
      cancellationWindowHours: pick("cancellationWindowHours"),
      socials: { ...SETTINGS_FALLBACK.socials, ...(data.socials ?? {}) },
      policies: { ...SETTINGS_FALLBACK.policies, ...(data.policies ?? {}) },
    };
  } catch {
    return SETTINGS_FALLBACK;
  }
}
