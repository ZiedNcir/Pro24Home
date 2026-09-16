import { getOneSignalSubscriptionId } from '../src/core/notifications/oneSignalSubscription';

describe('getOneSignalSubscriptionId', () => {
  it('returns the device subscription identifier supplied by OneSignal', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => 'client-device-subscription'),
    ).resolves.toBe('client-device-subscription');
  });

  it('returns an empty value when a subscription is not available', async () => {
    await expect(getOneSignalSubscriptionId(async () => null)).resolves.toBe('');
  });

  it('does not block registration when the OneSignal SDK is unavailable', async () => {
    await expect(
      getOneSignalSubscriptionId(async () => {
        throw new Error('OneSignal is not initialized');
      }),
    ).resolves.toBe('');
  });
});
