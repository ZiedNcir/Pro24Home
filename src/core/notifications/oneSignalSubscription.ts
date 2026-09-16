import { LogLevel, OneSignal } from 'react-native-onesignal';

const ONESIGNAL_APP_ID = '634beb38-87ce-4fab-877e-cd57d766cb6e';
const SUBSCRIPTION_TIMEOUT_MS = 15_000;

type SubscriptionIdReader = () => Promise<string | null>;
type SubscriptionWaiter = () => Promise<string | null>;
type PermissionReader = () => Promise<boolean>;
type PermissionRequester = (fallbackToSettings: boolean) => Promise<boolean>;
type SubscriptionListener = (subscriptionId: string) => void;

interface PermissionApi {
  getPermission: PermissionReader;
  requestPermission: PermissionRequester;
}

let initialized = false;
let currentSubscriptionId: string | null = null;
const subscriptionListeners = new Set<SubscriptionListener>();

const readSubscriptionId: SubscriptionIdReader = () =>
  OneSignal.User.pushSubscription.getIdAsync();

const isRegisteredSubscriptionId = (subscriptionId: string | null): subscriptionId is string =>
  Boolean(subscriptionId && !subscriptionId.startsWith('local-'));

const publishSubscriptionId = (subscriptionId: string | null): void => {
  if (!isRegisteredSubscriptionId(subscriptionId) || currentSubscriptionId === subscriptionId) return;

  currentSubscriptionId = subscriptionId;
  subscriptionListeners.forEach(listener => listener(subscriptionId));
};

const onPushSubscriptionChange = (event: { current: { id?: string } }): void => {
  publishSubscriptionId(event.current.id ?? null);
};

export const initializeOneSignal = (): void => {
  if (initialized) return;

  initialized = true;
  OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  OneSignal.initialize(ONESIGNAL_APP_ID);
  OneSignal.User.pushSubscription.addEventListener('change', onPushSubscriptionChange);
  void readSubscriptionId().then(publishSubscriptionId);
};

export const subscribeToOneSignalSubscription = (listener: SubscriptionListener): (() => void) => {
  subscriptionListeners.add(listener);
  if (currentSubscriptionId) listener(currentSubscriptionId);

  return () => subscriptionListeners.delete(listener);
};

const waitForSubscriptionId: SubscriptionWaiter = () => {
  if (currentSubscriptionId) return Promise.resolve(currentSubscriptionId);

  return new Promise(resolve => {
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, SUBSCRIPTION_TIMEOUT_MS);

    const unsubscribe = subscribeToOneSignalSubscription(subscriptionId => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(subscriptionId);
    });
  });
};

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
  const currentId = await readId();
  const subscriptionReady = isRegisteredSubscriptionId(currentId)
    ? Promise.resolve(currentId)
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
