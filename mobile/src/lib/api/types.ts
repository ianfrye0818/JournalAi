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

/** `DayStatus`: a day moves open → interviewing → drafted → finalized (reopen goes back to drafted). */
export type DayStatus = 'open' | 'interviewing' | 'drafted' | 'finalized';

/** `QuestionResponse` */
export type Question = {
  id: string;
  /** Interview round this question was asked in (1-based). */
  round: number;
  /** Position within its round. */
  order: number;
  text: string;
  /** Suggested answers to tap. */
  options: string[];
  rationale: string | null;
  answer: string | null;
  skipped: boolean;
  answeredAt: string | null;
};

/** `EntryResponse` */
export type Entry = {
  id: string;
  title: string | null;
  /** The user-edited entry, markdown. */
  body: string;
  /** What the AI originally wrote. */
  aiDraft: string;
  tags: string[];
  model: string | null;
  createdAt: string;
  updatedAt: string;
};

/** `GetDayResponse` (also returned by finalize and reopen) */
export type DayView = {
  /** Null until the first snippet for this day is synced. */
  id: string | null;
  date: string;
  status: DayStatus;
  /** Interview rounds completed so far. */
  interviewRound: number;
  finalizedAt: string | null;
  snippets: RemoteSnippet[];
  questions: Question[];
  entry: Entry | null;
};

/** `StartInterviewRoundResponse` */
export type InterviewRound = {
  round: number;
  questions: Question[];
  /** Nothing more to ask: no questions came back, or the last round was reached. */
  readyToDraft: boolean;
};

/** `ListDaysResponse` */
export type DaySummary = {
  date: string;
  status: DayStatus;
  snippetCount: number;
  entryTitle: string | null;
  /** When the entry last changed, if the day has one. */
  entryUpdatedAt: string | null;
};

/** `SearchEntriesResponse` (GET /entries): an entry plus the day it belongs to. */
export type EntryWithDate = Entry & { date: string };

/** Query of `SearchEntriesRequest`. `from`/`to` are inclusive `YYYY-MM-DD`. */
export type EntrySearchParams = { q?: string; from?: string; to?: string; limit?: number };

/** Body of `AnswerQuestionRequest`: exactly one of the two. */
export type AnswerPayload = { answer: string } | { skipped: true };

/** Body of `UpdateEntryRequest`; omitted fields are left as they are. */
export type EntryPatch = { title?: string; body?: string; tags?: string[] };
