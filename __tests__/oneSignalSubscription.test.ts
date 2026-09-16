import { getOneSignalSubscriptionId } from '../src/core/notifications/oneSignalSubscription';

describe('getOneSignalSubscriptionId', () => {
  it('returns the device subscription identifier supplied by OneSignal', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => 'client-device-subscription'),
    ).resolves.toBe('client-device-subscription');
  });

  it('rejects when a subscription is not available', async () => {
    await expect(getOneSignalSubscriptionId(async () => null)).rejects.toThrow(
      'OneSignal subscription id is unavailable',
    );
  });

  it('propagates an unavailable OneSignal SDK', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => {
        throw new Error('OneSignal is not initialized');
      }),
    ).rejects.toThrow('OneSignal is not initialized');
  });
});
