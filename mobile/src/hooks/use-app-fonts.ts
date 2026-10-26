import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Newsreader_400Regular } from '@expo-google-fonts/newsreader/400Regular';
import { Newsreader_400Regular_Italic } from '@expo-google-fonts/newsreader/400Regular_Italic';
import { Newsreader_500Medium } from '@expo-google-fonts/newsreader/500Medium';
import { Newsreader_600SemiBold } from '@expo-google-fonts/newsreader/600SemiBold';
import { useFonts } from 'expo-font';

import { Fonts } from '@/constants/theme';

/**
 * Loads each typeface as a single family so styles can pick faces with `fontWeight`/`fontStyle`
 * instead of per-weight family names.
 */
export function useAppFonts() {
  return useFonts([
    {
      fontFamily: Fonts.sans,
      fontDefinitions: [
        { path: Inter_400Regular, weight: 400 },
        { path: Inter_500Medium, weight: 500 },
        { path: Inter_600SemiBold, weight: 600 },
        { path: Inter_700Bold, weight: 700 },
      ],
    },
    {
      fontFamily: Fonts.serif,
      fontDefinitions: [
        { path: Newsreader_400Regular, weight: 400 },
        { path: Newsreader_400Regular_Italic, weight: 400, style: 'italic' },
        { path: Newsreader_500Medium, weight: 500 },
        { path: Newsreader_600SemiBold, weight: 600 },
      ],
    },
  ]);
}
