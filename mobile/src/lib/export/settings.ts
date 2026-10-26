import { eq, like } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/lib/db/client';
import { kv } from '@/lib/db/schema';
import { DEFAULT_FILENAME_TEMPLATE, filenameTemplateError } from '@/lib/export/markdown';

/** Export preferences, one kv row each under `settings.export.`. */
export type ExportSettings = {
  /** SAF tree URI of the vault's daily-notes folder (Android). */
  vaultUri: string | null;
  filenameTemplate: string;
  includeSnippets: boolean;
  /** Write each day into the vault as soon as it's finalized. */
  autoExport: boolean;
};

const PREFIX = 'settings.export.';
const key = (name: keyof ExportSettings) => `${PREFIX}${name}`;

export const DEFAULT_EXPORT_SETTINGS: ExportSettings = {
  vaultUri: null,
  filenameTemplate: DEFAULT_FILENAME_TEMPLATE,
  includeSnippets: false,
  autoExport: true,
};

function decode(value: string | undefined): unknown {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function parse(rows: readonly { key: string; value: string }[]): ExportSettings {
  const raw = new Map(rows.map((r) => [r.key, decode(r.value)]));
  const vaultUri = raw.get(key('vaultUri'));
  const template = raw.get(key('filenameTemplate'));
  const includeSnippets = raw.get(key('includeSnippets'));
  const autoExport = raw.get(key('autoExport'));
  return {
    vaultUri: typeof vaultUri === 'string' && vaultUri ? vaultUri : null,
    filenameTemplate:
      typeof template === 'string' && !filenameTemplateError(template)
        ? template
        : DEFAULT_EXPORT_SETTINGS.filenameTemplate,
    includeSnippets:
      typeof includeSnippets === 'boolean' ? includeSnippets : DEFAULT_EXPORT_SETTINGS.includeSnippets,
    autoExport: typeof autoExport === 'boolean' ? autoExport : DEFAULT_EXPORT_SETTINGS.autoExport,
  };
}

const selectAll = () => db.select().from(kv).where(like(kv.key, `${PREFIX}%`));

export function getExportSettings(): ExportSettings {
  return parse(selectAll().all());
}

export function useExportSettings(): ExportSettings {
  const { data } = useLiveQuery(selectAll());
  return parse(data);
}

export async function setExportSetting<K extends keyof ExportSettings>(name: K, value: ExportSettings[K]) {
  if (value === null) {
    await db.delete(kv).where(eq(kv.key, key(name)));
    return;
  }
  const encoded = JSON.stringify(value);
  await db.insert(kv).values({ key: key(name), value: encoded }).onConflictDoUpdate({
    target: kv.key,
    set: { value: encoded },
  });
}
