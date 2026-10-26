import { addDays, parseLocalDate } from '@/lib/dates';

/**
 * Month math for the Days calendar. A month is `YYYY-MM`, and every day inside it is a
 * `YYYY-MM-DD` journal date, so plain string compares keep calendar order.
 */

export const monthOf = (date: string) => date.slice(0, 7);

/** Moves a `YYYY-MM` month by whole months. */
export function shiftMonth(month: string, by: number): string {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(y, m - 1 + by, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * The month as weeks of seven cells, Sunday first. Cells outside the month are null so the first
 * and last rows line up under their weekday headers.
 */
export function monthGrid(month: string): (string | null)[][] {
  const first = parseLocalDate(`${month}-01`);
  const cells: (string | null)[] = Array(first.getDay()).fill(null);
  for (let day = `${month}-01`; monthOf(day) === month; day = addDays(day, 1)) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/**
 * Consecutive finalized days ending today. Today still being open doesn't break the streak (it
 * isn't over yet), so the count runs back from yesterday until today is finalized too.
 */
export function finalizedStreak(finalized: ReadonlySet<string>, today: string): number {
  let day = finalized.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (finalized.has(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}
