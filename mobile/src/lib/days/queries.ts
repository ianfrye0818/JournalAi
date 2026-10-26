import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { daysApi, entriesApi, questionsApi } from '@/lib/api/days';
import type { AnswerPayload, DayView, EntryPatch } from '@/lib/api/types';
import { historyCache } from '@/lib/history/cache';
import { refreshHistory } from '@/lib/history/queries';

/**
 * Server state for the end-of-day flow. Every mutation writes its result into the cached day, so
 * Today, Days, and the flow screens all see the same status without refetching. Each day that
 * comes back is also mirrored into SQLite (`historyCache`) so it can be read offline.
 */

export const dayKeys = {
  all: ['days'] as const,
  list: () => [...dayKeys.all, 'list'] as const,
  detail: (date: string) => [...dayKeys.all, 'detail', date] as const,
};

/**
 * Keys for the AI calls. They outlive the screen that started them, so a screen that remounts
 * mid-call checks `isMutating` with these instead of starting a second one.
 */
export const aiMutationKeys = {
  interview: (date: string) => ['days', 'interview', date] as const,
  draft: (date: string) => ['days', 'draft', date] as const,
};

/** Mirroring is best effort: a failed cache write must never fail the request that fed it. */
const mirror = (day: DayView | undefined) => {
  if (day) historyCache.saveDay(day).catch((err) => console.warn('Caching day failed', err));
};

function setDay(client: QueryClient, date: string, day: DayView) {
  client.setQueryData(dayKeys.detail(date), day);
  mirror(day);
}

function patchDay(client: QueryClient, date: string, patch: (day: DayView) => DayView) {
  mirror(client.setQueryData<DayView>(dayKeys.detail(date), (day) => (day ? patch(day) : day)));
}

/** The list's status and title come from the day, so refresh it after any change to one. */
const invalidateList = (client: QueryClient) =>
  client.invalidateQueries({ queryKey: dayKeys.list() });

export function useDay(date: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: dayKeys.detail(date),
    queryFn: async () => {
      const day = await daysApi.get(date);
      mirror(day);
      return day;
    },
    enabled,
  });
}

/** Refreshes the cached history; read the days themselves through `useHistory`. */
export function useDayList() {
  return useQuery({ queryKey: dayKeys.list(), queryFn: refreshHistory });
}

export function useStartInterviewRound(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: aiMutationKeys.interview(date),
    mutationFn: () => daysApi.startInterviewRound(date),
    onSuccess: (res) => {
      patchDay(client, date, (day) => {
        // Past the last round the server answers without asking anything or changing the day.
        if (res.round <= day.interviewRound) return day;
        const known = new Set(day.questions.map((q) => q.id));
        return {
          ...day,
          status: 'interviewing',
          interviewRound: res.round,
          questions: [...day.questions, ...res.questions.filter((q) => !known.has(q.id))],
        };
      });
      void invalidateList(client);
    },
  });
}

export function useAnswerQuestion(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: AnswerPayload }) => questionsApi.answer(id, body),
    onSuccess: (question) =>
      patchDay(client, date, (day) => ({
        ...day,
        questions: day.questions.map((q) => (q.id === question.id ? question : q)),
      })),
  });
}

export function useDraftEntry(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationKey: aiMutationKeys.draft(date),
    mutationFn: (feedback?: string) => daysApi.draft(date, feedback),
    onSuccess: (entry) => {
      patchDay(client, date, (day) => ({ ...day, status: 'drafted', entry }));
      void invalidateList(client);
    },
  });
}

export function useUpdateEntry(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: EntryPatch }) => entriesApi.update(id, patch),
    onSuccess: (entry) => {
      patchDay(client, date, (day) => ({ ...day, entry }));
      void invalidateList(client);
    },
  });
}

export function useFinalizeDay(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => daysApi.finalize(date),
    onSuccess: (day) => {
      setDay(client, date, day);
      void invalidateList(client);
    },
  });
}

export function useReopenDay(date: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => daysApi.reopen(date),
    onSuccess: (day) => {
      setDay(client, date, day);
      void invalidateList(client);
    },
  });
}
