import {
  BadGatewayException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { DayStatus, Question } from '@prisma/generated';
import { AnthropicService } from '@src/services/anthropic.service';
import { PrismaService } from '@src/services/prisma.service';
import { StartInterviewRoundCommand } from './StartInterviewRound.command';
import { StartInterviewRoundHandler } from './StartInterviewRound.handler';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const SESSION = 's-1';

const snippet = (text: string, capturedAt: string) => ({
  id: `snip-${text}`,
  text,
  capturedAt: new Date(capturedAt),
});

const question = (overrides: Partial<Question> = {}): Question => ({
  id: 'q-1',
  sessionId: SESSION,
  round: 1,
  order: 0,
  text: 'How was the coffee with Sam?',
  options: ['Great', 'Awkward'],
  rationale: 'Adds how it felt',
  answer: null,
  skipped: false,
  answeredAt: null,
  userId: USER,
  ...overrides,
});

const session = (
  overrides: Partial<{
    status: DayStatus;
    interviewRound: number;
    Snippets: ReturnType<typeof snippet>[];
    Questions: Question[];
  }> = {},
) => ({
  id: SESSION,
  userId: USER,
  status: 'open' as DayStatus,
  interviewRound: 0,
  Snippets: [snippet('Coffee with Sam', '2026-10-26T14:00:00Z')],
  Questions: [],
  ...overrides,
});

describe(StartInterviewRoundHandler, () => {
  let handler: StartInterviewRoundHandler;
  const prisma = {
    dailySession: { findUnique: jest.fn(), updateMany: jest.fn() },
    question: { createManyAndReturn: jest.fn() },
    $transaction: jest.fn(),
  };
  const anthropic = { generateStructured: jest.fn() };

  const run = () =>
    handler.execute(
      new StartInterviewRoundCommand(USER, 'America/New_York', {
        date: '2026-10-26',
      }),
    );

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(
      (fn: (tx: typeof prisma) => unknown) => fn(prisma),
    );
    prisma.dailySession.updateMany.mockResolvedValue({ count: 1 });
    prisma.question.createManyAndReturn.mockImplementation(
      ({ data }: { data: Omit<Question, 'id'>[] }) =>
        Promise.resolve(
          data.map((q, i) => ({
            ...q,
            id: `q-new-${i}`,
            answer: null,
            skipped: false,
            answeredAt: null,
          })),
        ),
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        StartInterviewRoundHandler,
        { provide: PrismaService, useValue: prisma },
        { provide: AnthropicService, useValue: anthropic },
      ],
    }).compile();

    handler = moduleRef.get(StartInterviewRoundHandler);
  });

  it('asks the AI about the day and stores round 1', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    anthropic.generateStructured.mockResolvedValue({
      questions: [
        {
          text: 'How was the coffee with Sam?',
          options: ['Great', 'Awkward'],
          rationale: 'Adds how it felt',
        },
        { text: 'Where did you meet?', options: [], rationale: '' },
      ],
    });

    const result = await run();

    expect(prisma.dailySession.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId_date: { userId: USER, date: new Date('2026-10-26T00:00:00Z') },
        },
      }),
    );
    const [{ messages, label }] = anthropic.generateStructured.mock
      .calls[0] as [{ label: string; messages: { content: string }[] }];
    expect(label).toBe('interview');
    expect(messages[0].content).toContain('Coffee with Sam');
    expect(messages[0].content).toContain('10:00 AM'); // 14:00Z in New York
    expect(messages[0].content).toContain('round 1 of at most 2');
    expect(messages[0].content).not.toContain('<earlier_questions>');

    expect(prisma.dailySession.updateMany).toHaveBeenCalledWith({
      where: {
        id: SESSION,
        userId: USER,
        interviewRound: 0,
        status: { in: ['open', 'interviewing'] },
      },
      data: { interviewRound: 1, status: 'interviewing' },
    });
    expect(prisma.question.createManyAndReturn).toHaveBeenCalledWith({
      data: [
        expect.objectContaining({
          sessionId: SESSION,
          userId: USER,
          round: 1,
          order: 0,
          text: 'How was the coffee with Sam?',
          options: ['Great', 'Awkward'],
          rationale: 'Adds how it felt',
        }),
        expect.objectContaining({ order: 1, rationale: null }),
      ],
    });
    expect(result.round).toBe(1);
    expect(result.readyToDraft).toBe(false);
    expect(result.questions.map((q) => q.text)).toEqual([
      'How was the coffee with Sam?',
      'Where did you meet?',
    ]);
  });

  it('includes earlier answers in round 2 and marks it ready to draft', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({
        status: 'interviewing',
        interviewRound: 1,
        Questions: [
          question({ answer: 'Great, we talked for hours' }),
          question({ id: 'q-2', order: 1, text: 'Who else?', skipped: true }),
        ],
      }),
    );
    anthropic.generateStructured.mockResolvedValue({
      questions: [
        { text: 'What did you talk about?', options: [], rationale: '' },
      ],
    });

    const result = await run();

    const [{ messages }] = anthropic.generateStructured.mock.calls[0] as [
      { messages: { content: string }[] },
    ];
    expect(messages[0].content).toContain('A: Great, we talked for hours');
    expect(messages[0].content).toContain('A: (skipped)');
    expect(result.round).toBe(2);
    expect(result.readyToDraft).toBe(true);
  });

  it('is ready to draft when the AI has nothing to ask', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    anthropic.generateStructured.mockResolvedValue({ questions: [] });

    const result = await run();

    expect(result).toEqual({ round: 1, questions: [], readyToDraft: true });
    expect(prisma.dailySession.updateMany).toHaveBeenCalled();
  });

  it('skips the AI after the last round', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(
      session({ status: 'interviewing', interviewRound: 2 }),
    );

    const result = await run();

    expect(result).toEqual({ round: 2, questions: [], readyToDraft: true });
    expect(anthropic.generateStructured).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('requires at least one snippet', async () => {
    prisma.dailySession.findUnique.mockResolvedValueOnce(null);
    await expect(run()).rejects.toThrow(UnprocessableEntityException);

    prisma.dailySession.findUnique.mockResolvedValueOnce(
      session({ Snippets: [] }),
    );
    await expect(run()).rejects.toThrow(UnprocessableEntityException);

    expect(anthropic.generateStructured).not.toHaveBeenCalled();
  });

  it.each(['drafted', 'finalized'] as const)(
    'rejects a %s day',
    async (status) => {
      prisma.dailySession.findUnique.mockResolvedValue(session({ status }));

      await expect(run()).rejects.toThrow(ConflictException);
      expect(anthropic.generateStructured).not.toHaveBeenCalled();
    },
  );

  it('propagates a 502 from the AI and stores nothing', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    anthropic.generateStructured.mockRejectedValue(
      new BadGatewayException('The AI returned an unusable response'),
    );

    await expect(run()).rejects.toThrow(BadGatewayException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(prisma.question.createManyAndReturn).not.toHaveBeenCalled();
  });

  it('rejects a round that a concurrent request already claimed', async () => {
    prisma.dailySession.findUnique.mockResolvedValue(session());
    anthropic.generateStructured.mockResolvedValue({ questions: [] });
    prisma.dailySession.updateMany.mockResolvedValue({ count: 0 });

    await expect(run()).rejects.toThrow(ConflictException);
    expect(prisma.question.createManyAndReturn).not.toHaveBeenCalled();
  });
});
