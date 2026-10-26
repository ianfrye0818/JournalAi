import {
  buildDraftMessage,
  buildDraftSystem,
  DRAFT_SYSTEM_PROMPT,
} from './draft.prompt';

describe('draft prompt', () => {
  describe(buildDraftSystem, () => {
    it('caches the base prompt alone when there is no style profile', () => {
      for (const style of [null, { samples: '  ', notes: null }]) {
        expect(buildDraftSystem(style)).toEqual([
          {
            type: 'text',
            text: DRAFT_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ]);
      }
    });

    it('puts the breakpoint after the style block', () => {
      const [base, style] = buildDraftSystem({
        samples: 'Sample entry.',
        notes: null,
      });

      expect(base).toEqual({ type: 'text', text: DRAFT_SYSTEM_PROMPT });
      expect(style.text).toContain(
        '<sample_entries>\nSample entry.\n</sample_entries>',
      );
      expect(style.text).not.toContain('<style_notes>');
      expect(style.cache_control).toEqual({ type: 'ephemeral' });
    });
  });

  describe(buildDraftMessage, () => {
    const base = {
      date: '2026-10-26',
      timezone: 'UTC',
      snippets: [
        { text: 'Lunch', capturedAt: new Date('2026-10-26T12:30:00Z') },
        { text: 'Gym', capturedAt: new Date('2026-10-26T18:00:00Z') },
      ],
      questions: [],
    };

    it('lists snippets in the given (chronological) order with local times', () => {
      const message = buildDraftMessage(base);

      expect(message.indexOf('Lunch')).toBeLessThan(message.indexOf('Gym'));
      expect(message).toContain('<snippet time="12:30 PM">');
      expect(message).not.toContain('<answers>');
    });

    it('includes feedback even with no previous draft', () => {
      const message = buildDraftMessage({ ...base, feedback: 'Keep it short' });

      expect(message).toContain('<feedback>\nKeep it short\n</feedback>');
      expect(message).not.toContain('<previous_draft>');
    });
  });
});
