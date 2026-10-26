import { formatTime, formatStoredTime, parseTime } from './time';

describe('clock preference', () => {
  it.each([
    [0, 0, '12:00 AM', '00:00'],
    [12, 0, '12:00 PM', '12:00'],
    [18, 5, '6:05 PM', '18:05'],
    [23, 59, '11:59 PM', '23:59'],
  ])('formats and round-trips %i:%i', (hour, minute, regular, military) => {
    expect(formatTime(hour, minute, '12h')).toBe(regular);
    expect(formatTime(hour, minute, '24h')).toBe(military);
    expect(parseTime(regular, '12h')).toBe(military);
    expect(parseTime(military, '24h')).toBe(military);
    expect(formatStoredTime(military, '12h')).toBe(regular);
  });
  it('accepts lowercase AM/PM and extra spaces', () => {
    expect(parseTime(' 6:05 pm ', '12h')).toBe('18:05');
  });
  it.each(['0:00 AM', '13:00 PM', '6:60 PM', '6:00', 'bad'])(
    'rejects invalid 12-hour input %s',
    (value) => {
      expect(parseTime(value, '12h')).toBeNull();
    },
  );
  it.each(['24:00', '18:60', '-1:00', '6:00 PM', ''])(
    'rejects invalid 24-hour input %s',
    (value) => {
      expect(parseTime(value, '24h')).toBeNull();
    },
  );
});
