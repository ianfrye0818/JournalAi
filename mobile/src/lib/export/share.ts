import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import { filenameFor, renderMarkdown, type ExportDay } from '@/lib/export/markdown';
import type { ExportSettings } from '@/lib/export/settings';
import { buildZip } from '@/lib/export/zip';

/**
 * Hands exports to the share sheet: one day as a `.md` file, or a range as a zip of them. Files are
 * written to the cache first, since sharing needs a local file.
 */

async function cacheFile(name: string): Promise<File> {
  if (!(await Sharing.isAvailableAsync())) throw new Error('Sharing isn’t available on this device.');
  const dir = new Directory(Paths.cache, 'exports');
  dir.create({ intermediates: true, idempotent: true });
  const file = new File(dir, name);
  file.create({ overwrite: true });
  return file;
}

export async function shareDay(day: ExportDay, settings: ExportSettings) {
  const file = await cacheFile(filenameFor(settings.filenameTemplate, day.date));
  await file.write(renderMarkdown(day, { includeSnippets: settings.includeSnippets }));
  await Sharing.shareAsync(file.uri, {
    mimeType: 'text/markdown',
    UTI: 'net.daringfireball.markdown',
    dialogTitle: 'Share entry',
  });
}

export async function shareZip(name: string, days: readonly ExportDay[], settings: ExportSettings) {
  const bytes = await buildZip(days, settings);
  const file = await cacheFile(name);
  await file.write(bytes);
  await Sharing.shareAsync(file.uri, {
    mimeType: 'application/zip',
    UTI: 'public.zip-archive',
    dialogTitle: 'Share entries',
  });
}
