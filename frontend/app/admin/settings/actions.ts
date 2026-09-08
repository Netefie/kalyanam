"use server";

import { updateTag } from "next/cache";

import { SETTINGS_TAG } from "@/lib/settings";

const API_BASE = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

/**
 * Purges the cached site settings so an admin's save shows on the public site
 * immediately, instead of waiting out the 300s revalidate window set in
 * lib/settings.ts.
 *
 * `updateTag` (rather than `revalidateTag`) is what gives read-your-own-writes
 * here: it expires the entry outright, so the next visitor blocks on a fresh
 * fetch instead of being served the stale value one more time. It is only
 * callable from a Server Action, which is why this isn't a route handler.
 *
 * The admin token is verified against the backend rather than trusted — a
 * Server Action is reachable by anyone who can load the page.
 */
export async function revalidateSiteSettings(token: string): Promise<void> {
  if (!token) return;

  try {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) return;
  } catch {
    // The save itself already succeeded; the cache expires on its own within
    // five minutes regardless, so a failure here isn't worth surfacing.
    return;
  }

  updateTag(SETTINGS_TAG);
}
