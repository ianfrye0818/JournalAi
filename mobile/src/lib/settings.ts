import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';

import { db } from '@/lib/db/client';
import { kv } from '@/lib/db/schema';
import { DEFAULT_ROLLOVER_HOUR } from '@/lib/dates';

const ROLLOVER_HOUR_KEY = 'settings.rolloverHour';

function parseRolloverHour(value: string | undefined): number {
  const hour = value === undefined ? NaN : Number(JSON.parse(value));
  return Number.isInteger(hour) && hour >= 0 && hour <= 23 ? hour : DEFAULT_ROLLOVER_HOUR;
}

/** Synchronous so capture paths can stamp `localDate` without awaiting. */
export function getRolloverHour(): number {
  const row = db.select().from(kv).where(eq(kv.key, ROLLOVER_HOUR_KEY)).get();
  return parseRolloverHour(row?.value);
}

export function useRolloverHour(): number {
  const { data } = useLiveQuery(db.select().from(kv).where(eq(kv.key, ROLLOVER_HOUR_KEY)));
  return parseRolloverHour(data[0]?.value);
}

export async function setRolloverHour(hour: number) {
  const value = JSON.stringify(hour);
  await db.insert(kv).values({ key: ROLLOVER_HOUR_KEY, value }).onConflictDoUpdate({
    target: kv.key,
    set: { value },
  });
}
