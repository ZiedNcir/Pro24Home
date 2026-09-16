import { OneSignal } from 'react-native-onesignal';

type SubscriptionIdReader = () => Promise<string | null>;
type PermissionReader = () => Promise<boolean>;
type PermissionRequester = (fallbackToSettings: boolean) => Promise<boolean>;

interface PermissionApi {
  getPermission: PermissionReader;
  requestPermission: PermissionRequester;
}

const readSubscriptionId: SubscriptionIdReader = () =>
  OneSignal.User.pushSubscription.getIdAsync();

const notificationPermission: PermissionApi = {
  getPermission: () => OneSignal.Notifications.getPermissionAsync(),
  requestPermission: fallbackToSettings =>
    OneSignal.Notifications.requestPermission(fallbackToSettings),
};

export const getOneSignalSubscriptionId = async (
  readId: SubscriptionIdReader = readSubscriptionId,
  permission: PermissionApi = notificationPermission,
): Promise<string> => {
  const hasPermission = await permission.getPermission();
  const granted = hasPermission || await permission.requestPermission(true);

  if (!granted) {
    throw new Error('Notification permission is required');
  }

  const subscriptionId = await readId();

  if (!subscriptionId) {
    throw new Error('OneSignal subscription id is unavailable');
  }

  return subscriptionId;
};
