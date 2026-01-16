import type { ISODate } from "@/features/schedule/types";

/**
 * Parse ISODate "YYYY-MM-DD" into year/month/day numbers (no timezone assumptions).
 */
export function parseISODate(iso: ISODate): { y: number; m: number; d: number } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`Invalid ISODate: ${iso}`);
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/**
 * Format year/month/day into ISODate "YYYY-MM-DD".
 */
export function toISODate(y: number, m: number, d: number): ISODate {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

/**
 * Add days to an ISODate using UTC math to avoid DST surprises in local time.
 */
export function addDaysISO(date: ISODate, days: number): ISODate {
  const { y, m, d } = parseISODate(date);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return toISODate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/**
 * Day-of-week for an ISODate with Monday=1 ... Sunday=7.
 * Uses UTC to keep deterministic.
 */
export function dayOfWeekISO(date: ISODate): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
  const { y, m, d } = parseISODate(date);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const js = dt.getUTCDay(); // 0=Sun..6=Sat
  const iso = (js === 0 ? 7 : js) as 1 | 2 | 3 | 4 | 5 | 6 | 7;
  return iso;
}

/**
 * Compare ISODate strings (lexicographic works for YYYY-MM-DD).
 */
export function compareISO(a: ISODate, b: ISODate): number {
  return a === b ? 0 : a < b ? -1 : 1;
}

/**
 * Returns "YYYY-MM-DD" for "now" in a given IANA timezone, using Intl only.
 * This is needed for "today" computations.
 */
export function todayInTimeZone(timeZone: string, now: Date = new Date()): ISODate {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // en-CA reliably yields YYYY-MM-DD
  return fmt.format(now) as ISODate;
}
