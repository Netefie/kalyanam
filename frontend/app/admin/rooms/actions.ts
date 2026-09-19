"use server";

import { updateTag } from "next/cache";

import { ROOMS_TAG } from "@/lib/rooms";

const API_BASE = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

/**
 * Purges the cached room catalogue after an admin adds, edits or retires a
 * room, so the public site picks it up immediately instead of waiting out the
 * 900s revalidate window in lib/rooms.ts.
 *
 * This matters more than the settings equivalent it mirrors: the catalogue now
 * feeds the homepage cards, the /accommodations listing, every
 * /accommodations/[slug] page, the JSON-LD offers and the sitemap. Without
 * this, a room added in the admin panel would have no landing page — and no
 * sitemap entry telling Google to come and find it — for up to fifteen
 * minutes.
 *
 * `updateTag` (rather than `revalidateTag`) is what gives read-your-own-writes
 * here: it expires the entry outright, so the next visitor blocks on a fresh
 * fetch instead of being served the stale value one more time. It is only
 * callable from a Server Action, which is why this isn't a route handler.
 *
 * The admin token is verified against the backend rather than trusted — a
 * Server Action is reachable by anyone who can load the page.
 */
export async function revalidateRoomCatalogue(token: string): Promise<void> {
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return;
  } catch {
    // The save itself already succeeded; the cache expires on its own within
    // the revalidate window regardless, so a failure here isn't worth
    // surfacing to the admin mid-save.
    return;
  }

  updateTag(ROOMS_TAG);
}
