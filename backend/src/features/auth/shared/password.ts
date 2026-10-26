import { hash, verify } from '@node-rs/argon2';

export const hashPassword = (password: string) => hash(password);

export const verifyPassword = (passwordHash: string, password: string) =>
  verify(passwordHash, password);

let dummyHash: Promise<string> | undefined;

/**
 * Runs a verify against a throwaway hash so a login for an unknown email takes
 * as long as one with a wrong password (no user enumeration by timing).
 */
export const burnPasswordVerify = async (password: string) => {
  dummyHash ??= hash('not-a-real-password');
  await verify(await dummyHash, password);
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
