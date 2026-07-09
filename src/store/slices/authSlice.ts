// src/store/slices/auth.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Client, Professional } from '../api/api.types';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isInitialized: boolean;
    isLoading: boolean;
    error: string | null;
    userType: 'client' | 'professional' | null;
    onboardingCompleted: boolean;
    lastLoginAt: string | null;
    sessionExpiresAt: string | null;
    biometricEnabled: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isInitialized: false,
    isLoading: false,
    error: null,
    userType: null,
    onboardingCompleted: false,
    lastLoginAt: null,
    sessionExpiresAt: null,
    biometricEnabled: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Set credentials after successful login/register
        setCredentials: (
            state,
            action: PayloadAction<{
                user: User;
                token: string;
                refreshToken?: string;
                rememberMe?: boolean;
            }>
        ) => {
            if (!action.payload.user) {
                console.error('setCredentials: user is undefined');
                return;
            }
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken || null;
            state.isAuthenticated = true;
            state.userType = action.payload.user.type;
            state.error = null;
            state.isLoading = false;
            state.lastLoginAt = new Date().toISOString();

            // Set session expiry (7 days if rememberMe, 1 day otherwise)
            const expiryDays = action.payload.rememberMe ? 7 : 1;
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + expiryDays);
            state.sessionExpiresAt = expiryDate.toISOString();

            // Save to AsyncStorage
            const storageItems: [string, string][] = [
                ['auth_token', action.payload.token],
                ['user', JSON.stringify(action.payload.user)],
                ['last_login_at', state.lastLoginAt],
                ['session_expires_at', state.sessionExpiresAt],
            ];

            if (action.payload.refreshToken) {
                storageItems.push(['refresh_token', action.payload.refreshToken]);
            }

            AsyncStorage.multiSet(storageItems).catch(console.error);
        },

        // Logout user
        logout: (state) => {
            // Clear state
            Object.assign(state, {
                ...initialState,
                isInitialized: true,
                biometricEnabled: state.biometricEnabled,
                onboardingCompleted: state.onboardingCompleted,
            });

            // Clear AsyncStorage (except onboarding and biometric)
            AsyncStorage.multiRemove([
                'auth_token',
                'refresh_token',
                'user',
                'last_login_at',
                'session_expires_at',
            ]).catch(console.error);
        },

        // Restore session from storage
        restoreSession: (
            state,
            action: PayloadAction<{
                user: User;
                token: string;
                refreshToken?: string;
                onboardingCompleted?: boolean;
                lastLoginAt?: string;
                sessionExpiresAt?: string;
                biometricEnabled?: boolean;
            }>
        ) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken || null;
            state.isAuthenticated = true;
            state.userType = action.payload.user.type;
            state.isInitialized = true;
            state.onboardingCompleted = action.payload.onboardingCompleted || false;
            state.lastLoginAt = action.payload.lastLoginAt || null;
            state.sessionExpiresAt = action.payload.sessionExpiresAt || null;
            state.biometricEnabled = action.payload.biometricEnabled || false;
            state.error = null;
        },

        // Mark auth initialization completed when there is no stored session
        markInitialized: (state) => {
            state.isInitialized = true;
        },

        // Update user profile
        updateUserProfile: (
            state,
            action: PayloadAction<Partial<Client> | Partial<Professional>>
        ) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload } as User;
                AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
            }
        },

        // Update tokens
        updateTokens: (
            state,
            action: PayloadAction<{ token: string; refreshToken?: string }>
        ) => {
            state.token = action.payload.token;
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
                AsyncStorage.setItem('refresh_token', action.payload.refreshToken).catch(console.error);
            }
            AsyncStorage.setItem('auth_token', action.payload.token).catch(console.error);
        },

        // Clear tokens (for refresh token failure)
        clearTokens: (state) => {
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            AsyncStorage.multiRemove(['auth_token', 'refresh_token']).catch(console.error);
        },

        // Set loading state
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Set error state
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        // Complete onboarding
        completeOnboarding: (state) => {
            state.onboardingCompleted = true;
            AsyncStorage.setItem('onboarding_completed', 'true').catch(console.error);
        },

        // Toggle biometric auth
        toggleBiometricAuth: (state) => {
            state.biometricEnabled = !state.biometricEnabled;
            AsyncStorage.setItem(
                'biometric_enabled',
                state.biometricEnabled ? 'true' : 'false'
            ).catch(console.error);
        },

        // Extend session
        extendSession: (state, action: PayloadAction<number>) => {
            if (state.sessionExpiresAt) {
                const expiryDate = new Date(state.sessionExpiresAt);
                const hoursToAdd = action.payload || 2;
                expiryDate.setHours(expiryDate.getHours() + hoursToAdd);
                state.sessionExpiresAt = expiryDate.toISOString();
                AsyncStorage.setItem('session_expires_at', state.sessionExpiresAt).catch(console.error);
            }
        },

        // Update notification token
        updateNotificationToken: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.onesignal_key = action.payload;
                AsyncStorage.setItem('user', JSON.stringify(state.user)).catch(console.error);
            }
        },
    },
});

export const {
    setCredentials,
    logout,
    restoreSession,
    markInitialized,
    updateUserProfile,
    updateTokens,
    clearTokens,
    setLoading,
    setError,
    completeOnboarding,
    toggleBiometricAuth,
    extendSession,
    updateNotificationToken,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
    state.auth.isAuthenticated;
export const selectUserType = (state: { auth: AuthState }) => state.auth.userType;
export const selectIsClient = (state: { auth: AuthState }) =>
    state.auth.userType === 'client';
export const selectIsProfessional = (state: { auth: AuthState }) =>
    state.auth.userType === 'professional';
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectIsInitialized = (state: { auth: AuthState }) =>
    state.auth.isInitialized;
export const selectHasCompletedOnboarding = (state: { auth: AuthState }) =>
    state.auth.onboardingCompleted;
export const selectSessionExpiry = (state: { auth: AuthState }) =>
    state.auth.sessionExpiresAt;
export const selectBiometricEnabled = (state: { auth: AuthState }) =>
    state.auth.biometricEnabled;

export default authSlice.reducer;