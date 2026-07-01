import { ApiError } from "./ApiError.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmail(value) {
  return typeof value === "string" && EMAIL_RE.test(value);
}

// Throws a 400 listing any required fields that are missing/blank.
export function requireFields(body, fields) {
  const missing = fields.filter((f) => {
    const v = body?.[f];
    return v === undefined || v === null || v === "";
  });
  if (missing.length) {
    throw new ApiError(
      400,
      `Missing required field(s): ${missing.join(", ")}`,
      missing
    );
  }
}

// Generic guard: throws a 400 with `message` when `condition` is falsy.
export function check(condition, message) {
  if (!condition) throw new ApiError(400, message);
}
