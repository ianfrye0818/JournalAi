import { DEFAULT_ROLLOVER_HOUR, formatLocalDate, localDate, parseLocalDate } from './dates';

// Dates are built from local parts, so these hold in any machine timezone.
const at = (y: number, mo: number, d: number, h: number, mi = 0) => new Date(y, mo - 1, d, h, mi);

describe('localDate', () => {
  it('defaults to a 4am rollover', () => {
    expect(DEFAULT_ROLLOVER_HOUR).toBe(4);
  });

  it('puts a 1am snippet on the previous day with the default rollover', () => {
    expect(localDate(at(2026, 10, 26, 1, 0))).toBe('2026-10-25');
  });

  it('switches to the new day exactly at the rollover hour', () => {
    expect(localDate(at(2026, 10, 26, 3, 59))).toBe('2026-10-25');
    expect(localDate(at(2026, 10, 26, 4, 0))).toBe('2026-10-26');
  });

  it('keeps daytime and late evening on the same day', () => {
    expect(localDate(at(2026, 10, 26, 12, 0))).toBe('2026-10-26');
    expect(localDate(at(2026, 10, 26, 23, 59))).toBe('2026-10-26');
  });

  it('uses plain midnight when the rollover hour is 0', () => {
    expect(localDate(at(2026, 10, 26, 0, 30), 0)).toBe('2026-10-26');
  });

  it('honors a custom rollover hour', () => {
    expect(localDate(at(2026, 10, 26, 5, 0), 6)).toBe('2026-10-25');
    expect(localDate(at(2026, 10, 26, 6, 0), 6)).toBe('2026-10-26');
  });

  it('rolls back across month, year, and leap-day boundaries', () => {
    expect(localDate(at(2026, 11, 1, 2))).toBe('2026-10-31');
    expect(localDate(at(2027, 1, 1, 1))).toBe('2026-12-31');
    expect(localDate(at(2028, 3, 1, 1))).toBe('2028-02-29');
    expect(localDate(at(2027, 3, 1, 1))).toBe('2027-02-28');
  });

  it('rejects an out-of-range rollover hour', () => {
    expect(() => localDate(at(2026, 10, 26, 1), 24)).toThrow(RangeError);
    expect(() => localDate(at(2026, 10, 26, 1), -1)).toThrow(RangeError);
    expect(() => localDate(at(2026, 10, 26, 1), 1.5)).toThrow(RangeError);
  });
});

describe('formatLocalDate / parseLocalDate', () => {
  it('zero-pads month and day', () => {
    expect(formatLocalDate(at(2026, 1, 5, 9))).toBe('2026-01-05');
  });

  it('round-trips', () => {
    expect(formatLocalDate(parseLocalDate('2026-02-28'))).toBe('2026-02-28');
  });

  it('rejects malformed input', () => {
    expect(() => parseLocalDate('2026-2-28')).toThrow();
  });
});
