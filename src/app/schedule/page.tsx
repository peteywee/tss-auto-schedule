import type { Shift } from "@/features/schedule/types";
import { ShiftType } from "@/features/schedule/types";
import { todayInTimeZone } from "@/features/schedule/utils/date";
import { computeShiftHours } from "@/features/schedule/utils/hourCalculator";
import { calculatePayPeriodForDate, groupShiftsByWeek } from "@/features/schedule/utils/payPeriodCalculator";
import { filterShiftsInWindow } from "@/features/schedule/utils/shiftGrouper";

function sampleShifts(): Shift[] {
  // Sample only. This proves grouping + pay period math before any database/calendar wiring.
  const nowIso = new Date().toISOString();

  const raw: Omit<Shift, "hours">[] = [
    {
      id: "s1",
      userId: "u1",
      date: "2026-01-14",
      startTime: "10:00",
      endTime: "18:00",
      station: "Grill Cook",
      location: "Uncle Julio's Arlington",
      type: ShiftType.LINE_COOK,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: "s2",
      userId: "u1",
      date: "2026-01-16",
      startTime: "16:00",
      endTime: "23:00",
      station: "Enchilada Griddle",
      location: "Uncle Julio's Arlington",
      type: ShiftType.LINE_COOK,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: "s3",
      userId: "u1",
      date: "2026-01-20",
      startTime: "09:00",
      endTime: "15:30",
      station: "Prep",
      location: "Uncle Julio's Arlington",
      type: ShiftType.PREP,
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  return raw.map((s) => ({
    ...s,
    hours: computeShiftHours(s.startTime, s.endTime),
  }));
}

export default function SchedulePage() {
  const tz = "America/Chicago";
  const today = todayInTimeZone(tz);
  const window = calculatePayPeriodForDate(today);

  const shifts = sampleShifts();
  const periodShifts = filterShiftsInWindow(shifts, window);
  const weeks = groupShiftsByWeek(periodShifts);
  const totalHours = Math.round(periodShifts.reduce((sum, s) => sum + s.hours, 0) * 100) / 100;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Schedule</h1>

      <section className="mt-4 rounded-lg border p-4">
        <div className="text-sm opacity-80">Timezone: {tz}</div>
        <div className="mt-2 text-lg font-medium">
          Pay Period: {window.startDate} → {window.endDate}
        </div>
        <div className="text-sm opacity-80">Pay Date: {window.payDate}</div>
        <div className="mt-2 text-sm">
          Total Hours (in sample data): <span className="font-semibold">{totalHours}</span>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {weeks.length === 0 ? (
          <div className="rounded-lg border p-4">
            <div className="font-medium">No shifts in this pay period (sample data)</div>
            <div className="text-sm opacity-80">This is expected until data sync is implemented.</div>
          </div>
        ) : (
          weeks.map((w) => (
            <div key={w.startDate} className="rounded-lg border p-4">
              <div className="font-medium">
                Week: {w.startDate} → {w.endDate}
              </div>
              <div className="text-sm opacity-80">Week Hours: {w.totalHours}</div>

              <ul className="mt-3 space-y-2">
                {w.shifts.map((s) => (
                  <li key={s.id} className="rounded-md border p-3">
                    <div className="font-medium">
                      {s.date} • {s.startTime}–{s.endTime} • {s.hours}h
                    </div>
                    <div className="text-sm opacity-80">
                      {s.station} • {s.location} • {s.type}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
