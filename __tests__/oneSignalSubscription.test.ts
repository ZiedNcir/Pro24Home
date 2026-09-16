import { getOneSignalSubscriptionId } from '../src/core/notifications/oneSignalSubscription';

const grantedPermission = {
  getPermission: async () => true,
  requestPermission: async () => true,
};

describe('getOneSignalSubscriptionId', () => {
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
