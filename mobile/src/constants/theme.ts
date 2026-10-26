/**
 * Design tokens for JournalAI. Light mode is warm paper, dark mode is ink, and both share one
 * terracotta accent. Read colors through `useTheme()`; everything else is imported directly.
 */

import { Platform, type TextStyle } from 'react-native';

export const Colors = {
  light: {
    text: '#1F1B16',
    textSecondary: '#6B6358',
    textTertiary: '#9A9184',
    background: '#F6F1E8',
    surface: '#FFFCF6',
    backgroundElement: '#EDE6DA',
    backgroundSelected: '#E2D9CA',
    border: '#E3DACB',
    accent: '#B8532E',
    accentPressed: '#9C4425',
    accentSoft: '#F3DFD3',
    onAccent: '#FFFCF6',
    danger: '#B3261E',
  },
  dark: {
    text: '#ECE6DC',
    textSecondary: '#A69E92',
    textTertiary: '#756E64',
    background: '#121417',
    surface: '#1A1D21',
    backgroundElement: '#23272C',
    backgroundSelected: '#2D3238',
    border: '#2A2E34',
    accent: '#E3825C',
    accentPressed: '#EE9A78',
    accentSoft: '#3A2620',
    onAccent: '#1A0E09',
    danger: '#F2B8B5',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Family names registered by `useAppFonts()`; weights are selected with `fontWeight`. */
export const Fonts = {
  sans: 'Inter',
  serif: 'Newsreader',
  mono: Platform.select({ ios: 'ui-monospace', default: 'monospace' }),
} as const;

export const Typography = {
  display: { fontFamily: Fonts.serif, fontSize: 34, lineHeight: 40, fontWeight: 500 },
  title: { fontFamily: Fonts.sans, fontSize: 24, lineHeight: 30, fontWeight: 600 },
  heading: { fontFamily: Fonts.sans, fontSize: 18, lineHeight: 24, fontWeight: 600 },
  default: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24, fontWeight: 400 },
  defaultSemiBold: { fontFamily: Fonts.sans, fontSize: 16, lineHeight: 24, fontWeight: 600 },
  small: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20, fontWeight: 400 },
  smallBold: { fontFamily: Fonts.sans, fontSize: 14, lineHeight: 20, fontWeight: 600 },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 500,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  entry: { fontFamily: Fonts.serif, fontSize: 18, lineHeight: 28, fontWeight: 400 },
  code: { fontFamily: Fonts.mono, fontSize: 13, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof Typography;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 640;
