import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

// Served at /robots.txt.
//
// The disallow list is the admin panel and the two routes that are only
// meaningful with a booking reference in hand. They're worthless as search
// results and, in the admin panel's case, shouldn't be advertised at all.
// (robots.txt hides them from crawling, not from the public — the admin routes
// are guarded by the token check in app/admin/layout.tsx.)
const PRIVATE_PATHS = ["/admin", "/admin/", "/manage-booking"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
