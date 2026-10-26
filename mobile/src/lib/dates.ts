/**
 * A journal "day" is a local calendar date (`YYYY-MM-DD`) that starts at the rollover hour rather
 * than midnight, so late-night snippets still belong to the evening they were part of.
 */

export const DEFAULT_ROLLOVER_HOUR = 4;

/** Formats the local calendar date of `date` as `YYYY-MM-DD`. */
export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Parses `YYYY-MM-DD` into local midnight of that date. */
export function parseLocalDate(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) throw new Error(`Invalid local date: ${value}`);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

/** The journal day `now` belongs to: before `rolloverHour` it still counts as the previous day. */
export function localDate(now: Date = new Date(), rolloverHour: number = DEFAULT_ROLLOVER_HOUR): string {
  if (!Number.isInteger(rolloverHour) || rolloverHour < 0 || rolloverHour > 23) {
    throw new RangeError(`rolloverHour must be an integer from 0 to 23, got ${rolloverHour}`);
  }
  if (now.getHours() >= rolloverHour) return formatLocalDate(now);
  // Build from calendar parts rather than subtracting 24h, which is wrong across DST changes.
  return formatLocalDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
}

/** Shifts a `YYYY-MM-DD` date by whole calendar days (negative goes back). */
export function addDays(value: string, days: number): string {
  const d = parseLocalDate(value);
  return formatLocalDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() + days));
}
