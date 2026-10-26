import { router, useRootNavigationState } from 'expo-router';
import { useShareIntent } from 'expo-share-intent';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { shareToSnippetText } from '@/lib/share/share-text';

/**
 * Text or a link shared to JournalAI from another app opens Quick capture, prefilled, so the user
 * can add a line of context before saving. Waits for sign-in; a share made while signed out is
 * picked up once they sign in (unless the app goes to the background first).
 */
export function useShareCapture(status: string) {
  // Android only for now: the iOS share extension is disabled in app.json until there's an iOS build.
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntent({
    disabled: Platform.OS !== 'android',
  });
  const navigationReady = !!useRootNavigationState()?.key;

  useEffect(() => {
    if (!hasShareIntent || status !== 'signedIn' || !navigationReady) return;
    const text = shareToSnippetText(shareIntent);
    resetShareIntent();
    if (text) router.push({ pathname: '/capture', params: { text, source: 'share' } });
    // shareIntent changes together with hasShareIntent; resetShareIntent is recreated every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShareIntent, shareIntent, status, navigationReady]);
}
