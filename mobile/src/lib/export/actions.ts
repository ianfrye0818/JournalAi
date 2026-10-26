import { Alert } from 'react-native';

import type { DayView, Entry } from '@/lib/api/types';
import { addDays } from '@/lib/dates';
import { loadExportDay, loadFinalizedDays } from '@/lib/export/days';
import { getExportSettings } from '@/lib/export/settings';
import { shareDay, shareZip } from '@/lib/export/share';
import { vaultSupported, VaultError, writeDayToVault, type VaultWriteResult } from '@/lib/export/vault';
import { zipName } from '@/lib/export/zip';
import { haptics } from '@/lib/haptics';
import { shiftMonth } from '@/lib/history/calendar';

/**
 * Export flows as the screens run them: the dialogs around a vault write, sharing one day, and
 * sharing a month. Each one reports its own errors, so callers can fire and forget.
 */

function confirmReplace(name: string): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      `${name} changed in your vault`,
      'It was edited since JournalAI last saved it. Replacing it will lose those edits.',
      [
        { text: 'Keep vault version', style: 'cancel', onPress: () => resolve(false) },
        { text: 'Replace', style: 'destructive', onPress: () => resolve(true) },
      ],
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}

function reportError(title: string, err: unknown) {
  if (!(err instanceof VaultError)) console.warn(title, err);
  Alert.alert(title, err instanceof VaultError ? err.message : 'Please try again.');
}

/** Runs after a day is finalized; writes it to the vault if one is set and auto-export is on. */
export async function autoExportFinalized(day: DayView) {
  const settings = getExportSettings();
  if (!vaultSupported || !settings.vaultUri || !settings.autoExport) return;
  try {
    const exportDay = await loadExportDay(day.date, day.entry, day);
    if (exportDay) await writeDayToVault(exportDay, settings, confirmReplace);
  } catch (err) {
    reportError('Couldn’t save to your vault', err);
  }
}

type EntryText = Pick<Entry, 'title' | 'body' | 'tags'>;

/** Writes one day to the vault on request, and says how it went. */
export async function saveDayToVault(date: string, entry: EntryText, serverDay?: DayView) {
  let result: VaultWriteResult;
  try {
    const exportDay = await loadExportDay(date, entry, serverDay);
    if (!exportDay) return;
    result = await writeDayToVault(exportDay, getExportSettings(), confirmReplace);
  } catch (err) {
    reportError('Couldn’t save to your vault', err);
    return;
  }
  if (result.outcome === 'kept') return;
  haptics.success();
  Alert.alert(
    result.outcome === 'unchanged' ? 'Already up to date' : 'Saved to your vault',
    result.name,
  );
}

export async function shareDayEntry(date: string, entry: EntryText, serverDay?: DayView) {
  try {
    const exportDay = await loadExportDay(date, entry, serverDay);
    if (exportDay) await shareDay(exportDay, getExportSettings());
  } catch (err) {
    reportError('Couldn’t share this entry', err);
  }
}

/** Zips the finalized days of a `YYYY-MM` month and opens the share sheet. */
export async function shareMonth(month: string) {
  const from = `${month}-01`;
  const to = addDays(`${shiftMonth(month, 1)}-01`, -1);
  try {
    const list = await loadFinalizedDays(from, to);
    if (list.length === 0) {
      Alert.alert('Nothing to export', 'No days in this month are finalized yet.');
      return;
    }
    await shareZip(zipName(from, to), list, getExportSettings());
  } catch (err) {
    reportError('Couldn’t export this month', err);
  }
}

/** Whether "Save to vault" can be offered right now. */
export const canSaveToVault = () => vaultSupported && getExportSettings().vaultUri !== null;
