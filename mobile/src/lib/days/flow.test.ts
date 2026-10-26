import type { Question } from '@/lib/api/types';
import { currentRound, nextInterviewAction, roundToAnswer, stepForStatus } from '@/lib/days/flow';

const question = (patch: Partial<Question>): Question => ({
  id: `q-${patch.round ?? 1}-${patch.order ?? 0}`,
  round: 1,
  order: 0,
  text: 'How did it go?',
  options: [],
  rationale: null,
  answer: null,
  skipped: false,
  answeredAt: null,
  ...patch,
});

describe('stepForStatus', () => {
  it('maps each status to the step it resumes at', () => {
    expect(stepForStatus('open')).toBe('review');
    expect(stepForStatus('interviewing')).toBe('interview');
    expect(stepForStatus('drafted')).toBe('draft');
    expect(stepForStatus('finalized')).toBe('draft');
  });
});

describe('currentRound', () => {
  it('returns only the latest round, ordered', () => {
    const questions = [
      question({ round: 2, order: 1 }),
      question({ round: 1, order: 0 }),
      question({ round: 2, order: 0 }),
    ];
    expect(currentRound({ interviewRound: 2, questions }).map((q) => q.order)).toEqual([0, 1]);
  });
});

describe('nextInterviewAction', () => {
  it('fetches the first round when nothing has been asked', () => {
    expect(nextInterviewAction({ interviewRound: 0, questions: [] })).toBe('fetch-round');
  });

  it('waits for answers while any question is pending', () => {
    const questions = [question({ answer: 'Yes' }), question({ order: 1 })];
    expect(nextInterviewAction({ interviewRound: 1, questions })).toBe('answer');
  });

  it('counts skipped questions as handled', () => {
    const questions = [question({ skipped: true })];
    expect(nextInterviewAction({ interviewRound: 1, questions })).toBe('fetch-round');
  });

  it('drafts once the last round is answered', () => {
    const questions = [question({ answer: 'A' }), question({ round: 2, answer: 'B' })];
    expect(nextInterviewAction({ interviewRound: 2, questions })).toBe('draft');
  });

  it('drafts when the latest round came back empty', () => {
    expect(nextInterviewAction({ interviewRound: 1, questions: [] })).toBe('draft');
  });
});

describe('roundToAnswer', () => {
  it('is the latest round when nothing is pending', () => {
    const questions = [question({ answer: 'A' }), question({ round: 2, answer: 'B' })];
    expect(roundToAnswer({ interviewRound: 2, questions }).map((q) => q.round)).toEqual([2]);
  });

  it('goes back to an earlier round that still has open questions', () => {
    // Round 2 came back empty while round 1 was still unanswered.
    const questions = [
      question({ order: 1, answer: 'frustrated' }),
      question({ order: 0 }),
      question({ order: 2 }),
    ];
    const day = { interviewRound: 2, questions };
    expect(nextInterviewAction(day)).toBe('answer');
    expect(roundToAnswer(day).map((q) => q.order)).toEqual([0, 1, 2]);
  });
});
