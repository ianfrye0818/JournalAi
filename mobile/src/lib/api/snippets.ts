import { api } from '@/lib/api/client';
import type {
  GetSnippetsSinceResponse,
  PullCursor,
  SnippetPayload,
  SyncSnippetsResponse,
} from '@/lib/api/types';

export const snippetsApi = {
  batch: (snippets: SnippetPayload[]) =>
    api<SyncSnippetsResponse>('/snippets/batch', { method: 'POST', body: { snippets } }),
  since: (cursor: PullCursor | null) => {
    const query = cursor
      ? `?since=${encodeURIComponent(cursor.since)}&afterId=${encodeURIComponent(cursor.afterId)}`
      : '';
    return api<GetSnippetsSinceResponse>(`/snippets${query}`);
  },
};
