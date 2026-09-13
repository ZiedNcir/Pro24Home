import AsyncStorage from '@react-native-async-storage/async-storage';
import { restoreStoredSession } from '@core/session/session-service';
import { writeSession } from '@core/session/session-storage';

const user = { id: 7, type: 'client', name: 'Nora' } as any;

describe('restoreStoredSession', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('restores persisted credentials into the auth state', async () => {
    await writeSession({ user, token: 'token', refreshToken: null, onboardingCompleted: true, lastLoginAt: null, sessionExpiresAt: null, biometricEnabled: false });
    const dispatch = jest.fn();

    await restoreStoredSession(dispatch);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'auth/restoreSession',
      payload: expect.objectContaining({ user, token: 'token', onboardingCompleted: true }),
    }));
  });

  it('does not dispatch when no session exists', async () => {
    const dispatch = jest.fn();

    await restoreStoredSession(dispatch);

    expect(dispatch).not.toHaveBeenCalled();
  });
});
