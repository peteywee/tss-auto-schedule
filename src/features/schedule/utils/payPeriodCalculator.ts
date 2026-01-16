import type { ISODate, PayPeriodInfo, Shift, Week } from "@/features/schedule/types";
import { addDaysISO, dayOfWeekISO, compareISO } from "@/features/schedule/utils/date";

/**
 * Business rule:
 * - Pay periods start on Wednesday and run 14 days (Wed..Tue).
 * - endDate = startDate + 13 days (Tuesday)
 * - payDate = endDate + 2 days (Thursday)
 *
 * NOTE: This computes the pay period that CONTAINS the given date.
 */
export function calculatePayPeriodForDate(date: ISODate): PayPeriodInfo {
  const startDate = findMostRecentWednesday(date);
  const endDate = addDaysISO(startDate, 13);
  const payDate = addDaysISO(endDate, 2);
  return { startDate, endDate, payDate };
}

/**
 * Find most recent Wednesday on or before date.
 * ISO dayOfWeek: Mon=1 ... Sun=7. Wednesday=3.
 */
export function findMostRecentWednesday(date: ISODate): ISODate {
  const wednesday: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 3;
  const dow = dayOfWeekISO(date);
  const daysSinceWed = (dow - wednesday + 7) % 7;
  return addDaysISO(date, -daysSinceWed);
}

/**
 * Group shifts into Wed..Tue weeks (7-day weeks) based on each shift.date.
 * Each week.startDate is Wednesday.
 */
export function groupShiftsByWeek(shifts: Shift[]): Week[] {
  const buckets = new Map<ISODate, Shift[]>();

  for (const s of shifts) {
    const weekStart = findMostRecentWednesday(s.date);
    const list = buckets.get(weekStart) ?? [];
    list.push(s);
    buckets.set(weekStart, list);
  }

  const weeks: Week[] = Array.from(buckets.entries())
    .sort(([a], [b]) => compareISO(a, b))
    .map(([startDate, list]) => {
      const sorted = [...list].sort((x, y) => compareISO(x.date, y.date));
      const endDate = addDaysISO(startDate, 6);
      const totalHours = sorted.reduce((sum, sh) => sum + sh.hours, 0);
      return {
        startDate,
        endDate,
        shifts: sorted,
        totalHours: Math.round(totalHours * 100) / 100,
      };
    });

  return weeks;
}
