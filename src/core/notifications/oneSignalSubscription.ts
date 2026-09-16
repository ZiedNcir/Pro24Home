import { OneSignal } from 'react-native-onesignal';

type SubscriptionIdReader = () => Promise<string | null>;

const readSubscriptionId: SubscriptionIdReader = () =>
  OneSignal.User.pushSubscription.getIdAsync();

export const getOneSignalSubscriptionId = async (
  readId: SubscriptionIdReader = readSubscriptionId,
): Promise<string> => {
  try {
    return (await readId()) ?? '';
  } catch {
    return '';
  }
};
