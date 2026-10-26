import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

const ID = 'journal-evening';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export async function cancelReminder() {
  if (Platform.OS !== 'web') await Notifications.cancelScheduledNotificationAsync(ID);
}
export async function getReminderTime(): Promise<string> {
  if (Platform.OS === 'web') return '';
  const reminder = (await Notifications.getAllScheduledNotificationsAsync()).find(
    (item) => item.identifier === ID,
  );
  return typeof reminder?.content.data?.time === 'string' ? reminder.content.data.time : '';
}
export async function saveReminder(time: string) {
  if (!time) return cancelReminder();
  if (Platform.OS === 'web') throw new Error('Reminders are available in the Android and iOS app.');
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error('Enter a time as HH:MM (24-hour).');
  if (Platform.OS === 'android')
    await Notifications.setNotificationChannelAsync(ID, {
      name: 'Evening journal',
      importance: AndroidImportance.DEFAULT,
    });
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted && permission.ios?.status !== IosAuthorizationStatus.PROVISIONAL) {
    throw new Error('Allow notifications in your phone settings to enable reminders.');
  }
  const [hour, minute] = time.split(':').map(Number);
  await Notifications.scheduleNotificationAsync({
    identifier: ID,
    content: {
      title: 'A moment for your day',
      body: 'Your snippets are ready. Take a moment to journal.',
      sound: 'default',
      data: { time },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: ID,
    },
  });
}
