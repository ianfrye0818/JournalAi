import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from '@node-rs/argon2';
import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import { makeUser } from '../shared/user.fixture';
import { LoginCommand } from './Login.command';
import { INVALID_CREDENTIALS, LoginHandler } from './Login.handler';

describe(LoginHandler, () => {
  let handler: LoginHandler;
  let passwordHash: string;
  const prisma = { user: { findUnique: jest.fn() } };
  const tokenService = { issue: jest.fn() };

  const login = (password: string, email = 'Me@Example.com') =>
    handler.execute(new LoginCommand({ email, password }));

  // Resolves to the error thrown, so messages can be compared across cases.
  const loginError = (password: string, email?: string) =>
    login(password, email).then(
      () => {
        throw new Error('expected login to fail');
      },
      (error: unknown) => error,
    );

  beforeAll(async () => {
    passwordHash = await hash('correct horse battery');
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        LoginHandler,
        { provide: PrismaService, useValue: prisma },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    handler = moduleRef.get(LoginHandler);
  });

  it('issues a token for the right password', async () => {
    const user = makeUser({ passwordHash });
    prisma.user.findUnique.mockResolvedValue(user);
    tokenService.issue.mockResolvedValue('the-token');

    const result = await login('correct horse battery');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'me@example.com' },
    });
    expect(tokenService.issue).toHaveBeenCalledWith(user.id);
    expect(result.token).toBe('the-token');
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a bad password with 401', async () => {
    prisma.user.findUnique.mockResolvedValue(makeUser({ passwordHash }));

    const error = await loginError('wrong password!!');

    expect(error).toBeInstanceOf(UnauthorizedException);
    expect((error as Error).message).toBe(INVALID_CREDENTIALS);
    expect(tokenService.issue).not.toHaveBeenCalled();
  });

  it('gives an unknown email the same 401 as a bad password', async () => {
    prisma.user.findUnique.mockResolvedValue(makeUser({ passwordHash }));
    const badPassword = await loginError('wrong password!!');

    prisma.user.findUnique.mockResolvedValue(null);
    const unknownEmail = await loginError(
      'correct horse battery',
      'nobody@example.com',
    );

    expect(unknownEmail).toBeInstanceOf(UnauthorizedException);
    expect((unknownEmail as Error).message).toBe(
      (badPassword as Error).message,
    );
    expect(tokenService.issue).not.toHaveBeenCalled();
  });

  it('rejects an inactive user with the same 401', async () => {
    prisma.user.findUnique.mockResolvedValue(
      makeUser({ passwordHash, isActive: false }),
    );

    const error = await loginError('correct horse battery');

    expect(error).toBeInstanceOf(UnauthorizedException);
    expect((error as Error).message).toBe(INVALID_CREDENTIALS);
    expect(tokenService.issue).not.toHaveBeenCalled();
  });
});
