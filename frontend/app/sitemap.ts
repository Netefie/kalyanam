import type { MetadataRoute } from "next";

import { getRooms } from "@/lib/rooms";
import { absoluteUrl, roomPath } from "@/lib/seo";

// Served at /sitemap.xml, and pointed at from robots.txt.
//
// The static routes are listed explicitly rather than derived from the app
// directory: the admin panel and /manage-booking live there too, and a sitemap
// that leaks them undoes the robots.txt rules. Adding a public page means
// adding a line here. Room pages are the exception — they come from the
// admin-managed catalogue, so they're read from the backend instead.
//
// `priority` is only a relative hint within this one site — it says nothing to
// Google about ranking against anyone else. The ordering below reflects what
// the business actually wants found: the venue and stay pages first, the legal
// boilerplate last.
type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const ROUTES: Entry[] = [
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms = await getRooms();

  // One timestamp for the static pages. Per-route dates would need real content
  // timestamps to mean anything, and a lastModified that changes on every
  // deploy without the page changing just teaches crawlers to ignore it.
  const buildTime = new Date();

  // Room pages, on the other hand, have a real one: Mongo stamps `updatedAt`
  // every time an admin saves the room (models/RoomType.js sets timestamps).
  // So an edited description or a changed rate genuinely does move the date,
  // which is the only condition under which lastmod is worth sending at all.
  const roomEntries: MetadataRoute.Sitemap = rooms.map((room) => {
    const updated = room.updatedAt ? new Date(room.updatedAt) : null;

    return {
      url: absoluteUrl(roomPath(room.slug)),
      lastModified:
        updated && !Number.isNaN(updated.getTime()) ? updated : buildTime,
      changeFrequency: "weekly",
      // Just under /accommodations itself: these are the pages meant to catch
      // room-level searches, but the booking flow is still the hub.
      priority: room.featured ? 0.8 : 0.7,
    };
  });

  const staticEntries: MetadataRoute.Sitemap = ROUTES.map(
    ({ path, changeFrequency, priority }) => ({
      url: absoluteUrl(path),
      lastModified: buildTime,
      changeFrequency,
      priority,
    })
  );

  return [...staticEntries, ...roomEntries];
}
