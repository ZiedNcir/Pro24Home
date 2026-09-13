import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';

import {
  clearSession,
  writeSession,
  writeSessionPreferences,
} from '../../core/session/session-storage';
import type { AuthState } from '../../store/slices/authSlice';
import {
  clearTokens,
  completeOnboarding,
  extendSession,
  logout,
  setCredentials,
  toggleBiometricAuth,
  updateNotificationToken,
  updateTokens,
  updateUserProfile,
} from '../../store/slices/authSlice';

type StateWithAuth = { auth: AuthState };

export const sessionPersistenceMiddleware = createListenerMiddleware();

let persistenceQueue: Promise<void> = Promise.resolve();

const enqueuePersistence = (operation: () => Promise<void>) => {
  persistenceQueue = persistenceQueue.then(operation, operation).catch(() => undefined);
  return persistenceQueue;
};

const persistAuthState = async (state: StateWithAuth) => {
  const { auth } = state;

  if (!auth.user || !auth.token) {
    await writeSessionPreferences(auth);
    return;
  }

  await writeSession({
    user: auth.user,
    token: auth.token,
    refreshToken: auth.refreshToken,
    onboardingCompleted: auth.onboardingCompleted,
    lastLoginAt: auth.lastLoginAt,
    sessionExpiresAt: auth.sessionExpiresAt,
    biometricEnabled: auth.biometricEnabled,
  });
};

sessionPersistenceMiddleware.startListening({
  matcher: isAnyOf(
    setCredentials,
    updateUserProfile,
    updateTokens,
    completeOnboarding,
    toggleBiometricAuth,
    extendSession,
    updateNotificationToken,
  ),
  effect: async (_, listenerApi) =>
    enqueuePersistence(() => persistAuthState(listenerApi.getState() as StateWithAuth)),
});

sessionPersistenceMiddleware.startListening({
  matcher: isAnyOf(logout, clearTokens),
  effect: async () => enqueuePersistence(clearSession),
});
