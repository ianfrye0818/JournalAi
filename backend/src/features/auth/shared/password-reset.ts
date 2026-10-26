import { createHash, randomInt, timingSafeEqual } from 'node:crypto';

export const RESET_CODE_TTL_SECONDS = 15 * 60;
/** Wrong guesses allowed per account per hour, across every code issued in that hour. */
export const MAX_RESET_ATTEMPTS = 10;
export const RESET_ATTEMPTS_WINDOW_SECONDS = 60 * 60;
/** A new code can be requested once a minute, so requests can't flood a user's inbox. */
export const RESET_COOLDOWN_SECONDS = 60;

export const resetCodeKey = (userId: string) => `auth:reset:${userId}`;
export const resetAttemptsKey = (userId: string) =>
  `auth:reset:${userId}:attempts`;
export const resetCooldownKey = (userId: string) =>
  `auth:reset:${userId}:cooldown`;

/** Six digits, so it is easy to type from an email on the same phone. */
export const generateResetCode = () =>
  randomInt(0, 1_000_000).toString().padStart(6, '0');

export const hashResetCode = (code: string) =>
  createHash('sha256').update(code).digest('hex');

export const resetCodeMatches = (storedHash: string, code: string) =>
  timingSafeEqual(
    Buffer.from(storedHash, 'hex'),
    Buffer.from(hashResetCode(code), 'hex'),
  );
