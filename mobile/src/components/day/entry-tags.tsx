import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function EntryTags({ tags }: { tags: string[] }) {
  const theme = useTheme();
  if (tags.length === 0) return null;
  return (
    <View style={styles.tags} accessibilityLabel={`Tags: ${tags.join(', ')}`}>
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
