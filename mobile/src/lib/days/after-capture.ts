import type { QueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { Alert } from 'react-native';

import { daysApi } from '@/lib/api/days';
import type { DayView } from '@/lib/api/types';
import { db } from '@/lib/db/client';
import { days } from '@/lib/db/schema';
import { dayKeys } from '@/lib/days/queries';
import { historyCache } from '@/lib/history/cache';
import { syncEngine } from '@/lib/sync';

/** Called only after local capture succeeds. Failure here must never imply the snippet was lost. */
export async function afterCapture(
  client: QueryClient,
  date: string,
  { onKeep, onReopened }: { onKeep: () => void; onReopened: () => void },
) {
  let status = client.getQueryData<DayView>(dayKeys.detail(date))?.status;
  try {
    status ??= db.select().from(days).where(eq(days.localDate, date)).get()?.status;
  } catch {
    // Capture stays available even when this device has no cached day status.
  }
  if (status !== 'finalized') {
    onKeep();
    return;
  }

  Alert.alert(
    'Snippet saved. This day is finalized.',
    'Reopen it to update your entry with this moment. Your existing entry will be preserved; you can edit or regenerate it.',
    [
      { text: 'Keep finalized', style: 'cancel', onPress: onKeep },
      {
        text: 'Reopen day',
        onPress: async () => {
          try {
            if (!(await syncEngine.flush()))
              throw new Error('Check your connection and try reopening the day from its entry.');
            const day = await daysApi.reopen(date);
            client.setQueryData(dayKeys.detail(date), day);
            await historyCache.saveDay(day).catch(() => {});
            void client.invalidateQueries({ queryKey: dayKeys.list() });
            onReopened();
          } catch (error) {
            Alert.alert(
              'Snippet saved, but could not reopen day',
              (error as Error).message,
              [{ text: 'OK', onPress: onKeep }],
              { cancelable: false },
            );
          }
        },
      },
    ],
    { cancelable: false },
  );
}
