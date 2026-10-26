import { excerpt, plainText } from '@/lib/history/excerpt';

describe('plainText', () => {
  it('drops markdown syntax and collapses whitespace', () => {
    expect(plainText('# Morning\n\n- **Coffee** with *Sam*\n> quiet\n1. walk')).toBe(
      'Morning Coffee with Sam quiet walk',
    );
  });
});

describe('excerpt', () => {
  it('splits around the first case-insensitive match', () => {
    expect(excerpt('Had coffee with Sam today.', 'SAM')).toEqual({
      before: 'Had coffee with ',
      match: 'Sam',
      after: ' today.',
    });
  });

  it('trims long text to whole words with ellipses', () => {
    const body = `${'alpha '.repeat(30)}needle ${'omega '.repeat(30)}`;
    const { before, match, after } = excerpt(body, 'needle', 20);
    expect(match).toBe('needle');
    expect(before.startsWith('…alpha')).toBe(true);
    expect(after.endsWith('omega…')).toBe(true);
    expect(before.length).toBeLessThanOrEqual(21);
  });

  it('falls back to the opening when only the title matched', () => {
    expect(excerpt('Short body.', 'title words')).toEqual({ before: 'Short body.', match: '', after: '' });
  });
});
