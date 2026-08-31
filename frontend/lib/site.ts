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
