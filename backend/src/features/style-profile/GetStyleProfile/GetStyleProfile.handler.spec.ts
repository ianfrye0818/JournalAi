import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { GetStyleProfileHandler } from './GetStyleProfile.handler';
import { GetStyleProfileQuery } from './GetStyleProfile.query';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

describe(GetStyleProfileHandler, () => {
  let handler: GetStyleProfileHandler;
  const prisma = { styleProfile: { findUnique: jest.fn() } };

  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetStyleProfileHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(GetStyleProfileHandler);
  });

  it("returns the user's profile", async () => {
    const updatedAt = new Date();
    prisma.styleProfile.findUnique.mockResolvedValue({
      id: 'sp-1',
      samples: 'Sample',
      notes: 'dry',
      updatedAt,
      userId: USER,
    });

    await expect(
      handler.execute(new GetStyleProfileQuery(USER)),
    ).resolves.toEqual({ samples: 'Sample', notes: 'dry', updatedAt });
    expect(prisma.styleProfile.findUnique).toHaveBeenCalledWith({
      where: { userId: USER },
    });
  });

  it('returns an empty profile when none is saved', async () => {
    prisma.styleProfile.findUnique.mockResolvedValue(null);

    await expect(
      handler.execute(new GetStyleProfileQuery(USER)),
    ).resolves.toEqual({ samples: '', notes: null, updatedAt: null });
  });
});
