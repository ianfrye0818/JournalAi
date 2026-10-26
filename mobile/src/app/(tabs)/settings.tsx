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
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
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
          icon={{ ios: 'person.crop.circle', android: 'account_circle', web: 'account_circle' }}
          label="Signed in as"
          value={user?.email ?? '…'}
        />
        <Button
          title="Sign out"
          variant="secondary"
          icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
          loading={signingOut}
          onPress={confirmSignOut}
        />
      </Card>

      <Card>
        <ThemedText type="caption" themeColor="textSecondary">
          Journal
        </ThemedText>
        <SettingRow
          icon={{ ios: 'moon.stars', android: 'wb_twilight', web: 'wb_twilight' }}
          label="New day starts at"
          value="4:00 AM"
        />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SettingRow
          icon={{ ios: 'textformat', android: 'edit_note', web: 'edit_note' }}
          label="Writing style"
          value="Not set"
        />
      </Card>

      <ExportSettingsCard />

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
