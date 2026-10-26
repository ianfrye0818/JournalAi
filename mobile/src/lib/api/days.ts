import { api } from '@/lib/api/client';
import type {
  AnswerPayload,
  DaySummary,
  DayView,
  Entry,
  EntryPatch,
  InterviewRound,
  Question,
} from '@/lib/api/types';

const day = (date: string) => `/days/${encodeURIComponent(date)}`;

export const daysApi = {
  list: () => api<DaySummary[]>('/days'),
  get: (date: string) => api<DayView>(day(date)),
  /** Calls the AI unless the last round was already reached. */
  startInterviewRound: (date: string) =>
    api<InterviewRound>(`${day(date)}/interview`, { method: 'POST' }),
  /** Calls the AI. With `feedback`, rewrites the current entry. */
  draft: (date: string, feedback?: string) =>
    api<Entry>(`${day(date)}/draft`, { method: 'POST', body: feedback ? { feedback } : {} }),
  finalize: (date: string) => api<DayView>(`${day(date)}/finalize`, { method: 'POST' }),
  reopen: (date: string) => api<DayView>(`${day(date)}/reopen`, { method: 'POST' }),
};

export const questionsApi = {
  answer: (id: string, body: AnswerPayload) =>
    api<Question>(`/questions/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
};

export const entriesApi = {
  update: (id: string, body: EntryPatch) =>
    api<Entry>(`/entries/${encodeURIComponent(id)}`, { method: 'PATCH', body }),
};
