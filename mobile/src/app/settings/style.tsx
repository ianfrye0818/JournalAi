import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Card, Screen, TextField } from '@/components/ui';
import { ThemedText } from '@/components/themed-text';
import { api } from '@/lib/api/client';

type Profile = { samples: string; notes: string | null };
export default function WritingStyle() {
  const query = useQuery({
    queryKey: ['style-profile'],
    queryFn: () => api<Profile | null>('/style-profile'),
  });
  return (
    <Screen
      title="Writing style"
      inTabs={false}
      headerRight={<Button title="Back" variant="ghost" onPress={() => router.back()} />}>
      {query.isPending ? (
        <ThemedText>Loading…</ThemedText>
      ) : query.isError ? (
        <>
          <ThemedText>{query.error.message}</ThemedText>
          <Button title="Retry" onPress={() => query.refetch()} />
        </>
      ) : (
        <StyleForm profile={query.data} onSaved={() => query.refetch()} />
      )}
    </Screen>
  );
}
function StyleForm({ profile, onSaved }: { profile: Profile | null; onSaved: () => unknown }) {
  const [samples, setSamples] = useState(profile?.samples ?? '');
  const [notes, setNotes] = useState(profile?.notes ?? '');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  return (
    <Card>
      <ThemedText>
        Paste 1–3 past entries and describe how you like to write. These guide your next draft.
        Leave both empty to reset.
      </ThemedText>
      <TextField
        label="Past entries"
        multiline
        value={samples}
        onChangeText={setSamples}
        maxLength={50000}
      />
      <TextField
        label="Style notes"
        placeholder="First person, dry humor, no emojis"
        multiline
        value={notes}
        onChangeText={setNotes}
        maxLength={2000}
      />
      <Button
        title="Save style"
        loading={busy}
        onPress={async () => {
          setBusy(true);
          setMessage('');
          try {
            await api('/style-profile', {
              method: 'PUT',
              body: { samples, notes },
            });
            onSaved();
            setMessage('Saved. Your next draft will use this style.');
          } catch (e) {
            setMessage((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      />
      {!!message && <ThemedText>{message}</ThemedText>}
    </Card>
  );
}
