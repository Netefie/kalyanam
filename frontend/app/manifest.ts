import type { MetadataRoute } from "next";

import { getSiteSettings } from "@/lib/settings";
import { SITE_DESCRIPTION, SITE_NAME, SITE_SHORT_NAME } from "@/lib/site";

// Served at /manifest.webmanifest, linked automatically from <head>.
//
// Mostly here so "Add to Home Screen" on mobile keeps the Kalyanam mark and
// brand colours instead of a screenshot of the page. Lighthouse's SEO/PWA
// audits also check for it, and those scores are what most people mean when
// they ask whether a site is "SEO-ready".
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings();

  return {
    name: settings.hotelName || SITE_NAME,
    // The short name is the home-screen label — kept to the code constant
    // because it has to stay under ~12 characters to avoid being truncated.
    short_name: SITE_SHORT_NAME,
    description: settings.tagline || SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fcf8f2",
    theme_color: "#a95038",
    lang: "en-IN",
    categories: ["travel", "food", "lifestyle"],
    icons: [
      // These point at /public, not app/icon.png: the file-convention icons are
      // served from content-hashed URLs, which a manifest can't name.
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android crops maskable icons to a circle — this one keeps the mark
      // inside the safe zone so the flourish doesn't lose its tips.
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
