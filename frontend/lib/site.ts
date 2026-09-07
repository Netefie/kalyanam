// Single source of truth for every outward-facing detail the site links to —
// phone, email, address, map and socials — plus the external URLs the CTAs
// point at. Anything that leaves the site (or dials/mails) reads from here, so
// the real values only ever have to be filled in once.
//
// ⚠️ Values marked TODO are still placeholders. Replace them before launch.

// TODO: replace with the hotel's real reception number.
export const PHONE = "+91 98765 43210";

// tel: needs digits and an optional leading +, nothing else.
export const PHONE_HREF = `tel:${PHONE.replace(/[^\d+]/g, "")}`;

export const EMAIL = "info@kalyanamhotel.com";
export const EMAIL_HREF = `mailto:${EMAIL}`;

export const WEBSITE = "www.kalyanamhotel.com";

export const ADDRESS = {
  line1: "Jaipur Road",
  line2: "Sikar, Rajasthan",
  country: "India",
};

// Used by the footer, the contact cards and "Get Directions".
export const MAPS_URL =
  "https://maps.google.com/?q=Kalyanam+Hotel+%26+Resort+Sikar";

export const MAPS_EMBED_URL =
  "https://maps.google.com/maps?q=Kalyanam%20Hotel%20%26%20Resort%20Sikar&t=&z=15&ie=UTF8&iwloc=&output=embed";

// TODO: replace with the real profile URLs (e.g. https://instagram.com/kalyanamhotel).
export const SOCIALS = {
  instagram: "https://instagram.com/",
  facebook: "https://facebook.com/",
};

// Kaara's live ordering / digital menu (Petpooja).
export const KAARA_MENU_URL = "https://dinein.petpooja.com/qr/nre1djqbag/T-5";

// TODO: paste the YouTube/Vimeo link for each tour video. While a value is
// empty the matching "Watch" control renders visibly disabled rather than as a
// CTA that silently does nothing. See components/common/WatchVideoLink.tsx.
export const VIDEO_URLS = {
  roomTour: "",
  kaaraExperience: "",
  weddingExperience: "",
};

// ---------------------------------------------------------------------------
// SEO / search-engine identity
// ---------------------------------------------------------------------------
//
// Everything below feeds the <head> metadata, robots.txt, the sitemap and the
// schema.org JSON-LD. Search engines cache what they read here, so a wrong
// value is more expensive to fix than a missing one — anything still a
// placeholder is deliberately omitted from the structured data rather than
// published as fact (see PHONE_IS_PLACEHOLDER below).

// Canonical origin, no trailing slash. Every absolute URL the site emits
// (canonicals, og:url, sitemap entries) is built from this, so it must match
// the domain the site is actually served on or Google will treat the pages as
// duplicates of an unreachable host. Override per-environment with
// NEXT_PUBLIC_SITE_URL (e.g. a Vercel preview domain).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || `https://${WEBSITE}`
).replace(/\/+$/, "");

export const SITE_NAME = "Kalyanam Hotel & Resort";

// Used as the <title> suffix and the og:site_name.
export const SITE_SHORT_NAME = "Kalyanam";

// The one-line description search results fall back to.
export const SITE_DESCRIPTION =
  "Kalyanam Hotel & Resort in Sikar, Rajasthan — luxury rooms, the Kaara rooftop restaurant, " +
  "a banquet hall and elegant wedding venues. Book direct for weddings, receptions and stays.";

// ⚠️ TODO: PHONE at the top of this file is still the placeholder reception
// number. A phone number in JSON-LD is what Google shows in the local knowledge
// panel and what "call" buttons dial, so it is withheld from structured data
// until it is real. Flip this to false the moment PHONE is correct.
export const PHONE_IS_PLACEHOLDER = true;

// Postal address, split the way schema.org PostalAddress expects.
// TODO: fill POSTAL_CODE and GEO once the exact street address is confirmed —
// both are omitted from the JSON-LD while empty rather than guessed, because a
// wrong pin drops the property in the wrong place on Google Maps.
export const POSTAL_CODE = "";
export const GEO: { latitude: number; longitude: number } | null = null;

export const ADDRESS_SCHEMA = {
  streetAddress: ADDRESS.line1,
  addressLocality: "Sikar",
  addressRegion: "Rajasthan",
  addressCountry: "IN",
};

// Amenities the site itself advertises (FAQ, room pages, Kaara). Kept in sync
// with the copy — schema.org amenities that the page doesn't back up are the
// kind of mismatch that gets rich results demoted.
export const AMENITIES = [
  "Free Wi-Fi",
  "Rooftop restaurant",
  "24x7 room service",
  "Banquet hall",
  "Wedding venue",
  "Conference facilities",
  "Free parking",
  "Air conditioning",
];

// Room types the booking flow actually sells.
export const ROOM_TYPES = ["Deluxe Room", "Super Deluxe Room"];

// TODO: paste the token from Google Search Console once the property is
// verified. Empty means no verification tag is rendered.
export const GOOGLE_SITE_VERIFICATION = "";

// Rough price band, shown by Google alongside local results. schema.org expects
// a symbol run ("₹₹") or a range ("₹₹₹₹-₹₹₹₹"). Left empty — and therefore
// omitted from the JSON-LD — until someone who knows the rack rates sets it,
// because an understated band is a claim the booking page then contradicts.
// TODO: set to the band that matches the real room rates.
export const PRICE_RANGE = "";
