import type { HHmm } from "@/features/schedule/types";

function parseHHmm(t: HHmm): { h: number; m: number } {
  const m = /^(\d{2}):(\d{2})$/.exec(t);
  if (!m) throw new Error(`Invalid HH:mm: ${t}`);
  const hh = Number(m[1]);
  const mm = Number(m[2]);
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) throw new Error(`Invalid HH:mm: ${t}`);
  return { h: hh, m: mm };
}

/**
 * Compute hours between start and end. If end < start, assumes overnight shift.
 * Returns decimal hours rounded to 2 decimals.
 */
export function computeShiftHours(startTime: HHmm, endTime: HHmm): number {
  const s = parseHHmm(startTime);
  const e = parseHHmm(endTime);

  const startMin = s.h * 60 + s.m;
  const endMin = e.h * 60 + e.m;

  const diffMin = endMin >= startMin ? endMin - startMin : 24 * 60 - startMin + endMin;
  const hours = diffMin / 60;

  return Math.round(hours * 100) / 100;
}
