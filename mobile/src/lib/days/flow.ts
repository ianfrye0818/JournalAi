import type { DayStatus, DayView, Question } from '@/lib/api/types';

/**
 * The end-of-day flow is Review → Interview → Draft, and where you land is derived from the day's
 * server state, so leaving mid-flow and coming back resumes at the right step.
 */

export type DayStep = 'review' | 'interview' | 'draft';

/** Matches `MAX_INTERVIEW_ROUNDS` in the backend's StartInterviewRound handler. */
export const MAX_INTERVIEW_ROUNDS = 2;

export function stepForStatus(status: DayStatus): DayStep {
  switch (status) {
    case 'open':
      return 'review';
    case 'interviewing':
      return 'interview';
    case 'drafted':
    case 'finalized':
      return 'draft';
  }
}

export const isPending = (q: Question) => q.answer === null && !q.skipped;

/** Questions of the latest round, in order. */
export function currentRound(day: Pick<DayView, 'interviewRound' | 'questions'>): Question[] {
  return day.questions
    .filter((q) => q.round === day.interviewRound)
    .sort((a, b) => a.order - b.order);
}

/**
 * The round to put on screen: the earliest one with a question still pending, else the latest.
 * Usually those are the same, but a later round can exist while an earlier one has open questions
 * (e.g. a round that came back empty was fetched before the previous one was answered).
 */
export function roundToAnswer(day: Pick<DayView, 'interviewRound' | 'questions'>): Question[] {
  const pending = day.questions.filter(isPending);
  if (pending.length === 0) return currentRound(day);
  const round = Math.min(...pending.map((q) => q.round));
  return day.questions.filter((q) => q.round === round).sort((a, b) => a.order - b.order);
}

export type InterviewAction =
  /** Some question still needs an answer or a skip. */
  | 'answer'
  /** Every asked question is handled and the AI may have more. */
  | 'fetch-round'
  /** Nothing more to ask. */
  | 'draft';

export function nextInterviewAction(day: Pick<DayView, 'interviewRound' | 'questions'>): InterviewAction {
  if (day.questions.some(isPending)) return 'answer';
  if (day.interviewRound >= MAX_INTERVIEW_ROUNDS) return 'draft';
  // A finished round that asked nothing means the AI was already satisfied (`readyToDraft`).
  if (day.interviewRound > 0 && currentRound(day).length === 0) return 'draft';
  return 'fetch-round';
}

/** Where to open a day's flow; `router.push(dayHref(date, stepForStatus(status)))` resumes it. */
export const dayHref = (date: string, step: DayStep) =>
  ({ pathname: `/day/[date]/${step}`, params: { date } }) as const;

/** The day's own page: its entry, snippets, and actions. */
export const dayPageHref = (date: string) => ({ pathname: '/day/[date]', params: { date } }) as const;
