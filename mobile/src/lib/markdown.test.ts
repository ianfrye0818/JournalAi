import { parseInline, parseMarkdown } from '@/lib/markdown';

describe('parseMarkdown', () => {
  it('splits paragraphs on blank lines and joins wrapped lines', () => {
    expect(parseMarkdown('One\nstill one\n\nTwo')).toEqual([
      { kind: 'paragraph', content: [{ text: 'One still one' }] },
      { kind: 'paragraph', content: [{ text: 'Two' }] },
    ]);
  });

  it('parses headings, capping the level at 3', () => {
    expect(parseMarkdown('# Title\n#### Deep')).toEqual([
      { kind: 'heading', level: 1, content: [{ text: 'Title' }] },
      { kind: 'heading', level: 3, content: [{ text: 'Deep' }] },
    ]);
  });

  it('groups consecutive list items', () => {
    expect(parseMarkdown('- a\n- b\n\n1. c\n2) d')).toEqual([
      { kind: 'list', ordered: false, items: [[{ text: 'a' }], [{ text: 'b' }]] },
      { kind: 'list', ordered: true, items: [[{ text: 'c' }], [{ text: 'd' }]] },
    ]);
  });

  it('parses quotes and rules', () => {
    expect(parseMarkdown('> said\n> this\n\n---')).toEqual([
      { kind: 'quote', content: [{ text: 'said this' }] },
      { kind: 'rule' },
    ]);
  });
});

describe('parseInline', () => {
  it('marks bold and italic spans', () => {
    expect(parseInline('a **b** *c* _d_')).toEqual([
      { text: 'a ' },
      { text: 'b', bold: true },
      { text: ' ' },
      { text: 'c', italic: true },
      { text: ' ' },
      { text: 'd', italic: true },
    ]);
  });

  it('nests italic inside bold', () => {
    expect(parseInline('**a _b_**')).toEqual([
      { text: 'a ', bold: true },
      { text: 'b', bold: true, italic: true },
    ]);
  });

  it('leaves intra-word underscores alone', () => {
    expect(parseInline('snake_case_name')).toEqual([{ text: 'snake_case_name' }]);
  });
});
