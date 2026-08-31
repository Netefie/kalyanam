// Small helpers shared by multiple templates — kept here rather than
// repeated per-file so "how do we phrase a guest's name" has one answer.
import { env } from "../../config/env.js";

export function guestName(booking) {
  return `${booking.guest?.firstName || ""} ${booking.guest?.lastName || ""}`.trim() || "Guest";
}

export function guestCountLabel(booking) {
  const adults = booking.adults || 1;
  const children = booking.children || 0;
  return children > 0 ? `${adults} adult(s), ${children} child(ren)` : `${adults} adult(s)`;
}

// Whole days from now until `date`, floored at 0 — used to personalize
// "in N day(s)" copy in the pre-arrival reminder.
export function daysUntil(date) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.round(diff / (24 * 60 * 60 * 1000)));
}

export function minutesUntil(date) {
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.round(diff / (60 * 1000)));
}

// Absolute link into the frontend (same Next app serves both the public
// site and /admin), for CTA buttons. `path` should start with "/".
export function siteLink(path = "/") {
  return `${env.siteUrl}${path}`;
}
