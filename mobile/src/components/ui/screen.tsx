import { type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const WebTabListHeight = Spacing.six + Spacing.five;

export type ScreenProps = {
  children: ReactNode;
  /** Large serif heading at the top of the page. */
  title?: string;
  /** Small uppercase line above the title (e.g. today's date). */
  eyebrow?: string;
  /** Rendered to the right of the title. */
  headerRight?: ReactNode;
  /** Wrap content in a ScrollView. Defaults to true. */
  scroll?: boolean;
  /** Leave room for the bottom tab bar. Defaults to true. */
  inTabs?: boolean;
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  title,
  eyebrow,
  headerRight,
  scroll = true,
  inTabs = true,
  contentStyle,
}: ScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const padding: ViewStyle = {
    // On web the tab list floats over the top of the page instead of the bottom.
    paddingTop: Platform.OS === 'web' && inTabs ? WebTabListHeight : insets.top + Spacing.four,
    paddingBottom: insets.bottom + Spacing.five + (inTabs ? BottomTabInset : 0),
    paddingLeft: insets.left + Spacing.three,
    paddingRight: insets.right + Spacing.three,
  };

  const content = (
    <View style={[styles.content, contentStyle]}>
      {(title || eyebrow) && (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {eyebrow && (
              <ThemedText type="caption" themeColor="textSecondary">
                {eyebrow}
              </ThemedText>
            )}
            {title && (
              <ThemedText type="display" accessibilityRole="header">
                {title}
              </ThemedText>
            )}
          </View>
          {headerRight}
        </View>
      )}
      {children}
    </View>
  );

  if (!scroll) {
    return <View style={[styles.root, padding, { backgroundColor: theme.background }]}>{content}</View>;
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: theme.background }]}
      contentContainerStyle={[styles.scrollContent, padding]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      {content}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  headerText: {
    flex: 1,
    gap: Spacing.one,
  },
});
