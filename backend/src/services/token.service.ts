import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'node:crypto';
import { RedisService } from './redis.service';

const TOKEN_TTL_SECONDS = 90 * 24 * 60 * 60; // 90 days
const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000; // slide the TTL at most once a day

const tokenKey = (hash: string) => `auth:token:${hash}`;
const userKey = (userId: string) => `auth:user:${userId}`;

interface TokenRecord {
  userId: string;
  refreshedAt: number;
}

/**
 * Opaque bearer tokens. The raw token is only ever returned to the client;
 * Redis stores sha256(token) -> userId, plus a per-user set of hashes so all
 * of a user's tokens can be revoked at once.
 */
@Injectable()
export class TokenService {
  constructor(private readonly redis: RedisService) {}

  /**
   * Issues a new token for the user.
   * @param userId - The user the token authenticates
   * @returns The raw token (random 32 bytes, base64url)
   */
  async issue(userId: string): Promise<string> {
    const token = randomBytes(32).toString('base64url');
    const hash = this.hash(token);
    const record: TokenRecord = { userId, refreshedAt: Date.now() };

    await this.redis
      .getClient()
      .multi()
      .set(tokenKey(hash), JSON.stringify(record), 'EX', TOKEN_TTL_SECONDS)
      .sadd(userKey(userId), hash)
      .expire(userKey(userId), TOKEN_TTL_SECONDS)
      .exec();

    return token;
  }

  /**
   * Resolves a raw token to its userId, sliding the expiry if it was last
   * refreshed more than a day ago.
   * @param token - The raw bearer token
   * @returns The userId, or null if the token is unknown or expired
   */
  async resolve(token: string): Promise<string | null> {
    const hash = this.hash(token);
    const record = await this.redis.get<TokenRecord>(tokenKey(hash));
    if (!record) return null;

    if (Date.now() - record.refreshedAt > REFRESH_INTERVAL_MS) {
      const refreshed: TokenRecord = { ...record, refreshedAt: Date.now() };
      await this.redis
        .getClient()
        .multi()
        .set(tokenKey(hash), JSON.stringify(refreshed), 'EX', TOKEN_TTL_SECONDS)
        .expire(userKey(record.userId), TOKEN_TTL_SECONDS)
        .exec();
    }

    return record.userId;
  }

  /**
   * Revokes a single token. Unknown tokens are ignored.
   * @param token - The raw bearer token
   */
  async revoke(token: string): Promise<void> {
    const hash = this.hash(token);
    const record = await this.redis.get<TokenRecord>(tokenKey(hash));
    const tx = this.redis.getClient().multi().del(tokenKey(hash));
    if (record) tx.srem(userKey(record.userId), hash);
    await tx.exec();
  }

  /**
   * Revokes every token issued to the user.
   * @param userId - The user whose tokens are revoked
   */
  async revokeAll(userId: string): Promise<void> {
    const client = this.redis.getClient();
    const hashes = await client.smembers(userKey(userId));
    const tx = client.multi();
    if (hashes.length > 0) tx.del(...hashes.map(tokenKey));
    await tx.del(userKey(userId)).exec();
  }

  private hash(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
