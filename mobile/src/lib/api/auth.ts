import { api } from '@/lib/api/client';
import type { AuthTokenResponse, Credentials, User } from '@/lib/api/types';

export const authApi = {
  register: (body: Credentials) => api<AuthTokenResponse>('/auth/register', { method: 'POST', body }),
  login: (body: Credentials) => api<AuthTokenResponse>('/auth/login', { method: 'POST', body }),
  logout: () => api<void>('/auth/logout', { method: 'POST' }),
  me: () => api<User>('/auth/me'),
};
