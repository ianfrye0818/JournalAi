import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function EntryTags({ tags, mood }: { tags: string[]; mood?: string | null }) {
  const theme = useTheme();
  if (tags.length === 0 && !mood) return null;
  const label = [mood && `Mood: ${mood}`, tags.length > 0 && `Tags: ${tags.join(', ')}`]
    .filter(Boolean)
    .join('. ');
  return (
    <View style={styles.tags} accessible accessibilityLabel={label}>
      {!!mood && (
        <View style={[styles.tag, { backgroundColor: theme.accentSoft }]}>
          <ThemedText type="small" themeColor="accent">
            {mood}
          </ThemedText>
        </View>
      )}
      {tags.map((tag) => (
        <View key={tag} style={[styles.tag, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText type="small" themeColor="textSecondary">
            #{tag}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  tag: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.two + Spacing.one,
    paddingVertical: Spacing.one,
  },
});
