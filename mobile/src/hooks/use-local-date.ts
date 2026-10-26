import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { localDate } from '@/lib/dates';
import { useRolloverHour } from '@/lib/settings';

/** Today's journal day, kept current across the rollover hour and app resumes. */
export function useLocalDate(): string {
  const rolloverHour = useRolloverHour();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const interval = setInterval(tick, 60_000);
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') tick();
    });
    return () => {
      clearInterval(interval);
      sub.remove();
    };
  }, []);

  return localDate(now, rolloverHour);
}
