import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type IconName = SymbolViewProps['name'];

export type IconProps = {
  name: IconName;
  size?: number;
  themeColor?: ThemeColor;
};

export function Icon({ name, size = 20, themeColor = 'text' }: IconProps) {
  const theme = useTheme();

  return <SymbolView name={name} size={size} tintColor={theme[themeColor]} />;
}
