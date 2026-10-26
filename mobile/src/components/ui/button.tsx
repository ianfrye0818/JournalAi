import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

export type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  loading?: boolean;
  fullWidth?: boolean;
};

const variantColors: Record<Variant, { bg: ThemeColor | null; pressed: ThemeColor; fg: ThemeColor }> = {
  primary: { bg: 'accent', pressed: 'accentPressed', fg: 'onAccent' },
  secondary: { bg: 'backgroundElement', pressed: 'backgroundSelected', fg: 'text' },
  ghost: { bg: null, pressed: 'backgroundElement', fg: 'accent' },
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  disabled,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const colors = variantColors[variant];
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        fullWidth && styles.fullWidth,
        {
          backgroundColor: pressed
            ? theme[colors.pressed]
            : colors.bg
              ? theme[colors.bg]
              : 'transparent',
        },
        isDisabled && styles.disabled,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={theme[colors.fg]} />
      ) : (
        <View style={styles.content}>
          {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} themeColor={colors.fg} />}
          <ThemedText type={size === 'lg' ? 'defaultSemiBold' : 'smallBold'} themeColor={colors.fg}>
            {title}
          </ThemedText>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  md: {
    minHeight: 40,
    paddingHorizontal: Spacing.three,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: Spacing.four,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  disabled: {
    opacity: 0.5,
  },
});
