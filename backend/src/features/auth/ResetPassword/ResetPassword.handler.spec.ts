import { verify } from '@node-rs/argon2';
import { validate } from 'class-validator';
import { PrismaService } from '@src/services/prisma.service';
import { RedisService } from '@src/services/redis.service';
import { TokenService } from '@src/services/token.service';
import { hashResetCode } from '../shared/password-reset';
import { makeUser } from '../shared/user.fixture';
import { ResetPasswordCommand } from './ResetPassword.command';
import {
  INVALID_RESET_CODE,
  ResetPasswordHandler,
  TOO_MANY_RESET_ATTEMPTS,
} from './ResetPassword.handler';
import { ResetPasswordRequest } from './ResetPassword.request';

describe('ResetPassword', () => {
  const user = makeUser();
  const findUnique = jest.fn();
  const update = jest.fn();
  const redis = {
    incr: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
  };
  const tokens = { revokeAll: jest.fn(), issue: jest.fn() };
  const handler = new ResetPasswordHandler(
    { user: { findUnique, update } } as unknown as PrismaService,
    { getClient: () => redis } as unknown as RedisService,
    tokens as unknown as TokenService,
  );
  const reset = (code = '123456') =>
    handler.execute(
      new ResetPasswordCommand({
        email: user.email,
        code,
        password: 'a new long password',
      }),
    );

  beforeEach(() => {
    jest.resetAllMocks();
    findUnique.mockResolvedValue({ id: user.id, isActive: true });
    update.mockResolvedValue(user);
    redis.incr.mockResolvedValue(1);
    redis.get.mockResolvedValue(hashResetCode('123456'));
    tokens.issue.mockResolvedValue('new-token');
  });

  it('sets the new password, spends the code, signs out everywhere and signs in', async () => {
    const result = await reset();
    const { data } = (
      update.mock.calls as [{ data: { passwordHash: string } }][]
    )[0][0];
    await expect(
      verify(data.passwordHash, 'a new long password'),
    ).resolves.toBe(true);
    expect(redis.del).toHaveBeenCalledWith(
      `auth:reset:${user.id}`,
      `auth:reset:${user.id}:attempts`,
    );
    expect(tokens.revokeAll.mock.invocationCallOrder[0]).toBeLessThan(
      tokens.issue.mock.invocationCallOrder[0],
    );
    expect(result.token).toBe('new-token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects wrong, expired and unknown-account codes the same way', async () => {
    await expect(reset('654321')).rejects.toThrow(INVALID_RESET_CODE);
    redis.get.mockResolvedValue(null);
    await expect(reset()).rejects.toThrow(INVALID_RESET_CODE);
    findUnique.mockResolvedValue(null);
    await expect(reset()).rejects.toThrow(INVALID_RESET_CODE);
    expect(update).not.toHaveBeenCalled();
  });

  it('counts attempts per account and locks after ten in an hour', async () => {
    await expect(reset('654321')).rejects.toThrow(INVALID_RESET_CODE);
    expect(redis.expire).toHaveBeenCalledWith(
      `auth:reset:${user.id}:attempts`,
      3600,
    );
    redis.incr.mockResolvedValue(11);
    // Even the right code is refused once locked.
    await expect(reset()).rejects.toThrow(TOO_MANY_RESET_ATTEMPTS);
    expect(update).not.toHaveBeenCalled();
  });

  it('validates the code shape and password length', async () => {
    const errors = async (data: Partial<ResetPasswordRequest>) =>
      (
        await validate(
          Object.assign(new ResetPasswordRequest(), {
            email: 'me@example.com',
            code: '123456',
            password: 'long enough pw',
            ...data,
          }),
        )
      ).length;
    expect(await errors({})).toBe(0);
    expect(await errors({ code: '12345' })).toBeGreaterThan(0);
    expect(await errors({ code: '12a456' })).toBeGreaterThan(0);
    expect(await errors({ password: 'short' })).toBeGreaterThan(0);
  });
});
