import { useQueryClient } from '@tanstack/react-query';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { authApi } from '@/lib/api/auth';
import { setAuthToken, setUnauthorizedHandler } from '@/lib/api/client';
import type { Credentials, User } from '@/lib/api/types';
import { tokenStore } from '@/lib/auth/token-store';

type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

type AuthContextValue = {
  status: AuthStatus;
  /** Null while signed out, and briefly after a cold start until `/auth/me` answers (or while offline). */
  user: User | null;
  signIn: (credentials: Credentials) => Promise<void>;
  signUp: (credentials: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  // Clears everything this device knows about the account. `revoke` also kills the token server side.
  const clearSession = async ({ revoke }: { revoke: boolean }) => {
    // `api` reads the token synchronously, so logout still carries it even though we null it next.
    if (revoke) authApi.logout().catch(() => {});
    setAuthToken(null);
    setUser(null);
    setStatus('signedOut');
    queryClient.clear();
    // Task 07: flush the snippet outbox, then wipe local rows with clearLocalData() from
    // @/lib/db/client. Until sync exists, wiping here would destroy unsynced snippets.
    await tokenStore.clear().catch(() => {});
  };

  const startSession = async (token: string, nextUser: User) => {
    await tokenStore.set(token);
    setAuthToken(token);
    setUser(nextUser);
    setStatus('signedIn');
  };

  useEffect(() => {
    setUnauthorizedHandler(() => void clearSession({ revoke: false }));

    let cancelled = false;
    (async () => {
      const token = await tokenStore.get().catch(() => null);
      if (cancelled) return;
      if (!token) {
        setStatus('signedOut');
        return;
      }
      // Trust the stored token so the app opens offline; a 401 from /me signs out via the handler.
      setAuthToken(token);
      setStatus('signedIn');
      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        // Offline or server down: stay signed in with no profile yet.
      }
    })();

    return () => {
      cancelled = true;
      setUnauthorizedHandler(null);
    };
    // Runs once on mount; clearSession only touches stable setters and the query client.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: AuthContextValue = {
    status,
    user,
    signIn: async (credentials) => {
      const res = await authApi.login(credentials);
      await startSession(res.token, res.user);
    },
    signUp: async (credentials) => {
      const res = await authApi.register(credentials);
      await startSession(res.token, res.user);
    },
    signOut: () => clearSession({ revoke: true }),
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
