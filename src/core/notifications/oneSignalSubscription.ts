import { OneSignal } from 'react-native-onesignal';

type SubscriptionIdReader = () => Promise<string | null>;
type SubscriptionWaiter = () => Promise<string | null>;
type PermissionReader = () => Promise<boolean>;
type PermissionRequester = (fallbackToSettings: boolean) => Promise<boolean>;

interface PermissionApi {
  getPermission: PermissionReader;
  requestPermission: PermissionRequester;
}

const readSubscriptionId: SubscriptionIdReader = () =>
  OneSignal.User.pushSubscription.getIdAsync();

const waitForSubscriptionId: SubscriptionWaiter = () => new Promise(resolve => {
  const timeout = setTimeout(() => {
    OneSignal.User.pushSubscription.removeEventListener('change', listener);
    resolve(null);
  }, 15_000);

  const listener = (event: { current: { id?: string } }) => {
    if (!event.current.id) return;

    clearTimeout(timeout);
    OneSignal.User.pushSubscription.removeEventListener('change', listener);
    resolve(event.current.id);
  };

  OneSignal.User.pushSubscription.addEventListener('change', listener);
});

const notificationPermission: PermissionApi = {
  getPermission: () => OneSignal.Notifications.getPermissionAsync(),
  requestPermission: fallbackToSettings =>
    OneSignal.Notifications.requestPermission(fallbackToSettings),
};

export const getOneSignalSubscriptionId = async (
  readId: SubscriptionIdReader = readSubscriptionId,
  permission: PermissionApi = notificationPermission,
  waitForId: SubscriptionWaiter = waitForSubscriptionId,
): Promise<string> => {
  const hasPermission = await permission.getPermission();
  const granted = hasPermission || await permission.requestPermission(true);

  if (!granted) {
    throw new Error('Notification permission is required');
  }

  const subscriptionId = await readId() ?? await waitForId();

  if (!subscriptionId) {
    throw new Error('OneSignal subscription id is unavailable');
  }

  return subscriptionId;
};
