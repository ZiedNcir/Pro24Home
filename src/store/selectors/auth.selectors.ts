import type { RootState } from '../index';
import { UserType } from '../api/api.types';

export const selectAuthState = (state: RootState) => state.auth;

export const selectCurrentUser = (state: RootState) =>
  state.auth.user;

export const selectEffectiveUserProfile = (state: RootState) =>
  state.user.profile ?? state.auth.user;

export const selectAuthToken = (state: RootState) =>
  state.auth.token;

export const selectRefreshToken = (state: RootState) =>
  state.auth.refreshToken;

export const selectUserType = (state: RootState) =>
  state.auth.userType;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated && Boolean(state.auth.token);

export const selectIsInitialized = (state: RootState) =>
  state.auth.isInitialized;

export const selectIsClient = (state: RootState) =>
  state.auth.userType === UserType.CLIENT;

export const selectIsProfessional = (state: RootState) =>
  state.auth.userType === UserType.PROFESSIONAL;

export const selectCurrentClientInfo = (state: RootState) =>
  state.auth.user?.client ?? null;

export const selectCurrentProfessionalInfo = (state: RootState) =>
  state.auth.user?.professional ?? null;

export const selectCurrentUserDocuments = (state: RootState) =>
  state.auth.user?.documents ?? [];

export const selectCurrentUserAddresses = (state: RootState) =>
  state.auth.user?.address ?? [];

export const selectCurrentUserVehicles = (state: RootState) =>
  state.auth.user?.vehicles ?? [];

export const selectCurrentProfessionalServices = (state: RootState) =>
  state.auth.user?.professional?.services ?? [];

export const selectIsUserVerified = (state: RootState) =>
  Boolean(state.auth.user?.is_verified);

export const selectIsUserActive = (state: RootState) =>
  Boolean(state.auth.user?.is_active);

export const selectNotificationsEnabled = (state: RootState) =>
  Boolean(state.auth.user?.notifications_enabled);

export const selectHasCompletedOnboarding = (state: RootState) =>
  state.auth.onboardingCompleted;

export const selectAuthLoading = (state: RootState) =>
  state.auth.isLoading;

export const selectAuthError = (state: RootState) =>
  state.auth.error;

export const selectSessionExpiresAt = (state: RootState) =>
  state.auth.sessionExpiresAt;

export const selectBiometricEnabled = (state: RootState) =>
  state.auth.biometricEnabled;
