import type { ISODate, PayPeriodInfo, Shift } from "@/features/schedule/types";
import { addDaysISO, compareISO } from "@/features/schedule/utils/date";
import { calculatePayPeriodForDate } from "@/features/schedule/utils/payPeriodCalculator";

/**
 * Return all ISODate values from start..end inclusive.
 */
export function enumerateDates(startDate: ISODate, endDate: ISODate): ISODate[] {
  const out: ISODate[] = [];
  let cur = startDate;
  while (compareISO(cur, endDate) <= 0) {
    out.push(cur);
    cur = addDaysISO(cur, 1);
  }
  return out;
}

/**
 * Group shifts into the pay period that contains `anchorDate`.
 * Returns the pay period info plus the shifts within that window.
 */
export function getPayPeriodWindow(anchorDate: ISODate): PayPeriodInfo {
  return calculatePayPeriodForDate(anchorDate);
}

export function filterShiftsInWindow(shifts: Shift[], window: PayPeriodInfo): Shift[] {
  return shifts.filter((s) => compareISO(s.date, window.startDate) >= 0 && compareISO(s.date, window.endDate) <= 0);
}
