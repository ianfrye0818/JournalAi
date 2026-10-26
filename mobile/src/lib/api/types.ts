/**
 * Hand-written mirrors of the backend response classes (`backend/src/features/**\/*.response.ts`).
 * Dates arrive as ISO strings over JSON. Keep in sync until codegen lands (see plans backlog).
 */

/** `UserResponse` / `GetMeResponse` */
export type User = {
  id: string;
  email: string;
  timezone: string;
  /** Local hour a new day starts. */
  dayRolloverHour: number;
  createdAt: string;
};

/** `AuthTokenResponse` (returned by register and login) */
export type AuthTokenResponse = {
  /** Opaque bearer token. */
  token: string;
  user: User;
};

/** Body of `RegisterRequest` and `LoginRequest`. */
export type Credentials = {
  email: string;
  password: string;
};

/** NestJS default error body. Validation errors put one message per failed constraint in an array. */
export type ApiErrorBody = {
  statusCode: number;
  message: string | string[];
  error?: string;
};

/** One item of `SyncSnippetsRequest` (POST /snippets/batch). */
export type SnippetPayload = {
  clientId: string;
  text: string;
  source: 'text' | 'voice' | 'share';
  capturedAt: string;
  localDate: string;
  /** Device clock of the last edit; the server keeps the newest. */
  updatedAt: string;
  deletedAt: string | null;
};

/** `SyncSnippetResult.status`. Every status means the server has seen this version. */
export type SnippetSyncStatus = 'created' | 'updated' | 'unchanged' | 'stale';

/** `SyncSnippetsResponse` */
export type SyncSnippetsResponse = {
  results: { clientId: string; id: string; status: SnippetSyncStatus }[];
};

/** `SnippetResponse` */
export type RemoteSnippet = Omit<SnippetPayload, 'deletedAt'> & {
  id: string;
  deletedAt: string | null;
  /** Server clock of the last change; the pull cursor. */
  serverUpdatedAt: string;
};

/** `GetSnippetsSinceResponse` (GET /snippets) */
export type GetSnippetsSinceResponse = {
  snippets: RemoteSnippet[];
  hasMore: boolean;
};

/** Where the last pull stopped: the last snippet's `serverUpdatedAt` and `id`. */
export type PullCursor = { since: string; afterId: string };
