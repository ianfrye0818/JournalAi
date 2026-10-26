import { Pressable, StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CardProps = ViewProps & {
  /** `surface` sits above the page; `sunken` is a quieter inset block. */
  variant?: 'surface' | 'sunken';
  onPress?: () => void;
  onLongPress?: () => void;
};

export function Card({
  variant = 'surface',
  onPress,
  onLongPress,
  style,
  children,
  ...rest
}: CardProps) {
  const theme = useTheme();
  const cardStyle = [
    styles.base,
    variant === 'surface'
      ? { backgroundColor: theme.surface, borderColor: theme.border }
      : { backgroundColor: theme.backgroundElement, borderColor: 'transparent' },
    style,
  ];

  if (onPress || onLongPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
        {...rest}>
        {children}
      </Pressable>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  pressed: {
    opacity: 0.8,
  },
});
