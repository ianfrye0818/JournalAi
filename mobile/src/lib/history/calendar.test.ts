import { finalizedStreak, monthGrid, monthOf, shiftMonth } from '@/lib/history/calendar';

describe('shiftMonth', () => {
  it('moves across year boundaries', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01');
    expect(shiftMonth('2026-01', -1)).toBe('2025-12');
    expect(shiftMonth('2026-10', 0)).toBe('2026-10');
  });
});

describe('monthGrid', () => {
  it('pads to whole Sunday-first weeks', () => {
    // October 2026 starts on a Thursday and has 31 days.
    const weeks = monthGrid('2026-10');
    expect(weeks).toHaveLength(5);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    expect(weeks[0]).toEqual([null, null, null, null, '2026-10-01', '2026-10-02', '2026-10-03']);
    expect(weeks[4][0]).toBe('2026-10-25');
    expect(weeks[4][6]).toBe('2026-10-31');
  });

  it('includes every day of the month exactly once', () => {
    const days = monthGrid('2028-02').flat().filter((d) => d !== null);
    expect(days).toHaveLength(29);
    expect(days.every((d) => monthOf(d) === '2028-02')).toBe(true);
  });
});

describe('finalizedStreak', () => {
  const set = (...dates: string[]) => new Set(dates);

  it('counts back from today when today is finalized', () => {
    expect(finalizedStreak(set('2026-10-26', '2026-10-25', '2026-10-24'), '2026-10-26')).toBe(3);
  });

  it('keeps the streak while today is still open', () => {
    expect(finalizedStreak(set('2026-10-25', '2026-10-24'), '2026-10-26')).toBe(2);
  });

  it('stops at the first gap', () => {
    expect(finalizedStreak(set('2026-10-26', '2026-10-24'), '2026-10-26')).toBe(1);
  });

  it('is zero once yesterday was missed', () => {
    expect(finalizedStreak(set('2026-10-24'), '2026-10-26')).toBe(0);
  });

  it('runs across a month boundary', () => {
    expect(finalizedStreak(set('2026-11-01', '2026-10-31', '2026-10-30'), '2026-11-01')).toBe(3);
  });
});
