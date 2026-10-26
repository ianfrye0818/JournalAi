import { Prisma } from '@prisma/generated';
import { EntryResponse } from '@src/features/entries/shared/entry.response';
import { QuestionResponse } from '@src/features/questions/shared/question.response';
import { SnippetResponse } from '@src/features/snippets/shared/snippet.response';
import type { GetDayResponse } from '../GetDay/GetDay.response';

/** What a day view loads: live snippets in capture order, every question, and the entry. */
export const DAY_INCLUDE = {
  Snippets: {
    where: { deletedAt: null },
    include: { Session: { select: { date: true } } },
    orderBy: { capturedAt: 'asc' },
  },
  Questions: { orderBy: [{ round: 'asc' }, { order: 'asc' }] },
  Entry: true,
} satisfies Prisma.DailySessionInclude;

type DayWithDetails = Prisma.DailySessionGetPayload<{
  include: typeof DAY_INCLUDE;
}>;

export const toDayResponse = (
  session: DayWithDetails,
  date: string,
): GetDayResponse => ({
  id: session.id,
  date,
  status: session.status,
  interviewRound: session.interviewRound,
  finalizedAt: session.finalizedAt,
  snippets: session.Snippets.map((s) => SnippetResponse.from(s)),
  questions: session.Questions.map((q) => QuestionResponse.from(q)),
  entry: session.Entry ? EntryResponse.from(session.Entry) : null,
});
