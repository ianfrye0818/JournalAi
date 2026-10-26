import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Bottom action bar for the end-of-day screens, clear of the home indicator. It rides up with the
 * keyboard; pair it with a `KeyboardAwareScrollView` whose `bottomOffset` covers its height.
 */
/** Room to leave under scrolled-to inputs for a footer with one large button. */
export const FLOW_FOOTER_HEIGHT = 52 + Spacing.three * 2;

export function FlowFooter({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    // With the keyboard up, the home indicator padding is under the keyboard; drop it.
    <KeyboardStickyView offset={{ opened: insets.bottom }}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom + Spacing.three,
            paddingLeft: insets.left + Spacing.three,
            paddingRight: insets.right + Spacing.three,
          },
        ]}>
        <View style={styles.content}>{children}</View>
      </View>
    </KeyboardStickyView>
  );
}

const styles = StyleSheet.create({
  root: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    gap: Spacing.two,
  },
});
