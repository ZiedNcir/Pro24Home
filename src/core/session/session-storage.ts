import AsyncStorage from '@react-native-async-storage/async-storage';

import type { User } from '../../store/api/api.types';

export interface StoredSession {
  user: User;
  token: string;
  refreshToken: string | null;
  onboardingCompleted: boolean;
  lastLoginAt: string | null;
  sessionExpiresAt: string | null;
  biometricEnabled: boolean;
}

const sessionKeys = [
  'auth_token',
  'refresh_token',
  'user',
  'last_login_at',
  'session_expires_at',
] as const;

export const readSession = async (): Promise<StoredSession | null> => {
  const entries = await AsyncStorage.multiGet([
    ...sessionKeys,
    'onboarding_completed',
    'biometric_enabled',
  ]);
  const values = Object.fromEntries(entries);

  if (!values.auth_token || !values.user) return null;

  return {
    user: JSON.parse(values.user) as User,
    token: values.auth_token,
    refreshToken: values.refresh_token || null,
    onboardingCompleted: values.onboarding_completed === 'true',
    lastLoginAt: values.last_login_at || null,
    sessionExpiresAt: values.session_expires_at || null,
    biometricEnabled: values.biometric_enabled === 'true',
  };
};

export const writeSession = async (session: StoredSession): Promise<void> => {
  const entries: Array<[string, string]> = [
    ['auth_token', session.token],
    ['user', JSON.stringify(session.user)],
    ['onboarding_completed', String(session.onboardingCompleted)],
    ['biometric_enabled', String(session.biometricEnabled)],
  ];

  if (session.refreshToken) entries.push(['refresh_token', session.refreshToken]);
  if (session.lastLoginAt) entries.push(['last_login_at', session.lastLoginAt]);
  if (session.sessionExpiresAt) entries.push(['session_expires_at', session.sessionExpiresAt]);

  await AsyncStorage.multiSet(entries);
};

export const clearSession = (): Promise<void> => AsyncStorage.multiRemove([...sessionKeys]);
