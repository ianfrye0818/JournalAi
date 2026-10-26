import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { makeUser } from '../shared/user.fixture';
import { GetMeHandler } from './GetMe.handler';
import { GetMeQuery } from './GetMe.query';

describe(GetMeHandler, () => {
  let handler: GetMeHandler;
  const prisma = { user: { findUnique: jest.fn() } };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [GetMeHandler, { provide: PrismaService, useValue: prisma }],
    }).compile();

    handler = moduleRef.get(GetMeHandler);
  });

  it('returns the current user without the password hash', async () => {
    const user = makeUser();
    prisma.user.findUnique.mockResolvedValue(user);

    const result = await handler.execute(new GetMeQuery(user.id));

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: user.id },
    });
    expect(result.email).toBe(user.email);
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('throws 404 when the user no longer exists', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(handler.execute(new GetMeQuery('missing'))).rejects.toThrow(
      NotFoundException,
    );
  });
});
