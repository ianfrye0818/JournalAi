import { useState } from 'react';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Card, Icon, TextField, type IconName } from '@/components/ui';
import { Spacing } from '@/constants/theme';
import { useLocalDate } from '@/hooks/use-local-date';
import { useTheme } from '@/hooks/use-theme';
import { filenameFor, filenameTemplateError } from '@/lib/export/markdown';
import { setExportSetting, useExportSettings } from '@/lib/export/settings';
import { pickVaultFolder, vaultSupported } from '@/lib/export/vault';
import { describeVaultUri } from '@/lib/export/vault-plan';

function ToggleRow({
  icon,
  label,
  hint,
  value,
  disabled,
  onChange,
}: {
  icon: IconName;
  label: string;
  hint: string;
  value: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.row, disabled && styles.disabled]}>
      <Icon name={icon} size={20} themeColor="textSecondary" />
      <View style={styles.grow}>
        <ThemedText>{label}</ThemedText>
        <ThemedText type="small" themeColor="textTertiary">
          {hint}
        </ThemedText>
      </View>
      <Switch
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: theme.accent, false: theme.backgroundElement }}
        thumbColor={theme.surface}
        ios_backgroundColor={theme.backgroundElement}
      />
    </View>
  );
}

/** Settings → Obsidian export: vault folder, file names, and what goes into each note. */
export function ExportSettingsCard() {
  const theme = useTheme();
  const settings = useExportSettings();
  const today = useLocalDate();
  // Only while the field is being edited; otherwise it shows the saved template.
  const [draft, setDraft] = useState<string | null>(null);
  const [picking, setPicking] = useState(false);
  const template = draft ?? settings.filenameTemplate;
  const templateError = filenameTemplateError(template);

  const chooseFolder = async () => {
    setPicking(true);
    try {
      const uri = await pickVaultFolder(settings.vaultUri);
      if (uri) await setExportSetting('vaultUri', uri);
    } catch (err) {
      console.warn('Picking the vault folder failed', err);
      Alert.alert('Couldn’t open that folder', 'Please try again, or pick a different folder.');
    } finally {
      setPicking(false);
    }
  };

  // Leaving the field with an unusable name goes back to the saved one.
  const saveTemplate = () => {
    const trimmed = template.trim();
    if (!templateError && trimmed !== settings.filenameTemplate) {
      void setExportSetting('filenameTemplate', trimmed);
    }
    setDraft(null);
  };

  const divider = <View style={[styles.divider, { backgroundColor: theme.border }]} />;

  return (
    <Card>
      <ThemedText type="caption" themeColor="textSecondary">
        Obsidian export
      </ThemedText>

      {vaultSupported ? (
        <>
          <View style={styles.row}>
            <Icon name={{ ios: 'folder', android: 'folder', web: 'folder' }} size={20} themeColor="textSecondary" />
            <View style={styles.grow}>
              <ThemedText>Vault folder</ThemedText>
              <ThemedText type="small" themeColor="textTertiary" numberOfLines={2}>
                {settings.vaultUri ? describeVaultUri(settings.vaultUri) : 'Pick your daily notes folder'}
              </ThemedText>
            </View>
            <Button
              title={settings.vaultUri ? 'Change' : 'Choose'}
              variant="ghost"
              loading={picking}
              onPress={() => void chooseFolder()}
            />
          </View>
          {divider}
          <ToggleRow
            icon={{ ios: 'arrow.down.doc', android: 'sync_saved_locally', web: 'sync_saved_locally' }}
            label="Save on finalize"
            hint="Write each day into the vault as soon as it’s finalized"
            value={settings.autoExport}
            disabled={!settings.vaultUri}
            onChange={(v) => void setExportSetting('autoExport', v)}
          />
          {divider}
        </>
      ) : (
        <ThemedText type="small" themeColor="textTertiary">
          Saving straight into a vault folder works on Android. Here, use Export on a finalized day to
          share it, or export a month from Days.
        </ThemedText>
      )}

      <ToggleRow
        icon={{ ios: 'text.bubble', android: 'notes', web: 'notes' }}
        label="Include snippets"
        hint="Add the day’s snippets under the entry"
        value={settings.includeSnippets}
        onChange={(v) => void setExportSetting('includeSnippets', v)}
      />
      {divider}
      <TextField
        label="File name"
        value={template}
        onChangeText={setDraft}
        onEndEditing={saveTemplate}
        error={templateError ?? undefined}
        hint={`Uses YYYY, MM, DD. Today’s note: ${filenameFor(template, today)}`}
        autoCapitalize="none"
        autoCorrect={false}
        maxLength={100}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 44,
  },
  grow: {
    flex: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.five + Spacing.one,
  },
});
