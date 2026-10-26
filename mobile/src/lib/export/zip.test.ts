import JSZip from 'jszip';

import type { ExportDay } from '@/lib/export/markdown';
import { buildZip, zipName } from '@/lib/export/zip';

const day = (date: string, title: string): ExportDay => ({
  date,
  title,
  body: `Body of ${title}.`,
  tags: [],
  snippets: [],
});

describe('buildZip', () => {
  it('holds one note per day, named by the template', async () => {
    const bytes = await buildZip([day('2026-10-01', 'First'), day('2026-10-02', 'Second')], {
      filenameTemplate: 'YYYY-MM-DD',
      includeSnippets: false,
    });
    const zip = await JSZip.loadAsync(bytes);
    expect(Object.keys(zip.files).sort()).toEqual(['2026-10-01.md', '2026-10-02.md']);
    expect(await zip.file('2026-10-02.md')!.async('string')).toContain('# Second\n\nBody of Second.\n');
  });
});

describe('zipName', () => {
  it('names a whole month by the month', () => {
    expect(zipName('2026-02-01', '2026-02-28')).toBe('journal-2026-02.zip');
  });

  it('names any other range by its ends', () => {
    expect(zipName('2026-10-01', '2026-10-14')).toBe('journal-2026-10-01_2026-10-14.zip');
    expect(zipName('2026-10-01', '2026-11-30')).toBe('journal-2026-10-01_2026-11-30.zip');
  });
});
