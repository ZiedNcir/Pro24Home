import { restoreSession } from '../../store/slices/authSlice';
import { readSession } from './session-storage';

type Dispatch = (action: unknown) => unknown;

export const restoreStoredSession = async (dispatch: Dispatch): Promise<void> => {
  const session = await readSession();
  if (!session) return;

  dispatch(
    restoreSession({
      user: session.user,
      token: session.token,
      refreshToken: session.refreshToken || undefined,
      onboardingCompleted: session.onboardingCompleted,
      lastLoginAt: session.lastLoginAt || undefined,
      sessionExpiresAt: session.sessionExpiresAt || undefined,
      biometricEnabled: session.biometricEnabled,
    }),
  );
};
