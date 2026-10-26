import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@src/services/prisma.service';
import { AnswerQuestionCommand } from './AnswerQuestion.command';
import { AnswerQuestionHandler } from './AnswerQuestion.handler';
import { AnswerQuestionRequest } from './AnswerQuestion.request';

const USER = '7b0c3c1e-4c55-4a3e-9d0e-2f2a7f1f6a01';
const QUESTION = '2d6f1d0b-8a3c-4c1e-b7a9-5e0f4c2a9b11';

describe(AnswerQuestionHandler, () => {
  let handler: AnswerQuestionHandler;
  const prisma = { question: { findFirst: jest.fn(), update: jest.fn() } };

  const updateArgs = () =>
    (
      prisma.question.update.mock.calls[0] as [
        { where: unknown; data: Record<string, unknown> },
      ]
    )[0];

  const run = (request: AnswerQuestionRequest) =>
    handler.execute(new AnswerQuestionCommand(USER, QUESTION, request));

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.question.findFirst.mockResolvedValue({
      id: QUESTION,
      Session: { status: 'interviewing' },
    });
    prisma.question.update.mockImplementation(
      ({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve({
          id: QUESTION,
          round: 1,
          order: 0,
          text: 'How was it?',
          options: [],
          rationale: null,
          ...data,
        }),
    );

    const moduleRef = await Test.createTestingModule({
      providers: [
        AnswerQuestionHandler,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    handler = moduleRef.get(AnswerQuestionHandler);
  });

  it('stores a trimmed answer and clears any skip', async () => {
    const result = await run({ answer: '  Great, we talked for hours ' });

    expect(prisma.question.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: QUESTION, userId: USER } }),
    );
    expect(updateArgs()).toMatchObject({
      where: { id: QUESTION },
      data: { answer: 'Great, we talked for hours', skipped: false },
    });
    expect(updateArgs().data.answeredAt).toBeInstanceOf(Date);
    expect(result).toMatchObject({
      answer: 'Great, we talked for hours',
      skipped: false,
    });
  });

  it('marks a question skipped and clears any answer', async () => {
    const result = await run({ skipped: true });

    expect(updateArgs()).toMatchObject({
      where: { id: QUESTION },
      data: { answer: null, skipped: true },
    });
    expect(updateArgs().data.answeredAt).toBeInstanceOf(Date);
    expect(result).toMatchObject({ answer: null, skipped: true });
  });

  it.each([
    ['neither field', {}],
    ['a blank answer', { answer: '   ' }],
    ['both fields', { answer: 'Yes', skipped: true as const }],
  ])('rejects %s', async (_, request) => {
    await expect(run(request)).rejects.toThrow(BadRequestException);
    expect(prisma.question.update).not.toHaveBeenCalled();
  });

  it("404s on a question that isn't the user's", async () => {
    prisma.question.findFirst.mockResolvedValue(null);

    await expect(run({ answer: 'Yes' })).rejects.toThrow(NotFoundException);
    expect(prisma.question.update).not.toHaveBeenCalled();
  });

  it('rejects answers once the day is finalized', async () => {
    prisma.question.findFirst.mockResolvedValue({
      id: QUESTION,
      Session: { status: 'finalized' },
    });

    await expect(run({ answer: 'Yes' })).rejects.toThrow(ConflictException);
  });
});
