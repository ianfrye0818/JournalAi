import { useTimeFormat } from '@/lib/settings';
import { formatStoredTime, parseTime } from '@/lib/time';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Card, Screen, TextField } from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { getReminderTime, saveReminder } from '@/lib/reminders';
export default function ReminderSettings() {
  const timeFormat = useTimeFormat();
  const [time, setTime] = useState(() => formatStoredTime('20:00', timeFormat));
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    getReminderTime()
      .then((value) => {
        if (value) setTime(formatStoredTime(value, timeFormat));
        setMessage(value ? `Enabled at ${formatStoredTime(value, timeFormat)}` : 'Reminder off');
        setReady(true);
      })
      .catch((e) => setMessage(e.message));
  }, [timeFormat]);
  const save = async (value: string) => {
    const canonical = value ? parseTime(value, timeFormat) : '';
    if (canonical === null) {
      setMessage(timeFormat === '12h' ? 'Enter a time like 6:00 PM.' : 'Enter a time like 18:00.');
      return;
    }
    setBusy(true);
    try {
      await saveReminder(canonical);
      setMessage(
        value ? `Reminder enabled at ${formatStoredTime(canonical, timeFormat)}` : 'Reminder off',
      );
    } catch (e) {
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen
      title="Evening reminder"
      inTabs={false}
      headerRight={<Button title="Back" variant="ghost" onPress={() => router.back()} />}>
      <Card>
        <TextField
          label={timeFormat === '12h' ? 'Time (h:mm AM/PM)' : 'Time (HH:MM)'}
          autoCapitalize="characters"
          value={time}
          onChangeText={setTime}
          maxLength={timeFormat === '12h' ? 8 : 5}
        />
        <ThemedText>
          A daily reminder on this phone, using its local time. Delivery may be delayed by battery
          settings.
        </ThemedText>
        <Button
          title="Enable reminder"
          disabled={!ready}
          loading={busy}
          onPress={() => save(time)}
        />
        <Button
          title="Turn off"
          disabled={!ready || busy}
          variant="secondary"
          onPress={() => save('')}
        />
        {!!message && <ThemedText>{message}</ThemedText>}
      </Card>
    </Screen>
  );
}
