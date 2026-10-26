import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { UpdateEntryCommand } from './UpdateEntry.command';
import { UpdateEntryHandler } from './UpdateEntry.handler';
import { UpdateEntryRequest } from './UpdateEntry.request';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const ENTRY = '2d6f1d0b-8a3c-4c1e-b7a9-5e0f4c2a9b11';

describe(UpdateEntryHandler, () => {
  let handler: UpdateEntryHandler;
  const prisma = { entry: { findFirst: jest.fn(), update: jest.fn() } };

  const updateArgs = () =>
    (
      prisma.entry.update.mock.calls[0] as [
        { where: unknown; data: Record<string, unknown> },
      ]
    )[0];

  const run = (request: UpdateEntryRequest) =>
    handler.execute(new UpdateEntryCommand(USER, ENTRY, request));

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.entry.findFirst.mockResolvedValue({
      id: ENTRY,
      Session: { status: 'drafted' },
    });
    prisma.entry.update.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({
          id: ENTRY,
          title: 'Old title',
          body: 'Old body',
          aiDraft: 'AI body',
          tags: [],
          model: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          ...Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined),
          ),
        }),
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        UpdateEntryHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(UpdateEntryHandler);
  });

  it("updates only the sent fields of the user's entry and leaves aiDraft alone", async () => {
    const result = await run({
      body: 'My edit',
      tags: [' Sam ', 'sam', 'Gym'],
    });

    expect(prisma.entry.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: ENTRY, userId: USER } }),
    );
    expect(updateArgs()).toEqual({
      where: { id: ENTRY },
      data: { title: undefined, body: 'My edit', tags: ['sam', 'gym'] },
    });
    expect(result).toMatchObject({
      title: 'Old title',
      body: 'My edit',
      aiDraft: 'AI body',
    });
  });

  it('trims the title and clears it when blank', async () => {
    await run({ title: '  New  ' });
    expect(updateArgs().data.title).toBe('New');

    prisma.entry.update.mockClear();
    await run({ title: '   ' });
    expect(updateArgs().data.title).toBeNull();
  });

  it('lowercases the mood and clears it when blank', async () => {
    await run({ mood: ' Tired But Hopeful ' });
    expect(updateArgs().data.mood).toBe('tired but hopeful');
    prisma.entry.update.mockClear();
    await run({ mood: '  ' });
    expect(updateArgs().data.mood).toBeNull();
  });

  it('rejects an empty patch', async () => {
    await expect(run({})).rejects.toThrow(BadRequestException);
    expect(prisma.entry.findFirst).not.toHaveBeenCalled();
  });

  it("404s on an entry that isn't the user's", async () => {
    prisma.entry.findFirst.mockResolvedValue(null);

    await expect(run({ body: 'x' })).rejects.toThrow(NotFoundException);
    expect(prisma.entry.update).not.toHaveBeenCalled();
  });

  it('rejects edits once the day is finalized', async () => {
    prisma.entry.findFirst.mockResolvedValue({
      id: ENTRY,
      Session: { status: 'finalized' },
    });

    await expect(run({ body: 'x' })).rejects.toThrow(ConflictException);
    expect(prisma.entry.update).not.toHaveBeenCalled();
  });
});
