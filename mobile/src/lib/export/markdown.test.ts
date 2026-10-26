import {
  exportTags,
  filenameFor,
  filenameTemplateError,
  normalizeTag,
  renderMarkdown,
  type ExportDay,
} from '@/lib/export/markdown';

const day: ExportDay = {
  date: '2026-10-25',
  title: 'A quiet Sunday',
  body: 'Slept in.\n\nWalked to the **market**.\n',
  tags: ['Family', 'slow days'],
  snippets: [
    { text: 'coffee on the porch', capturedAt: new Date(2026, 9, 25, 9, 5) },
    { text: 'bought pears\nand bread', capturedAt: new Date(2026, 9, 25, 7, 30) },
  ],
};

describe('renderMarkdown', () => {
  it('writes frontmatter, title, and body', () => {
    expect(renderMarkdown(day, { includeSnippets: false })).toBe(
      [
        '---',
        'date: 2026-10-25',
        'title: "A quiet Sunday"',
        'tags:',
        '  - journal',
        '  - family',
        '  - slow-days',
        'snippets: 2',
        'source: journalai',
        '---',
        '',
        '# A quiet Sunday',
        '',
        'Slept in.',
        '',
        'Walked to the **market**.',
        '',
      ].join('\n'),
    );
  });

  it('appends snippets oldest first, keeping extra lines inside the item', () => {
    const md = renderMarkdown(day, { includeSnippets: true });
    expect(md.endsWith('## Snippets\n\n- 07:30 bought pears\n  and bread\n- 09:05 coffee on the porch\n')).toBe(
      true,
    );
  });

  it('writes the mood after the tags when there is one', () => {
    expect(renderMarkdown({ ...day, mood: 'tired but "hopeful"' }, { includeSnippets: false })).toContain(
      '  - slow-days\nmood: "tired but \\"hopeful\\""\nsnippets: 2',
    );
    expect(renderMarkdown({ ...day, mood: '  ' }, { includeSnippets: false })).not.toContain('mood:');
  });

  it('skips the appendix when there are no snippets', () => {
    const md = renderMarkdown({ ...day, snippets: [] }, { includeSnippets: true });
    expect(md).not.toContain('## Snippets');
    expect(md).toContain('snippets: 0');
  });

  it('falls back to the date for a missing title and escapes quotes', () => {
    expect(renderMarkdown({ ...day, title: null }, { includeSnippets: false })).toContain(
      'title: "2026-10-25"\ntags:',
    );
    expect(renderMarkdown({ ...day, title: 'The "big" day' }, { includeSnippets: false })).toContain(
      'title: "The \\"big\\" day"',
    );
  });

  it('does not repeat a title the body already starts with', () => {
    const md = renderMarkdown({ ...day, body: '# A quiet Sunday\n\nSlept in.' }, { includeSnippets: false });
    expect(md.match(/^# A quiet Sunday$/gm)).toHaveLength(1);
  });
});

describe('tags', () => {
  it('normalizes to Obsidian tag syntax', () => {
    expect(normalizeTag('  #Work Life ')).toBe('work-life');
    expect(normalizeTag('café/notes!')).toBe('café/notes');
    expect(normalizeTag('2026')).toBe('');
  });

  it('puts journal first and drops repeats and unusable tags', () => {
    expect(exportTags(['Journal', 'work', '#work', '!!'])).toEqual(['journal', 'work']);
  });
});

describe('filenames', () => {
  it('fills the template and adds .md', () => {
    expect(filenameFor('YYYY-MM-DD', '2026-03-07')).toBe('2026-03-07.md');
    expect(filenameFor('Journal DD.MM.YYYY.md', '2026-03-07')).toBe('Journal 07.03.2026.md');
  });

  it('rejects templates that are empty, unsafe, or not unique per day', () => {
    expect(filenameTemplateError('YYYY-MM-DD')).toBeNull();
    expect(filenameTemplateError('  ')).not.toBeNull();
    expect(filenameTemplateError('YYYY/MM-DD')).not.toBeNull();
    expect(filenameTemplateError('YYYY-MM')).not.toBeNull();
  });
});
