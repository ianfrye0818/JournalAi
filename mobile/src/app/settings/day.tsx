import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Card, Screen, TextField } from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth/auth-context';
import { getRolloverHour } from '@/lib/settings';
export default function DaySettings() {
  const { user, updateProfile } = useAuth();
  const [hour, setHour] = useState(String(getRolloverHour()));
  const [timezone, setTimezone] = useState(
    user?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Screen
      title="Journal day"
      inTabs={false}
      headerRight={<Button title="Back" variant="ghost" onPress={() => router.back()} />}>
      <Card>
        <TextField
          label="New day starts at hour (0–23)"
          keyboardType="number-pad"
          value={hour}
          onChangeText={setHour}
        />
        <TextField
          label="Timezone"
          autoCapitalize="none"
          value={timezone}
          onChangeText={setTimezone}
        />
        <Button
          title="Use phone timezone"
          variant="secondary"
          onPress={() => setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone)}
        />
        <ThemedText>
          New captures use this rollover hour and the phone’s local calendar. Existing snippets keep
          their original day. Your timezone is also saved to your account.
        </ThemedText>
        <Button
          title="Save"
          loading={busy}
          onPress={async () => {
            setMessage('');
            if (!/^\d{1,2}$/.test(hour) || Number(hour) > 23) {
              setMessage('Choose an hour from 0 to 23.');
              return;
            }
            setBusy(true);
            try {
              await updateProfile({
                dayRolloverHour: Number(hour),
                timezone: timezone.trim(),
              });
              setMessage('Saved.');
            } catch (e) {
              setMessage((e as Error).message);
            } finally {
              setBusy(false);
            }
          }}
        />
        {!!message && <ThemedText>{message}</ThemedText>}
      </Card>
    </Screen>
  );
}
