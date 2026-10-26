import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Card, Screen, TextField } from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/lib/auth/auth-context';
import { formatTime, parseTime } from '@/lib/time';
import { useTimeFormat, getRolloverHour } from '@/lib/settings';
export default function DaySettings() {
  const { user, updateProfile } = useAuth();
  const timeFormat = useTimeFormat();
  const [hour, setHour] = useState(() => formatTime(getRolloverHour(), 0, timeFormat));
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
          label={
            timeFormat === '12h' ? 'New day starts at (h:00 AM/PM)' : 'New day starts at (HH:00)'
          }
          autoCapitalize="characters"
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
            const canonical = parseTime(hour, timeFormat);
            if (!canonical || !canonical.endsWith(':00')) {
              setMessage(
                timeFormat === '12h'
                  ? 'Choose a whole hour, like 4:00 AM.'
                  : 'Choose a whole hour, like 04:00.',
              );
              return;
            }
            setBusy(true);
            try {
              await updateProfile({
                dayRolloverHour: Number(canonical.split(':')[0]),
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
