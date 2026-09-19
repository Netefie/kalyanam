import type { Room } from "./api";

// Server-side reader for the public room catalogue
// (backend/src/models/RoomType.js, exposed at GET /api/rooms).
//
// The sibling of lib/settings.ts, and deliberately separate from lib/api.ts:
// `api.rooms.list()` is a plain fetch with no caching directives, so calling it
// from a server component would opt the whole route into dynamic rendering and
// hit Mongo on every request. Everything here is a *prerendered* read — room
// pages, the homepage catalogue, the sitemap, the JSON-LD offers — so it goes
// through a revalidate window with a cache tag instead, exactly like settings.
//
// Live availability is NOT read here and must never be: it depends on a date
// range and changes by the minute (see hooks/useRoomAvailability.ts). This is
// the catalogue only — names, descriptions, images, rates.

const API_BASE = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

export const ROOMS_TAG = "rooms";

// Longer than the settings window (300s): the catalogue changes far less often
// than a phone number or a tax rate, and every room save already purges this
// tag outright via app/admin/rooms/actions.ts.
const REVALIDATE_SECONDS = 900;

/**
 * Active rooms, featured first then cheapest first — the order the backend
 * sorts them in.
 *
 * Returns `[]` when the API is unreachable rather than throwing. That matters
 * at build time: a failed fetch degrades to "no room pages, no room offers in
 * the JSON-LD", which is a thinner site, not a broken build. The alternative —
 * letting it throw — would take down every prerendered page on the site
 * because the root layout's metadata reads this too.
 */
export async function getRooms(): Promise<Room[]> {
  try {
    const res = await fetch(`${API_BASE}/api/rooms`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [ROOMS_TAG] },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as Room[] | null;
    if (!Array.isArray(data)) return [];

    // The API already filters on `active`, but a room the admin retired while
    // this response sat in the cache would otherwise keep its landing page and
    // its sitemap entry until the window expired.
    return data.filter((room) => room && room.slug && room.active !== false);
  } catch {
    return [];
  }
}

/**
 * One room by slug, or `null` when it doesn't exist or isn't published.
 *
 * Reads the list rather than GET /rooms/:slug so a room page and the sitemap
 * share a single cache entry instead of holding one per room, and so an
 * inactive room 404s here — the by-slug endpoint serves inactive rooms too
 * (the admin panel needs them), which would otherwise leave a retired room
 * quietly indexable.
 */
export async function getRoomBySlug(slug: string): Promise<Room | null> {
  const rooms = await getRooms();
  return rooms.find((room) => room.slug === slug) ?? null;
}
