import type {
    ApiResponse,
    AuthResponse,
    User,
    RegisterClientRequest,
    RegisterProfessionalRequest,
    LoginRequest,
    VerificationRequest,
    ChangePasswordRequest,
    Service,
} from '../api.types';
import { api } from '../baseApi';

export const authApiEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Login endpoint
        login: builder.mutation<AuthResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Dispatch setCredentials action with the response data
                    dispatch({
                        type: 'auth/setCredentials',
                        payload: {
                            user: data.user,
                            token: data.token,
                            // Your API returns token in AuthResponse, adjust if needed
                            refreshToken: '', // Add if your API returns refresh token
                            rememberMe: true, // Add if your login request includes rememberMe
                        },
                    });
                } catch (error) {
                    // Handle error in the component or use setError
                    console.error('Login failed:', error);
                }
            },
        }),

        // Register client endpoint
        registerClient: builder.mutation<AuthResponse, RegisterClientRequest>({
            query: (userData) => ({
                url: '/register-client',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Dispatch setCredentials after successful registration
                    dispatch({
                        type: 'auth/setCredentials',
                        payload: {
                            user: data.user,
                            token: data.token,
                        },
                    });
                } catch (error) {
                    console.error('Client registration failed:', error);
                }
            },
        }),

        // Register professional endpoint
        registerProfessional: builder.mutation<AuthResponse, RegisterProfessionalRequest>({
            query: (userData) => ({
                url: '/register-professional',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Dispatch setCredentials after successful registration
                    dispatch({
                        type: 'auth/setCredentials',
                        payload: {
                            user: data.user,
                            token: data.token,
                        },
                    });
                } catch (error) {
                    console.error('Professional registration failed:', error);
                }
            },
        }),

        // Logout endpoint
        logout: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
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
                url: '/register-verification',
                method: 'POST',
                body: verificationData,
            }),
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
                url: '/resend-verification',
                method: 'POST',
                body: emailData,
            }),
        }),

        // Forgot password endpoint
        forgotPassword: builder.mutation<ApiResponse<void>, { email: string }>({
            query: (emailData) => ({
                url: '/forgot-password',
                method: 'POST',
                body: emailData,
            }),
        }),

        // Reset password endpoint
        resetPassword: builder.mutation<ApiResponse<void>, {
            token: string;
            password: string;
            password_confirmation: string
        }>({
            query: (passwordData) => ({
                url: '/reset-password',
                method: 'POST',
                body: passwordData,
            }),
        }),

        // Change password (authenticated user)
        changePassword: builder.mutation<ApiResponse<void>, ChangePasswordRequest>({
            query: (passwordData) => ({
                url: '/change-password',
                method: 'POST',
                body: passwordData,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Get current user profile
        getProfile: builder.query<ApiResponse<User>, void>({
            query: () => '/profile',
            providesTags: ['User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data) {
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
                url: '/profile',
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
                url: '/profile/notification-token',
                method: 'PUT',
                body: tokenData,
            }),
            async onQueryStarted({ onesignal_key }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    // Update notification token in store
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
                url: '/get-services',
                method: 'GET',
                params: {
                    lang: params.lang || 'fr',
                },
            }),
            providesTags: ['Services'],



            // Transforme la réponse de l'API
            transformResponse: (response: any): ApiResponse<Service[]> => {
                // Vérifier si c'est déjà un ApiResponse
                if (response && typeof response === 'object' && 'success' in response) {
                    return response as ApiResponse<Service[]>;
                }

                // Essayer d'extraire les données de différentes structures
                let services: Service[] = [];
                let message = '';
                let success = false;

                // Structure 1: { services: [...] }
                if (response?.services && Array.isArray(response.services)) {
                    services = response.services;
                    success = true;
                }


                else {
                    message = 'Invalid response format';
                    success = false;
                }

                // 🔥 RETOURNER TOUJOURS UN OBJET ApiResponse COMPLET 🔥
                return {
                    success,
                    data: services,
                    message: success ? 'Services fetched successfully' : message,
                    // Inclure les métadonnées si disponibles
                    meta: response?.meta || undefined,
                };
            },

            // Gérer les erreurs de transformation
            transformErrorResponse: (response: any): ApiResponse<Service[]> => {
                // 🔥 IMPORTANT: Toujours retourner un ApiResponse, même pour les erreurs
                return {
                    success: false,
                    data: [],
                    message: response?.data?.message || response?.message || 'Failed to fetch services',
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
