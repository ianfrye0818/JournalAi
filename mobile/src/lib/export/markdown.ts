/**
 * Renders a finalized day as an Obsidian note: YAML frontmatter, the entry, and optionally the
 * snippets it was written from. Pure, so the same text goes to the vault, the share sheet, and zips.
 */

export type ExportSnippet = { text: string; capturedAt: Date };

export type ExportDay = {
  /** `YYYY-MM-DD` */
  date: string;
  title: string | null;
  /** Markdown. */
  body: string;
  tags: readonly string[];
  snippets: readonly ExportSnippet[];
};

export type RenderOptions = { includeSnippets: boolean };

export const JOURNAL_TAG = 'journal';
export const DEFAULT_FILENAME_TEMPLATE = 'YYYY-MM-DD';

/**
 * Obsidian tags can't hold spaces or most punctuation, `#` is implied, and an all-digit tag isn't
 * a tag at all. Returns `''` for anything that can't be saved.
 */
export function normalizeTag(tag: string): string {
  const cleaned = tag
    .trim()
    .replace(/^#+/, '')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_\-/]/gu, '')
    .toLowerCase();
  return /^\d*$/.test(cleaned) ? '' : cleaned;
}

/** `journal` first, then the entry's own tags, normalized and without repeats. */
export function exportTags(tags: readonly string[]): string[] {
  const out = [JOURNAL_TAG];
  for (const tag of tags) {
    const t = normalizeTag(tag);
    if (t && !out.includes(t)) out.push(t);
  }
  return out;
}

/** JSON's double-quoted strings are valid YAML, escapes included. */
const yamlString = (value: string) => JSON.stringify(value);

const pad = (n: number) => String(n).padStart(2, '0');
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** One list item per snippet; extra lines are indented so they stay inside it. */
function snippetItem({ text, capturedAt }: ExportSnippet): string {
  const [first, ...rest] = text.trim().split('\n');
  return [`- ${clock(capturedAt)} ${first}`, ...rest.map((line) => (line ? `  ${line}` : ''))].join('\n');
}

export function renderMarkdown(day: ExportDay, { includeSnippets }: RenderOptions): string {
  const title = day.title?.trim() || day.date;
  const frontmatter = [
    '---',
    `date: ${day.date}`,
    `title: ${yamlString(title)}`,
    'tags:',
    ...exportTags(day.tags).map((t) => `  - ${t}`),
    `snippets: ${day.snippets.length}`,
    'source: journalai',
    '---',
  ].join('\n');

  const body = day.body.trim();
  // An entry that already opens with its own title shouldn't get a second one.
  const heading = body.startsWith(`# ${title}\n`) || body === `# ${title}` ? null : `# ${title}`;

  const sections = [frontmatter, heading, body];
  if (includeSnippets && day.snippets.length > 0) {
    const sorted = [...day.snippets].sort((a, b) => a.capturedAt.getTime() - b.capturedAt.getTime());
    sections.push(['## Snippets', '', ...sorted.map(snippetItem)].join('\n'));
  }
  return `${sections.filter((s): s is string => !!s).join('\n\n')}\n`;
}

const FORBIDDEN_FILENAME_CHARS = /[\\/:*?"<>|]/;

/** Why a filename template can't be used, or null if it can. */
export function filenameTemplateError(template: string): string | null {
  const t = template.trim();
  if (!t) return 'Enter a file name.';
  if (FORBIDDEN_FILENAME_CHARS.test(t)) return 'File names can’t contain / \\ : * ? " < > |';
  if (!['YYYY', 'MM', 'DD'].every((token) => t.includes(token))) {
    return 'Include YYYY, MM, and DD so every day gets its own file.';
  }
  return null;
}

/** Fills `YYYY`, `MM`, and `DD` in the template and adds `.md` if it's missing. */
export function filenameFor(template: string, date: string): string {
  const [y, m, d] = date.split('-');
  const values: Record<string, string> = { YYYY: y, MM: m, DD: d };
  const name = template.trim().replace(/YYYY|MM|DD/g, (token) => values[token]);
  return name.toLowerCase().endsWith('.md') ? name : `${name}.md`;
}
