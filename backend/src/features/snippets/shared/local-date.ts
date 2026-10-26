/**
 * A day is a device-computed `YYYY-MM-DD` string stored as `@db.Date`. Convert at UTC midnight so
 * the calendar date round-trips unchanged; never derive it from a capture instant.
 */
export const LOCAL_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const localDateToDb = (localDate: string): Date =>
  new Date(`${localDate}T00:00:00.000Z`);

export const dbToLocalDate = (date: Date): string =>
  date.toISOString().slice(0, 10);
