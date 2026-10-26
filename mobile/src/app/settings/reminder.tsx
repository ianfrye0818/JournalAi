import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, Card, Screen, TextField } from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { getReminderTime, saveReminder } from '@/lib/reminders';
export default function ReminderSettings() {
  const [time, setTime] = useState('20:00');
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  useEffect(() => {
    getReminderTime()
      .then((value) => {
        if (value) setTime(value);
        setMessage(value ? `Enabled at ${value}` : 'Reminder off');
        setReady(true);
      })
      .catch((e) => setMessage(e.message));
  }, []);
  const save = async (value: string) => {
    setBusy(true);
    try {
      await saveReminder(value);
      setMessage(value ? `Reminder enabled at ${value}` : 'Reminder off');
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
          label="Time (HH:MM, 24-hour)"
          value={time}
          onChangeText={setTime}
          maxLength={5}
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
