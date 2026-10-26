import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { router } from 'expo-router';
import { useRolloverHour } from '@/lib/settings';
import Constants from 'expo-constants';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ExportSettingsCard } from '@/components/settings/export-settings';
import { ThemedText } from '@/components/themed-text';
import { Button, Card, Icon, Screen, type IconName } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/lib/auth/auth-context';
import { usePendingSnippetCount } from '@/lib/sync';

function SettingRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Icon name={icon} size={20} themeColor="textSecondary" />
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText themeColor="textSecondary">{value}</ThemedText>
    </View>
  );
}

export default function SettingsScreen() {
  const theme = useTheme();
  const { user, signOut, deleteAccount } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const style = useQuery({
    queryKey: ['style-profile'],
    queryFn: () => api<{ samples: string; notes: string | null } | null>('/style-profile'),
  });
  const hour = useRolloverHour();
  const [deleting, setDeleting] = useState(false);
  const pending = usePendingSnippetCount();

  const confirmSignOut = () => {
    const doSignOut = () => {
      setSigningOut(true);
      signOut();
    };
    if (pending === 0) return doSignOut();
    const noun = pending === 1 ? '1 snippet hasn’t' : `${pending} snippets haven’t`;
    Alert.alert(
      `${noun} synced yet`,
      'We’ll try to upload them first. If that fails, they stay on this phone until you sign back in to this account.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign out', style: 'destructive', onPress: doSignOut },
      ],
    );
  };

  return (
    <Screen title="Settings">
      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Account
        </ThemedText>
        <SettingRow
          icon={{
            ios: 'person.crop.circle',
            android: 'account_circle',
            web: 'account_circle',
          }}
          label="Signed in as"
          value={user?.email ?? '…'}
        />
        <Button
          title="Sign out"
          variant="secondary"
          icon={{
            ios: 'rectangle.portrait.and.arrow.right',
            android: 'logout',
            web: 'logout',
          }}
          loading={signingOut}
          onPress={confirmSignOut}
        />
      </Card>

      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Journal
        </ThemedText>
        <SettingRow
          icon={{
            ios: 'moon.stars',
            android: 'wb_twilight',
            web: 'wb_twilight',
          }}
          label="New day starts at"
          value={`${String(hour).padStart(2, '0')}:00`}
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'textformat', android: 'edit_note', web: 'edit_note' }}
          label="Writing style"
          value={
            style.isPending
              ? '…'
              : style.isError
                ? 'Unavailable'
                : style.data?.samples || style.data?.notes
                  ? 'Personalized'
                  : 'Not set'
          }
        />
      </Card>

      <Card>
        <Button
          title="Writing style"
          variant="secondary"
          onPress={() => router.push('/settings/style')}
        />
        <Button
          title="Day rollover & timezone"
          variant="secondary"
          onPress={() => router.push('/settings/day')}
        />
        <Button
          title="Evening reminder"
          variant="secondary"
          onPress={() => router.push('/settings/reminder')}
        />
      </Card>
      <ExportSettingsCard />
      <Button
        title="Delete account"
        variant="secondary"
        loading={deleting}
        onPress={() =>
          Alert.alert(
            'Permanently delete account?',
            'This removes all journal data from the server and this phone, including unsynced snippets. Exported files remain in your vault. This cannot be undone.',
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Delete account',
                style: 'destructive',
                onPress: async () => {
                  setDeleting(true);
                  try {
                    await deleteAccount();
                  } catch (e) {
                    Alert.alert('Could not delete account', (e as Error).message);
                    setDeleting(false);
                  }
                },
              },
            ],
          )
        }
      />

      <ThemedText type="small" themeColor="textTertiary" style={styles.version}>
        JournalAI {Constants.expoConfig?.version}
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 44,
  },
  rowLabel: {
    flex: 1,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.five + Spacing.one,
  },
  version: {
    textAlign: 'center',
  },
});
