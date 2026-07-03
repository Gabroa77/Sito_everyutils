/**
 * Calendar Logic Utilities
 * Pure functions using native Date object.
 */

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export interface CalendarEvent {
  id: string;
  date: string; // Format: YYYY-MM-DD
  title: string;
  time?: string;
}

/**
 * Returns the ISO 8601 week number for a given date.
 */
export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}

/**
 * Returns the progressive day of the year (1-366).
 */
export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Returns an array of days to fill a 7x6 month grid.
 * @param year Year (e.g. 2024)
 * @param month Month index (0-11)
 * @param startDayOfWeek 0 for Sunday, 1 for Monday
 */
export function getDaysInMonth(year: number, month: number, startDayOfWeek: number = 1): CalendarDay[] {
  const days: CalendarDay[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Padding from previous month
  let startPadding = firstDayOfMonth.getDay() - startDayOfWeek;
  if (startPadding < 0) startPadding += 7;

  for (let i = startPadding; i > 0; i--) {
    const d = new Date(year, month, 1 - i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: d.getTime() === today.getTime(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }

  // Days of current month
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const d = new Date(year, month, i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      isCurrentMonth: true,
      isToday: d.getTime() === today.getTime(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }

  // Padding from next month to fill exactly 42 cells (6 rows)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const d = new Date(year, month + 1, i);
    d.setHours(0, 0, 0, 0);
    days.push({
      date: d,
      isCurrentMonth: false,
      isToday: d.getTime() === today.getTime(),
      isWeekend: d.getDay() === 0 || d.getDay() === 6
    });
  }

  return days;
}

/**
 * Returns the 7 days of the week containing the given date.
 */
export function getDaysInWeek(date: Date, startDayOfWeek: number = 1): CalendarDay[] {
  const days: CalendarDay[] = [];
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay();
  const diff = (day < startDayOfWeek ? 7 : 0) + day - startDayOfWeek;
  d.setDate(d.getDate() - diff);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const current = new Date(d);
    days.push({
      date: current,
      isCurrentMonth: current.getMonth() === date.getMonth(),
      isToday: current.getTime() === today.getTime(),
      isWeekend: current.getDay() === 0 || current.getDay() === 6
    });
    d.setDate(d.getDate() + 1);
  }
  return days;
}

export function getMonthName(month: number): string {
  const months = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  return months[month];
}

export function getDayName(day: number): string {
  const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  return days[day];
}

export function formatDateExtended(date: Date): string {
  return `${getDayName(date.getDay())} ${date.getDate()} ${getMonthName(date.getMonth())} ${date.getFullYear()}`;
}

export function dateToISOKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
