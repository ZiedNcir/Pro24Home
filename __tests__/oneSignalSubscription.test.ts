import { OneSignal } from 'react-native-onesignal';
import {
  getOneSignalSubscriptionId,
  initializeOneSignal,
  subscribeToOneSignalSubscription,
} from '../src/core/notifications/oneSignalSubscription';

const grantedPermission = {
  getPermission: async () => true,
  requestPermission: async () => true,
};

describe('getOneSignalSubscriptionId', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('keeps the server subscription ID received by the persistent observer', async () => {
    const observedIds: string[] = [];
    initializeOneSignal();
    const unsubscribe = subscribeToOneSignalSubscription(id => observedIds.push(id));

    (OneSignal.User.pushSubscription as any).emitChange('subscription-from-server');

    await expect(getOneSignalSubscriptionId()).resolves.toBe('subscription-from-server');
    expect(observedIds).toEqual(['subscription-from-server']);
    unsubscribe();
  });

  it('does not publish OneSignal’s local placeholder identifier', () => {
    const listener = jest.fn();
    initializeOneSignal();
    subscribeToOneSignalSubscription(listener);

    (OneSignal.User.pushSubscription as any).emitChange('local-pending-registration');

    expect(listener).not.toHaveBeenCalledWith('local-pending-registration');
  });

  it('returns the device subscription identifier supplied by OneSignal', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => 'client-device-subscription', grantedPermission),
    ).resolves.toBe('client-device-subscription');
  });

  it('requests notification permission when it has been denied', async () => {
    const requestPermission = jest.fn(async () => true);

    await expect(
      getOneSignalSubscriptionId(async () => 'client-device-subscription', {
        getPermission: async () => false,
        requestPermission,
      }),
    ).resolves.toBe('client-device-subscription');

    expect(requestPermission).toHaveBeenCalledWith(true);
  });

  it('waits for OneSignal to create a subscription after permission is granted', async () => {
    await expect(
      getOneSignalSubscriptionId(
        async () => null,
        grantedPermission,
        async () => 'subscription-created-after-prompt',
      ),
    ).resolves.toBe('subscription-created-after-prompt');
  });

  it('does not use OneSignal’s local placeholder as a device subscription identifier', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => 'local-pending-registration', grantedPermission, async () => null),
    ).rejects.toThrow('OneSignal subscription id is unavailable');
  });

  it('rejects registration when notification permission remains denied', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => 'client-device-subscription', {
        getPermission: async () => false,
        requestPermission: async () => false,
      }),
    ).rejects.toThrow('Notification permission is required');
  });

  it('rejects when a subscription is not available', async () => {
    await expect(getOneSignalSubscriptionId(async () => null, grantedPermission, async () => null)).rejects.toThrow(
      'OneSignal subscription id is unavailable',
    );
  });

  it('propagates an unavailable OneSignal SDK', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => {
        throw new Error('OneSignal is not initialized');
      }, grantedPermission),
    ).rejects.toThrow('OneSignal is not initialized');
  });
});
