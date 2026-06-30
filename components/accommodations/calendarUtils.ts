import {
  format,
  isBefore,
  isSameDay,
  startOfToday,
  differenceInCalendarDays,
} from "date-fns";

/**
 * Format a date for display
 * Example: 12 Jul 2026
 */
export function formatDisplayDate(
  date: Date | null | undefined
): string {
  if (!date) return "Select Date";

  return format(date, "dd MMM yyyy");
}

/**
 * Format month title
 * Example: July 2026
 */
export function formatMonth(
  date: Date
): string {
  return format(date, "MMMM yyyy");
}

/**
 * Check if date is today
 */
export function isToday(
  date: Date
): boolean {
  return isSameDay(date, startOfToday());
}

/**
 * Disable past dates
 */
export function isPastDate(
  date: Date
): boolean {
  return isBefore(date, startOfToday());
}

/**
 * Calculate nights
 */
export function calculateNights(
  checkIn: Date | null,
  checkOut: Date | null
): number {
  if (!checkIn || !checkOut) return 0;

  return differenceInCalendarDays(
    checkOut,
    checkIn
  );
}

/**
 * Validate range
 */
export function isValidRange(
  checkIn: Date | null,
  checkOut: Date | null
): boolean {
  if (!checkIn || !checkOut) return false;

  return checkOut > checkIn;
}

/**
 * Create booking range
 */
export function createRange(
  checkIn: Date | null,
  checkOut: Date | null
) {
  return {
    from: checkIn ?? undefined,
    to: checkOut ?? undefined,
  };
}

/**
 * Luxury short format
 * Example: 12 Jul
 */
export function formatShortDate(
  date: Date | null | undefined
): string {
  if (!date) return "--";

  return format(date, "dd MMM");
}

/**
 * Weekday
 * Example: Mon
 */
export function formatWeekday(
  date: Date
): string {
  return format(date, "EEE");
}

/**
 * Month only
 * Example: Jul
 */
export function formatMonthShort(
  date: Date
): string {
  return format(date, "MMM");
}