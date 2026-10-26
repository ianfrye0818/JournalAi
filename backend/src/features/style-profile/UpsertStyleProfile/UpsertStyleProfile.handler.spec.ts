import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { UpsertStyleProfileCommand } from './UpsertStyleProfile.command';
import { UpsertStyleProfileHandler } from './UpsertStyleProfile.handler';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';

describe(UpsertStyleProfileHandler, () => {
  let handler: UpsertStyleProfileHandler;
  const prisma = { styleProfile: { upsert: jest.fn() } };

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.styleProfile.upsert.mockImplementation(
      ({ create }: { create: object }) =>
        Promise.resolve({ id: 'sp-1', updatedAt: new Date(), ...create }),
    );
    const moduleRef = await Test.createTestingModule({
      providers: [
        UpsertStyleProfileHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(UpsertStyleProfileHandler);
  });

  it("upserts the user's profile, trimming input", async () => {
    const result = await handler.execute(
      new UpsertStyleProfileCommand(USER, {
        samples: '  Sample entry  ',
        notes: ' dry humor ',
      }),
    );

    expect(prisma.styleProfile.upsert).toHaveBeenCalledWith({
      where: { userId: USER },
      create: { samples: 'Sample entry', notes: 'dry humor', userId: USER },
      update: { samples: 'Sample entry', notes: 'dry humor' },
    });
    expect(result).toMatchObject({
      samples: 'Sample entry',
      notes: 'dry humor',
    });
  });

  it('clears notes when omitted or blank', async () => {
    for (const notes of [undefined, null, '  ']) {
      prisma.styleProfile.upsert.mockClear();
      await handler.execute(
        new UpsertStyleProfileCommand(USER, { samples: 'x', notes }),
      );
      expect(prisma.styleProfile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ update: { samples: 'x', notes: null } }),
      );
    }
  });
});
