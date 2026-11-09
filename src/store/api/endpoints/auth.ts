import { normalizeAuthResponse } from '../utils/authResponse';
import { acceptApiResponse } from '../../../core/api/status';
import { isUnverifiedAccount } from '../../../entities/user/model/account-status';
import { prepareFormData } from '../../../utils/api.helpers';
import type { RootState } from '../..';
import {
    ApiResponse,
    AuthResponse,
    User,
    UserType,
    RegisterClientRequest,
    RegisterProfessionalRequest,
    LoginRequest,
    VerificationRequest,
    ChangePasswordRequest,
    Service,
} from '../api.types';
import { api } from '../baseApi';
import { normalizeServicesResponse } from '../utils/servicesResponse';

export const authApiEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/api/login',
                method: 'POST',
                body: credentials,
                validateStatus: acceptApiResponse,
            }),
            transformResponse: normalizeAuthResponse,
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if ((isUnverifiedAccount(data) && data.user?.type !== UserType.PROFESSIONAL) || !data.user?.id || typeof data.access_token !== 'string' || !data.access_token.trim()) return;
                    // Dispatch setCredentials action with the response data
                    dispatch({
                        type: 'auth/setCredentials',
                        payload: {
                            user: data.user,
                            token: data.access_token,
                            // Your API returns token in AuthResponse, adjust if needed
                            refreshToken: '', // Add if your API returns refresh token
                            rememberMe: true, // Add if your login request includes rememberMe
                        },
                    });

                } catch {
                    // The sign-in screen handles rejected and inactive-account responses.
                }
            },
        }),

        // Register client endpoint
        registerClient: builder.mutation<AuthResponse, RegisterClientRequest>({
            query: (userData) => ({
                url: '/api/register-client',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Only dispatch setCredentials if we have user data
                    if (data.user) {
                        // Dispatch setCredentials after successful registration
                        dispatch({
                            type: 'auth/setCredentials',
                            payload: {
                                user: { ...data.user, type: UserType.CLIENT },
                                token: data.access_token,
                            },
                        });

                    } else {
                        console.warn('Registration response missing user data:', data);
                    }
                } catch (error) {
                    console.error('Client registration failed:', error);
                }
            },
        }),

        // Registration remains unauthenticated until verification and sign-in.
        registerProfessional: builder.mutation<AuthResponse, RegisterProfessionalRequest>({
            query: (userData) => ({
                url: '/api/register-professional',
                method: 'POST',
                body: prepareFormData(userData as unknown as Record<string, unknown>),
                validateStatus: acceptApiResponse,
            }),
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ['Auth'],
        }),

        // Logout endpoint
        logout: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/api/logout',
                method: 'GET',
            }),
            invalidatesTags: ['Auth', 'User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Dispatch logout action to clear state
                    dispatch({ type: 'auth/logout' });
                } catch (error) {
                    // Even if API call fails, clear local auth state
                    dispatch({ type: 'auth/logout' });
                    console.error('Logout failed:', error);
                }
            },
        }),

        // Verify email/phone endpoint
        verifyAccount: builder.mutation<ApiResponse<User>, VerificationRequest>({
            query: (verificationData) => ({
                url: '/api/register-verification',
                method: 'POST',
                body: prepareFormData(verificationData as unknown as Record<string, unknown>),
                validateStatus: acceptApiResponse,
            }),
            extraOptions: { maxRetries: 0 },
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data) {
                        // Update user profile with verification status
                        dispatch({
                            type: 'auth/updateUserProfile',
                            payload: data.data,
                        });
                    }
                } catch (error) {
                    console.error('Verification failed:', error);
                }
            },
        }),

        // Resend verification code
        resendVerification: builder.mutation<ApiResponse<void>, { email: string }>({
            query: (emailData) => ({
                url: '/api/resend-verification',
                method: 'POST',
                body: prepareFormData(emailData),
                validateStatus: acceptApiResponse,
            }),
            extraOptions: { maxRetries: 0 },
        }),

        // Forgot password endpoint
        forgotPassword: builder.mutation<ApiResponse<void>, { phone_number: string }>({
            query: (phoneData) => ({
                url: '/api/forgot-password',
                method: 'POST',
                body: phoneData,
            }),
        }),

        // Reset password endpoint
        resetPassword: builder.mutation<ApiResponse<void>, {
            token: string;
            password: string;
            password_confirmation: string
        }>({
            query: (passwordData) => ({
                url: '/api/reset-password',
                method: 'POST',
                body: passwordData,
            }),
        }),

        // Change password (authenticated user)
        changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
            query: (passwordData) => ({
                url: '/api/change-password',
                method: 'POST',
                body: passwordData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Get current user profile
        getProfile: builder.query<ApiResponse<User>, void>({
            query: () => ({ url: '/api/profile', method: 'GET', validateStatus: acceptApiResponse }),
            providesTags: ['User'],
            async onQueryStarted(_, { dispatch, getState, queryFulfilled }) {
                const session = (getState() as RootState).auth;
                const userId = session.user?.id;
                const token = session.token;
                try {
                    const { data } = await queryFulfilled;
                    const current = (getState() as RootState).auth;
                    if (data.data && current.user?.id === userId && current.token === token && data.data.id === userId) {
                        // Update user profile in store
                        dispatch({
                            type: 'auth/updateUserProfile',
                            payload: data.data,
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            },
        }),

        // Update user profile
        updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
            query: (userData) => ({
                url: '/api/profile',
                method: 'PUT',
                body: userData,
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data) {
                        // Update user in store
                        dispatch({
                            type: 'auth/updateUserProfile',
                            payload: data.data,
                        });
                    }
                } catch (error) {
                    console.error('Profile update failed:', error);
                }
            },
        }),

        // Update notification token (OneSignal)
        updateNotificationToken: builder.mutation<ApiResponse<void>, { onesignal_key: string }>({
            query: (tokenData) => ({
                url: '/api/update-oneSignal_id',
                method: 'POST',
                body: prepareFormData(tokenData),
            }),
            extraOptions: { maxRetries: 0 },
            async onQueryStarted({ onesignal_key }, { dispatch, getState, queryFulfilled }) {
                const session = (getState() as RootState).auth;
                const userId = session.user?.id;
                const token = session.token;
                try {
                    const { data } = await queryFulfilled;
                    const current = (getState() as RootState).auth;
                    if (data?.success === false || current.user?.id !== userId || current.token !== token) return;
                    // Only persist acknowledgment for the account that sent the request.
                    dispatch({
                        type: 'auth/updateNotificationToken',
                        payload: onesignal_key,
                    });
                } catch (error) {
                    console.error('Failed to update notification token:', error);
                }
            },
        }),
        // Get Services avec sérialisation complète
        getServices: builder.query<ApiResponse<Service[]>, {
            lang?: string;
        }>({
            query: (params) => ({
                url: '/api/get-services',
                method: 'GET',
                params: {
                    lang: params.lang || 'fr',
                },
            }),
            providesTags: ['Services'],



            // Transforme la réponse de l'API
            transformResponse: normalizeServicesResponse,

            // Gérer les erreurs de transformation
            transformErrorResponse: (response: any): ApiResponse<Service[]> => {
                // 🔥 IMPORTANT: Toujours retourner un ApiResponse, même pour les erreurs
                return {
                    success: false,
                    data: [],
                    message: response?.data?.message || response?.message,
                    errors: response?.data?.errors,
                };
            },

            // 🔥 AJOUTER CES OPTIONS POUR ÉVITER LES PROBLÈMES DE SÉRIALISATION 🔥
            keepUnusedDataFor: 300, // 5 minutes
            serializeQueryArgs: ({ queryArgs }) => {
                // Sérialiser les arguments pour le cache
                const { lang = 'fr' } = queryArgs || {};
                return `services-${lang}`;
            },
        }),
    })
});

// Export hooks for usage in functional components
export const {
    useLoginMutation,
    useRegisterClientMutation,
    useRegisterProfessionalMutation,
    useLogoutMutation,
    useVerifyAccountMutation,
    useResendVerificationMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useChangePasswordMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useUpdateNotificationTokenMutation,
    useGetServicesQuery
} = authApiEndpoints;
