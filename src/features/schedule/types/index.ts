export type ISODate = string; // "YYYY-MM-DD"
export type HHmm = string; // "HH:mm" 24h

export enum ShiftType {
  LINE_COOK = "line_cook",
  DISHWASHER = "dishwasher",
  PREP = "prep",
  TRAINING = "training",
}

export interface User {
  id: string;
  email: string;
  name: string;
  timezone: string; // IANA TZ, e.g. "America/Chicago"
  calendarId?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface Shift {
  id: string;
  userId: string;

  // Date in the user's timezone (stored as ISODate)
  date: ISODate;

  // Time range in user's timezone
  startTime: HHmm;
  endTime: HHmm;

  station: string; // "Enchilada Griddle", etc.
  location: string;

  // Derived (compute, do not store long-term until DB schema is final)
  hours: number;

  type: ShiftType;
  calendarEventId?: string;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export enum PayPeriodStatus {
  UPCOMING = "upcoming",
  CURRENT = "current",
  COMPLETED = "completed",
}

export interface Week {
  startDate: ISODate; // Wed
  endDate: ISODate;   // Tue
  shifts: Shift[];
  totalHours: number;
}

export interface PayPeriod {
  id: string;
  userId: string;

  startDate: ISODate; // Wed
  endDate: ISODate;   // Tue (13 days after start)
  payDate: ISODate;   // Thu (2 days after end)

  totalHours: number;
  weeks: Week[];
  shifts: Shift[];

  status: PayPeriodStatus;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface PayPeriodInfo {
  startDate: ISODate;
  endDate: ISODate;
  payDate: ISODate;
}
