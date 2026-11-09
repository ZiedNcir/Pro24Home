import AsyncStorage from '@react-native-async-storage/async-storage';

const accountCreatedKey = 'account_created';

export const hasCreatedAccount = async (): Promise<boolean> =>
  (await AsyncStorage.getItem(accountCreatedKey)) === 'true';

export const markAccountCreated = (): Promise<void> =>
  AsyncStorage.setItem(accountCreatedKey, 'true');
