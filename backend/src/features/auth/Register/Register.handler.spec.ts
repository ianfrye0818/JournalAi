import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { verify } from '@node-rs/argon2';
import { Prisma } from '@prisma/generated';
import { PrismaService } from '@src/services/prisma.service';
import { TokenService } from '@src/services/token.service';
import { makeUser } from '../shared/user.fixture';
import { RegisterCommand } from './Register.command';
import { RegisterHandler } from './Register.handler';

describe(RegisterHandler, () => {
  let handler: RegisterHandler;
  const prisma = {
    user: { findUnique: jest.fn(), create: jest.fn() },
  };
  const tokenService = { issue: jest.fn() };

  const command = new RegisterCommand({
    email: '  Me@Example.com ',
    password: 'correct horse battery',
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegisterHandler,
        { provide: PrismaService, useValue: prisma },
        { provide: TokenService, useValue: tokenService },
      ],
    }).compile();

    handler = moduleRef.get(RegisterHandler);
  });

  it('creates the user with a normalized email and hashed password', async () => {
    const user = makeUser();
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(user);
    tokenService.issue.mockResolvedValue('the-token');

    const result = await handler.execute(command);

    const [{ data }] = prisma.user.create.mock.calls[0] as [
      { data: Prisma.UserCreateInput },
    ];
    expect(data.email).toBe('me@example.com');
    expect(data.passwordHash).not.toBe('correct horse battery');
    await expect(
      verify(data.passwordHash, 'correct horse battery'),
    ).resolves.toBe(true);
    expect(tokenService.issue).toHaveBeenCalledWith(user.id);
    expect(result).toEqual({
      token: 'the-token',
      user: {
        id: user.id,
        email: user.email,
        timezone: user.timezone,
        dayRolloverHour: user.dayRolloverHour,
        createdAt: user.createdAt,
      },
    });
    expect(result.user).not.toHaveProperty('passwordHash');
  });

  it('rejects a duplicate email with 409', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: makeUser().id });

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(tokenService.issue).not.toHaveBeenCalled();
  });

  it('maps a unique-constraint race to 409', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(handler.execute(command)).rejects.toThrow(ConflictException);
    expect(tokenService.issue).not.toHaveBeenCalled();
  });
});
