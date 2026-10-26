import JSZip from 'jszip';

import { addDays } from '@/lib/dates';
import { filenameFor, renderMarkdown, type ExportDay } from '@/lib/export/markdown';
import type { ExportSettings } from '@/lib/export/settings';

/** One note per day, flat, named by the filename template. */
export async function buildZip(
  days: readonly ExportDay[],
  settings: Pick<ExportSettings, 'filenameTemplate' | 'includeSnippets'>,
): Promise<Uint8Array> {
  const zip = new JSZip();
  for (const day of days) {
    zip.file(
      filenameFor(settings.filenameTemplate, day.date),
      renderMarkdown(day, { includeSnippets: settings.includeSnippets }),
    );
  }
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

/** `journal-2026-10.zip` for a month, `journal-2026-10-01_2026-10-14.zip` for any other range. */
export function zipName(from: string, to: string): string {
  const month = from.slice(0, 7);
  const wholeMonth = from.endsWith('-01') && to.startsWith(month) && addDays(to, 1).endsWith('-01');
  return wholeMonth ? `journal-${from.slice(0, 7)}.zip` : `journal-${from}_${to}.zip`;
}
