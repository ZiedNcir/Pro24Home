import { OneSignal } from 'react-native-onesignal';

type SubscriptionIdReader = () => Promise<string | null>;

const readSubscriptionId: SubscriptionIdReader = () =>
  OneSignal.User.pushSubscription.getIdAsync();

export const getOneSignalSubscriptionId = async (
  readId: SubscriptionIdReader = readSubscriptionId,
): Promise<string> => {
  const subscriptionId = await readId();

  if (!subscriptionId) {
    throw new Error('OneSignal subscription id is unavailable');
  }

  return subscriptionId;
};
