import type { ShareIntent } from 'expo-share-intent';

/**
 * The snippet text for something shared from another app. Links often arrive as bare URLs with the
 * page title in `meta`, so the title goes first when the text doesn't already include it.
 */
export function shareToSnippetText(intent: Pick<ShareIntent, 'text' | 'webUrl' | 'meta'>): string {
  const text = intent.text?.trim() ?? '';
  const url = intent.webUrl?.trim() ?? '';
  const title = intent.meta?.title?.trim() ?? '';
  const body = text || url;
  return [title && !body.includes(title) ? title : '', body].filter(Boolean).join('\n');
}
