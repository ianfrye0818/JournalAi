import type { ApiErrorBody } from '@/lib/api/types';

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

if (!BASE_URL) {
  console.warn('EXPO_PUBLIC_API_URL is not set; API requests will fail. See mobile/.env.example.');
}

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never got a response (offline, DNS, timeout). */
  readonly status: number;
  /** Every message from the server; validation errors can have several. */
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages[0] ?? `Request failed (${status})`);
    this.name = 'ApiError';
    this.status = status;
    this.messages = messages;
  }

  get isNetworkError() {
    return this.status === 0;
  }
}

// The auth context owns these; the client only reads them so it works outside React too (e.g. sync).
let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

export async function api<T>(path: string, { method = 'GET', body, signal }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  // Snapshot the token so a 401 only signs out the session that made the request.
  const token = authToken;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(0, ["Can't reach the server. Check your connection and try again."]);
  }

  if (!res.ok) {
    // A 401 on an authenticated request means the token was revoked or expired.
    if (res.status === 401 && token && token === authToken) onUnauthorized?.();
    throw new ApiError(res.status, await readErrorMessages(res));
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function readErrorMessages(res: Response): Promise<string[]> {
  try {
    const body = (await res.json()) as Partial<ApiErrorBody>;
    if (Array.isArray(body.message)) return body.message;
    if (body.message) return [body.message];
  } catch {
    // Non-JSON error (proxy page, empty body); fall through.
  }
  if (res.status === 429) return ['Too many attempts. Wait a minute and try again.'];
  return [`Request failed (${res.status})`];
}
