import {
  BadGatewayException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { DayStatus, Entry } from '@prisma/generated';
import { AnthropicService } from '@src/services/anthropic.service';
import { PrismaService } from '@src/services/prisma.service';
import { DraftEntryCommand } from './DraftEntry.command';
import { DraftEntryHandler } from './DraftEntry.handler';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const SESSION = 's-1';

const entry = (overrides: Partial<Entry> = {}): Entry => ({
  id: 'e-1',
  sessionId: SESSION,
  title: 'Coffee with Sam',
  body: 'I had coffee with Sam. It was formal and stiff.',
  aiDraft: 'I had coffee with Sam.',
  tags: ['sam'],
  model: 'claude-sonnet-5-5',
  flags: null,
  createdAt: new Date('2026-10-26T22:00:00Z'),
  updatedAt: new Date('2026-10-26T22:05:00Z'),
  userId: USER,
  ...overrides,
});

const session = (
  overrides: Partial<{
    status: DayStatus;
    Snippets: { text: string; capturedAt: Date }[];
    Entry: Entry | null;
  }> = {},
) => ({
  id: SESSION,
  userId: USER,
  status: 'interviewing' as DayStatus,
  Snippets: [
    { text: 'Coffee with Sam', capturedAt: new Date('2026-10-26T14:00:00Z') },
  ],
  Questions: [
    {
      text: 'How was it?',
      answer: 'Great, we talked for hours',
      skipped: false,
    },
    { text: 'Where?', answer: null, skipped: true },
  ],
  Entry: null,
  ...overrides,
});

const OUTPUT = {
  title: '  Coffee with Sam ',
  body: 'Had coffee with Sam today. We talked for hours.',
  tags: ['Sam', 'coffee', 'sam'],
};

describe(DraftEntryHandler, () => {
  let handler: DraftEntryHandler;
  const prisma = {
    dailySession: { findUnique: jest.fn(), updateMany: jest.fn() },
    styleProfile: { findUnique: jest.fn() },
    entry: { upsert: jest.fn() },
    $transaction: jest.fn(),
  };
  const anthropic = { generateStructuredWithModel: jest.fn() };

  const run = (feedback?: string) =>
    handler.execute(
      new DraftEntryCommand(USER, 'America/New_York', '2026-10-26', {
        feedback,
      }),
    );

  const aiRequest = () =>
    (
      anthropic.generateStructuredWithModel.mock.calls[0] as [
        {
          label: string;
          system: { text: string; cache_control?: unknown }[];
          messages: { content: string }[];
        },
      ]
    )[0];

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(
      (fn: (tx: typeof prisma) => unknown) => fn(prisma),
    );
    prisma.dailySession.updateMany.mockResolvedValue({ count: 1 });
    prisma.styleProfile.findUnique.mockResolvedValue(null);
    prisma.entry.upsert.mockImplementation(
      ({ create }: { create: Partial<Entry> }) =>
        Promise.resolve(entry({ ...create, id: 'e-new' })),
    );
    anthropic.generateStructuredWithModel.mockResolvedValue({
      output: OUTPUT,
      model: 'claude-sonnet-5-5',
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        DraftEntryHandler,
        { provide: PrismaService, useValue: prisma },
        { provide: AnthropicService, useValue: anthropic },
      ],
    }).compile();

    handler = moduleRef.get(DraftEntryHandler);
  });

  it('drafts the entry from snippets and answers, and moves the day to drafted', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());

    const result = await run();

    expect(prisma.dailySession.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_date: { userId: USER, date: new Date('2026-10-26T00:00:00Z') },
        },
      }),
    );
    expect(prisma.styleProfile.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: USER } }),
    );
    const { label, messages } = aiRequest();
    expect(label).toBe('draft');
    expect(messages[0].content).toContain('Coffee with Sam');
    expect(messages[0].content).toContain('10:00 AM');
    expect(messages[0].content).toContain('A: Great, we talked for hours');
    expect(messages[0].content).not.toContain('Where?'); // skipped
    expect(messages[0].content).not.toContain('<previous_draft>');

    expect(prisma.dailySession.updateMany).toHaveBeenCalledWith({
      where: { id: SESSION, userId: USER, status: { not: 'finalized' } },
      data: { status: 'drafted' },
    });
    const draft = {
      title: 'Coffee with Sam',
      body: OUTPUT.body,
      aiDraft: OUTPUT.body,
      tags: ['sam', 'coffee'],
      model: 'claude-sonnet-5-5',
    };
    expect(prisma.entry.upsert).toHaveBeenCalledWith({
      where: { sessionId: SESSION },
      create: { ...draft, sessionId: SESSION, userId: USER },
      update: draft,
    });
    expect(result).toMatchObject({ id: 'e-new', body: OUTPUT.body });
  });

  it('can draft straight from an open day, skipping the interview', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({ status: 'open' }),
    );

    await expect(run()).resolves.toMatchObject({ id: 'e-new' });
  });

  it('sends the current body and the feedback when regenerating', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({ status: 'drafted', Entry: entry() }),
    );

    await run('  Make it more casual  ');

    const content = aiRequest().messages[0].content;
    expect(content).toContain(
      '<previous_draft>\n# Coffee with Sam\n\nI had coffee with Sam. It was formal and stiff.',
    );
    expect(content).toContain('<feedback>\nMake it more casual\n</feedback>');
  });

  it("regenerates fresh, without the previous body, when there's no feedback", async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({ status: 'drafted', Entry: entry() }),
    );

    await run();

    expect(aiRequest().messages[0].content).not.toContain('formal and stiff');
  });

  it('puts the style profile in a cached system block', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    prisma.styleProfile.findUnique.mockResolvedValue({
      samples: 'Today was a lot. Mostly good.',
      notes: 'dry humor',
    });

    await run();

    const { system } = aiRequest();
    expect(system).toHaveLength(2);
    expect(system[0].cache_control).toBeUndefined();
    expect(system[1].text).toContain('Today was a lot. Mostly good.');
    expect(system[1].text).toContain('dry humor');
    expect(system[1].cache_control).toEqual({ type: 'ephemeral' });
  });

  it('requires at least one snippet', async () => {
    prisma.dailySession.findUnique.mockResolvedValueOnce(null);
    await expect(run()).rejects.toThrow(UnprocessableEntityException);

    prisma.dailySession.findUnique.mockResolvedValueOnce(
      session({ Snippets: [] }),
    );
    await expect(run()).rejects.toThrow(UnprocessableEntityException);
    expect(anthropic.generateStructuredWithModel).not.toHaveBeenCalled();
  });

  it('rejects a finalized day without calling the AI', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({ status: 'finalized', Entry: entry() }),
    );

    await expect(run()).rejects.toThrow(ConflictException);
    expect(anthropic.generateStructuredWithModel).not.toHaveBeenCalled();
  });

  it('stores nothing when the day is finalized while the AI is writing', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    prisma.dailySession.updateMany.mockResolvedValue({ count: 0 });

    await expect(run()).rejects.toThrow(ConflictException);
    expect(prisma.entry.upsert).not.toHaveBeenCalled();
  });

  it('propagates a 502 from the AI and stores nothing', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    anthropic.generateStructuredWithModel.mockRejectedValue(
      new BadGatewayException('The AI returned an unusable response'),
    );

    await expect(run()).rejects.toThrow(BadGatewayException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
