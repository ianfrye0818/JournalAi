import { useQueryClient } from '@tanstack/react-query';
import { createContext, use, useEffect, useState, type ReactNode } from 'react';

import { authApi } from '@/lib/api/auth';
import { setAuthToken, setUnauthorizedHandler } from '@/lib/api/client';
import type { Credentials, User } from '@/lib/api/types';
import { tokenStore } from '@/lib/auth/token-store';
import { clearLocalData } from '@/lib/db/client';
import { getSyncOwner, setSyncOwner, syncEngine } from '@/lib/sync';

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
    // A deliberate sign-out pushes the outbox first. After a 401 the token is already dead.
    const flushed = revoke ? await syncEngine.flush() : false;
    syncEngine.stop();
    // `api` reads the token synchronously, so logout still carries it even though we null it next.
    if (revoke) authApi.logout().catch(() => {});
    setAuthToken(null);
    setUser(null);
    setStatus('signedOut');
    queryClient.clear();
    // Only wipe once the server has everything. Otherwise unsynced snippets stay on the device for
    // this account; signing in as someone else wipes them first (see startSession).
    if (flushed) await clearLocalData().catch(() => {});
    await tokenStore.clear().catch(() => {});
  };

  const startSession = async (token: string, nextUser: User) => {
    // Never push one account's leftover snippets into another account.
    const owner = await getSyncOwner();
    if (owner && owner !== nextUser.id) await clearLocalData();
    await setSyncOwner(nextUser.id);
    await tokenStore.set(token);
    setAuthToken(token);
    setUser(nextUser);
    setStatus('signedIn');
    // Pulls everything after the cursor; on a fresh install that restores every snippet.
    syncEngine.start();
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
      syncEngine.start();
      try {
        const me = await authApi.me();
        if (cancelled) return;
        setUser(me);
        // Installs signed in before sync existed have no owner yet.
        if (!(await getSyncOwner())) await setSyncOwner(me.id);
      } catch {
        // Offline or server down: stay signed in with no profile yet.
      }
    })();

    return () => {
      cancelled = true;
      setUnauthorizedHandler(null);
      syncEngine.stop();
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
