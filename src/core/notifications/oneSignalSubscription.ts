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

const isRegisteredSubscriptionId = (subscriptionId: string | null): subscriptionId is string =>
  Boolean(subscriptionId && !subscriptionId.startsWith('local-'));

const waitForSubscriptionId: SubscriptionWaiter = () => new Promise(resolve => {
  const timeout = setTimeout(() => {
    OneSignal.User.pushSubscription.removeEventListener('change', listener);
    resolve(null);
  }, 15_000);

  const listener = (event: { current: { id?: string } }) => {
    const subscriptionId = event.current.id ?? null;
    if (!isRegisteredSubscriptionId(subscriptionId)) return;

    clearTimeout(timeout);
    OneSignal.User.pushSubscription.removeEventListener('change', listener);
    resolve(subscriptionId);
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
  const currentSubscriptionId = await readId();
  const subscriptionReady = isRegisteredSubscriptionId(currentSubscriptionId)
    ? Promise.resolve(currentSubscriptionId)
    : waitForId();

  const hasPermission = await permission.getPermission();
  const granted = hasPermission || await permission.requestPermission(true);

  if (!granted) {
    throw new Error('Notification permission is required');
  }

  const subscriptionId = await subscriptionReady;

  if (!isRegisteredSubscriptionId(subscriptionId)) {
    throw new Error('OneSignal subscription id is unavailable');
  }

  return subscriptionId;
};
