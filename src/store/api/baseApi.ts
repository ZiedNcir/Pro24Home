// src/store/api/baseApi.ts
import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootState } from '../index';
import { logout } from '../slices/authSlice';
import { API_BASE_URL } from '../../config/api';

// Configuration
export { API_BASE_URL } from '../../config/api';

// Custom error type
interface ApiError {
    status: number;
    data: {
        message?: string;
        errors?: Record<string, string[]>;
    };
}

// Create base query with token
const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers, { getState }) => {
        // Get token from AsyncStorage first, then from Redux state
        let token = await AsyncStorage.getItem('auth_token');

        if (!token) {
            const state = getState() as RootState;
            token = state.auth.token;
        }

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        // Set Accept header
        headers.set('Accept', 'application/json');

        return headers;
    },
});

// Custom query with reauth and file handling
export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Handle file uploads - set Content-Type to multipart/form-data
    if (typeof args === 'object' && args.body instanceof FormData) {
        args.headers = {
            ...args.headers,
            'Content-Type': 'multipart/form-data',
        };
    }

    let result = await baseQuery(args, api, extraOptions);

    // Handle 401 Unauthorized
    if (result.error && result.error.status === 401) {
        // Clear token and dispatch logout
        await AsyncStorage.multiRemove(['auth_token', 'user']);
        api.dispatch(logout());

        // You could trigger a navigation to login screen here
        // navigationRef.navigate('Auth');
    }

    // Handle specific error codes
    if (result.error) {
        const error = result.error as ApiError;

        // Transform error messages for display
        if (error.data?.errors) {
            const errorMessages = Object.values(error.data.errors).flat();
            result.error.data = {
                ...error.data,
                formattedMessage: errorMessages.join('\n'),
            };
        }
    }

    return result;
};

// Add retry logic for network errors
const staggeredBaseQuery = retry(baseQueryWithReauth, {
    maxRetries: 3,
    backoff: async (attempt) => {
        const delay = Math.min(1000 * 2 ** attempt, 30000);
        await new Promise(resolve => setTimeout(resolve, delay));
    },
});

// Create API instance
export const api = createApi({
    reducerPath: 'api',
    baseQuery: staggeredBaseQuery,
    tagTypes: [
        'Auth',
        'User',
        'Services',
        'Zones',
        'Addresses',
        'Interventions',
        'Devis',
        'Reclamations',
        'Notifications',
        'Professionals',
        'Payments',
        'Documents',
        'Vehicles',
        'Ratings',
    ],
    endpoints: () => ({}),
    keepUnusedDataFor: 60, // Keep unused data for 1 minute
    refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds
    refetchOnFocus: true,
    refetchOnReconnect: true,
});
