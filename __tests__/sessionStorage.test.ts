import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSession, readSession, writeSession } from '@core/session/session-storage';

const user = { id: 7, type: 'client', name: 'Nora' } as any;

describe('session storage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('restores every persisted session property', async () => {
    await writeSession({
      user,
      token: 'token',
      refreshToken: 'refresh',
      onboardingCompleted: true,
      lastLoginAt: '2026-09-13T00:00:00.000Z',
      sessionExpiresAt: '2026-09-14T00:00:00.000Z',
      biometricEnabled: true,
    });

    await expect(readSession()).resolves.toEqual({
      user,
      token: 'token',
      refreshToken: 'refresh',
      onboardingCompleted: true,
      lastLoginAt: '2026-09-13T00:00:00.000Z',
      sessionExpiresAt: '2026-09-14T00:00:00.000Z',
      biometricEnabled: true,
    });
  });

  it('removes only the authentication session', async () => {
    await writeSession({ user, token: 'token', refreshToken: null, onboardingCompleted: false, lastLoginAt: null, sessionExpiresAt: null, biometricEnabled: false });
    await AsyncStorage.setItem('onboarding_completed', 'true');

    await clearSession();

    await expect(readSession()).resolves.toBeNull();
    await expect(AsyncStorage.getItem('onboarding_completed')).resolves.toBe('true');
  });
});
