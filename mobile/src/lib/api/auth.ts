import { api } from '@/lib/api/client';
import type { AuthTokenResponse, Credentials, PasswordReset, User } from '@/lib/api/types';

export const authApi = {
  register: (body: Credentials) => api<AuthTokenResponse>('/auth/register', { method: 'POST', body }),
  login: (body: Credentials) => api<AuthTokenResponse>('/auth/login', { method: 'POST', body }),
  logout: () => api<void>('/auth/logout', { method: 'POST' }),
  me: () => api<User>('/auth/me'),
  /** Always succeeds, whether or not the email has an account. */
  requestPasswordReset: (email: string) =>
    api<void>('/auth/password/forgot', { method: 'POST', body: { email } }),
  /** Signs out every device and returns a fresh session for this one. */
  resetPassword: (body: PasswordReset) =>
    api<AuthTokenResponse>('/auth/password/reset', { method: 'POST', body }),
};
