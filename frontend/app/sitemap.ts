import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

// Served at /sitemap.xml, and pointed at from robots.txt.
//
// Every public route is listed explicitly rather than derived from the app
// directory: the admin panel and /manage-booking live there too, and a sitemap
// that leaks them undoes the robots.txt rules. Adding a public page means
// adding a line here.
//
// `priority` is only a relative hint within this one site — it says nothing to
// Google about ranking against anyone else. The ordering below reflects what
// the business actually wants found: the venue and stay pages first, the legal
// boilerplate last.
const ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/accommodations", changeFrequency: "weekly", priority: 0.9 },
  { path: "/weddings", changeFrequency: "monthly", priority: 0.9 },
  { path: "/banquet", changeFrequency: "monthly", priority: 0.8 },
  { path: "/kaara", changeFrequency: "monthly", priority: 0.8 },
  { path: "/experiences", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "yearly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
  { path: "/cancellation-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // One timestamp for the whole build. Per-route dates would need real content
  // timestamps to mean anything, and a lastModified that changes on every
  // deploy without the page changing just teaches crawlers to ignore it.
  const lastModified = new Date();

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
