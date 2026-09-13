import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';

import { sessionPersistenceMiddleware } from '@app/store/session-persistence';
import { readSession } from '@core/session/session-storage';
import authReducer, {
  completeOnboarding,
  logout,
  setCredentials,
} from '@store/slices/authSlice';

const user = { id: 7, type: 'client', name: 'Nora' } as any;

const createStore = () =>
  configureStore({
    reducer: { auth: authReducer },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().prepend(sessionPersistenceMiddleware.middleware),
  });

const waitForEffects = () => new Promise(resolve => setTimeout(resolve, 0));

describe('auth session persistence', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists credentials and preferences outside the reducer', async () => {
    const store = createStore();

    store.dispatch(setCredentials({ user, token: 'token', refreshToken: 'refresh' }));
    store.dispatch(completeOnboarding());
    await waitForEffects();

    await expect(readSession()).resolves.toMatchObject({
      user,
      token: 'token',
      refreshToken: 'refresh',
      onboardingCompleted: true,
    });
  });

  it('clears only credentials when the user logs out', async () => {
    const store = createStore();
    store.dispatch(setCredentials({ user, token: 'token' }));
    store.dispatch(completeOnboarding());
    await waitForEffects();

    store.dispatch(logout());
    await waitForEffects();

    await expect(readSession()).resolves.toBeNull();
    await expect(AsyncStorage.getItem('onboarding_completed')).resolves.toBe('true');
  });
});
