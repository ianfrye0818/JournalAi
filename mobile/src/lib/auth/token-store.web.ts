// expo-secure-store has no web implementation. Web is a dev convenience only, so localStorage is fine.
const TOKEN_KEY = 'journalai.auth-token';

export const tokenStore = {
  get: async () => globalThis.localStorage?.getItem(TOKEN_KEY) ?? null,
  set: async (token: string) => globalThis.localStorage?.setItem(TOKEN_KEY, token),
  clear: async () => globalThis.localStorage?.removeItem(TOKEN_KEY),
};
