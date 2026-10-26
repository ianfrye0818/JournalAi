import * as Notifications from 'expo-notifications';
import { saveReminder, cancelReminder } from './reminders';
jest.mock('react-native', () => ({ Platform: { OS: 'android' } }));
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  AndroidImportance: { DEFAULT: 3 },
  IosAuthorizationStatus: { PROVISIONAL: 3 },
  SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));
describe('evening reminder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(Notifications.requestPermissionsAsync)
      .mockResolvedValue({ granted: true } as Notifications.NotificationPermissionsStatus);
  });
  it('schedules one daily reminder at the chosen time', async () => {
    await saveReminder('21:35');
    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalled();
    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: 'journal-evening',
        trigger: { type: 'daily', hour: 21, minute: 35, channelId: 'journal-evening' },
      }),
    );
  });
  it('does not schedule if permission is denied', async () => {
    jest
      .mocked(Notifications.requestPermissionsAsync)
      .mockResolvedValue({ granted: false } as Notifications.NotificationPermissionsStatus);
    await expect(saveReminder('20:00')).rejects.toThrow('Allow notifications');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
  it('rejects malformed times', async () => {
    for (const time of ['24:00', '20:60', '8:00'])
      await expect(saveReminder(time)).rejects.toThrow('HH:MM');
    expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });
  it('cancels the reminder when disabled or signed out', async () => {
    await saveReminder('');
    await cancelReminder();
    expect(Notifications.cancelScheduledNotificationAsync).toHaveBeenCalledWith('journal-evening');
  });
});
