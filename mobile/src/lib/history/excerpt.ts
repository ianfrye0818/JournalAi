/** A short window of an entry around the first search match, split so the match can be bolded. */
export type Excerpt = { before: string; match: string; after: string };

/** Markdown syntax that would read as noise in a one-line preview. */
const MARKUP = /^\s{0,3}(?:#{1,6}\s+|>\s?|[-*+]\s+|\d+[.)]\s+)|\*\*|__|[*_]/gm;

export function plainText(markdown: string): string {
  return markdown.replace(MARKUP, '').replace(/\s+/g, ' ').trim();
}

/**
 * Up to `radius` characters either side of the first case-insensitive match of `query`, trimmed
 * to word boundaries. When the body doesn't contain it (the title matched), the opening lines.
 */
export function excerpt(markdown: string, query: string, radius = 70): Excerpt {
  const text = plainText(markdown);
  const needle = query.trim().toLowerCase();
  const at = needle ? text.toLowerCase().indexOf(needle) : -1;

  if (at === -1) {
    const cut = text.length > radius * 2 ? `${trimEnd(text.slice(0, radius * 2))}…` : text;
    return { before: cut, match: '', after: '' };
  }

  const end = at + needle.length;
  const start = Math.max(0, at - radius);
  const stop = Math.min(text.length, end + radius);
  return {
    before: (start > 0 ? `…${trimStart(text.slice(start, at))}` : text.slice(0, at)),
    match: text.slice(at, end),
    after: stop < text.length ? `${trimEnd(text.slice(end, stop))}…` : text.slice(end),
  };
}

// Drop the partial word a cut lands in, unless that would drop everything.
const trimStart = (s: string) => {
  const i = s.indexOf(' ');
  return i === -1 ? s : s.slice(i + 1);
};

const trimEnd = (s: string) => {
  const i = s.lastIndexOf(' ');
  return i <= 0 ? s : s.slice(0, i);
};
