import type { QueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import { daysApi } from '@/lib/api/days';
import { syncEngine } from '@/lib/sync';
import { afterCapture } from './after-capture';

jest.mock('react-native', () => ({ Alert: { alert: jest.fn() } }));
jest.mock('@/lib/api/days', () => ({ daysApi: { reopen: jest.fn() } }));
jest.mock('@/lib/days/queries', () => ({
  dayKeys: { detail: (date: string) => ['days', date], list: () => ['days', 'list'] },
}));
jest.mock('@/lib/db/client', () => ({
  db: { select: () => ({ from: () => ({ where: () => ({ get: () => undefined }) }) }) },
}));
jest.mock('@/lib/db/schema', () => ({ days: { localDate: 'date' } }));
jest.mock('drizzle-orm', () => ({ eq: jest.fn() }));
jest.mock('@/lib/history/cache', () => ({
  historyCache: { saveDay: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('@/lib/sync', () => ({ syncEngine: { flush: jest.fn() } }));

describe('capture after finalization', () => {
  const getQueryData = jest.fn();
  const setQueryData = jest.fn();
  const invalidateQueries = jest.fn();
  const client = { getQueryData, setQueryData, invalidateQueries } as unknown as QueryClient;
  const actions = { onKeep: jest.fn(), onReopened: jest.fn() };
  const button = (label: string) =>
    jest
      .mocked(Alert.alert)
      .mock.calls.at(-1)?.[2]
      ?.find((item) => item.text === label);
  beforeEach(() => {
    jest.clearAllMocks();
    getQueryData.mockReturnValue({ status: 'finalized' });
    jest.mocked(syncEngine.flush).mockResolvedValue(true);
  });
  it('leaves an open or unknown day alone', async () => {
    for (const value of [{ status: 'open' }, undefined]) {
      getQueryData.mockReturnValue(value);
      await afterCapture(client, '2026-10-26', actions);
    }
    expect(Alert.alert).not.toHaveBeenCalled();
    expect(actions.onKeep).toHaveBeenCalledTimes(2);
  });
  it('keeps a finalized day unchanged until the user chooses', async () => {
    await afterCapture(client, '2026-10-26', actions);
    expect(daysApi.reopen).not.toHaveBeenCalled();
    button('Keep finalized')?.onPress?.();
    expect(actions.onKeep).toHaveBeenCalled();
    expect(actions.onReopened).not.toHaveBeenCalled();
  });
  it('syncs, reopens, updates the cache and opens the existing draft', async () => {
    const day = { status: 'drafted', entry: { body: 'My edited entry' } };
    jest
      .mocked(daysApi.reopen)
      .mockResolvedValue(day as Awaited<ReturnType<typeof daysApi.reopen>>);
    await afterCapture(client, '2026-10-26', actions);
    await button('Reopen day')?.onPress?.();
    expect(syncEngine.flush).toHaveBeenCalled();
    expect(daysApi.reopen).toHaveBeenCalledWith('2026-10-26');
    expect(setQueryData).toHaveBeenCalledWith(['days', '2026-10-26'], day);
    expect(actions.onReopened).toHaveBeenCalled();
  });
  it('reports a saved snippet separately from a failed reopen', async () => {
    jest.mocked(syncEngine.flush).mockResolvedValue(false);
    await afterCapture(client, '2026-10-26', actions);
    await button('Reopen day')?.onPress?.();
    expect(daysApi.reopen).not.toHaveBeenCalled();
    expect(Alert.alert).toHaveBeenLastCalledWith(
      'Snippet saved, but could not reopen day',
      expect.any(String),
      expect.any(Array),
      { cancelable: false },
    );
    expect(actions.onReopened).not.toHaveBeenCalled();
  });
});
