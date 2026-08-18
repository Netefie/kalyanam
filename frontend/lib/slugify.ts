// Turns a display name into a URL/code-safe slug, e.g. "Room with Breakfast"
// -> "room-with-breakfast". Shared by the room form and rate plan editor so
// admin-entered names and their generated codes always agree.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
