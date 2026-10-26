import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Variant = 'plain' | 'tonal' | 'filled';

export type IconButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  icon: IconName;
  /** Required: icon-only controls have no visible label for screen readers. */
  accessibilityLabel: string;
  variant?: Variant;
  size?: number;
};

const variantColors: Record<Variant, { bg: ThemeColor | null; pressed: ThemeColor; fg: ThemeColor }> = {
  plain: { bg: null, pressed: 'backgroundElement', fg: 'text' },
  tonal: { bg: 'backgroundElement', pressed: 'backgroundSelected', fg: 'text' },
  filled: { bg: 'accent', pressed: 'accentPressed', fg: 'onAccent' },
};

export function IconButton({ icon, variant = 'plain', size = 44, disabled, ...rest }: IconButtonProps) {
  const theme = useTheme();
  const colors = variantColors[variant];

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={size < 44 ? (44 - size) / 2 : undefined}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          backgroundColor: pressed
            ? theme[colors.pressed]
            : colors.bg
              ? theme[colors.bg]
              : 'transparent',
        },
        disabled && styles.disabled,
      ]}
      {...rest}>
      <Icon name={icon} size={Math.round(size * 0.5)} themeColor={colors.fg} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
});
