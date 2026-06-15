// src/components/AuthInitializer.tsx
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { restoreSession } from '@store/slices/authSlice';
import { fetchUserProfile } from '@store/slices/user.slice';
import { User } from '@store/api/api.types';

const AuthInitializer: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                // Check if we have stored authentication data
                const [
                    storedToken,
                    storedRefreshToken,
                    storedUser,
                    storedOnboardingCompleted,
                    storedLastLoginAt,
                    storedSessionExpiresAt,
                    storedBiometricEnabled,
                ] = await AsyncStorage.multiGet([
                    'auth_token',
                    'refresh_token',
                    'user',
                    'onboarding_completed',
                    'last_login_at',
                    'session_expires_at',
                    'biometric_enabled',
                ]);

                const token = storedToken[1];
                const refreshToken = storedRefreshToken[1];
                const userString = storedUser[1];
                const onboardingCompleted = storedOnboardingCompleted[1] === 'true';
                const lastLoginAt = storedLastLoginAt[1];
                const sessionExpiresAt = storedSessionExpiresAt[1];
                const biometricEnabled = storedBiometricEnabled[1] === 'true';

                // If we have a token and user data, restore the session
                if (token && userString) {
                    const user: User = JSON.parse(userString);

                    // Restore authentication session
                    dispatch(
                        restoreSession({
                            user,
                            token,
                            refreshToken: refreshToken || undefined,
                            onboardingCompleted,
                            lastLoginAt: lastLoginAt || undefined,
                            sessionExpiresAt: sessionExpiresAt || undefined,
                            biometricEnabled,
                        })
                    );

                    // Fetch additional user profile data
                    dispatch(fetchUserProfile(user.id));
                }
            } catch (error) {
                console.error('Failed to initialize authentication:', error);
                // If initialization fails, clear potentially corrupted data
                await AsyncStorage.multiRemove([
                    'auth_token',
                    'refresh_token',
                    'user',
                ]).catch(console.error);
            }
        };

        initializeAuth();
    }, [dispatch]);

    return null; // This component doesn't render anything
};

export default AuthInitializer;