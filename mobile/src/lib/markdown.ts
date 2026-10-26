/**
 * Just enough markdown for journal entries: headings, paragraphs, bullet/numbered lists, block
 * quotes, rules, and **bold** / *italic* inline. Anything else renders as plain text.
 */

export type Inline = { text: string; bold?: boolean; italic?: boolean };

export type Block =
  | { kind: 'heading'; level: 1 | 2 | 3; content: Inline[] }
  | { kind: 'paragraph'; content: Inline[] }
  | { kind: 'quote'; content: Inline[] }
  | { kind: 'list'; ordered: boolean; items: Inline[][] }
  | { kind: 'rule' };

const HEADING = /^(#{1,6})\s+(.*)$/;
const BULLET = /^\s*[-*+]\s+(.*)$/;
const NUMBERED = /^\s*\d+[.)]\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

export function parseMarkdown(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let paragraph: string[] = [];

  const flush = () => {
    if (paragraph.length) blocks.push({ kind: 'paragraph', content: parseInline(paragraph.join(' ')) });
    paragraph = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) {
      flush();
      continue;
    }
    if (RULE.test(line)) {
      flush();
      blocks.push({ kind: 'rule' });
      continue;
    }
    const heading = HEADING.exec(line);
    if (heading) {
      flush();
      const level = Math.min(heading[1].length, 3) as 1 | 2 | 3;
      blocks.push({ kind: 'heading', level, content: parseInline(heading[2].trim()) });
      continue;
    }
    if (QUOTE.test(line)) {
      flush();
      const quoted: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i])) quoted.push(QUOTE.exec(lines[i++])![1]);
      i--;
      blocks.push({ kind: 'quote', content: parseInline(quoted.join(' ').trim()) });
      continue;
    }
    const ordered = NUMBERED.test(line);
    if (ordered || BULLET.test(line)) {
      flush();
      const pattern = ordered ? NUMBERED : BULLET;
      const items: Inline[][] = [];
      while (i < lines.length && pattern.test(lines[i])) {
        items.push(parseInline(pattern.exec(lines[i++])![1].trim()));
      }
      i--;
      blocks.push({ kind: 'list', ordered, items });
      continue;
    }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}

const EMPHASIS = /(\*\*|__)(.+?)\1|(\*|_)(.+?)\3/g;

export function parseInline(text: string): Inline[] {
  const spans: Inline[] = [];
  let last = 0;
  for (const match of text.matchAll(EMPHASIS)) {
    const start = match.index ?? 0;
    // `_` inside a word (snake_case) isn't emphasis.
    if (match[3] === '_' && /\w/.test(text[start - 1] ?? '')) continue;
    if (start > last) spans.push({ text: text.slice(last, start) });
    if (match[2] !== undefined) {
      spans.push(...parseInline(match[2]).map((s) => ({ ...s, bold: true })));
    } else {
      spans.push(...parseInline(match[4]).map((s) => ({ ...s, italic: true })));
    }
    last = start + match[0].length;
  }
  if (last < text.length) spans.push({ text: text.slice(last) });
  return spans;
}
