import {
  createApi,
  defaultSerializeQueryArgs,
  fetchBaseQuery,
  retry,
} from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { API_BASE_URL } from '../../config/api';
import { readSession, clearSession } from '../session/session-storage';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import i18n from '../../utils/i18n';
import { resolveSupportedLanguage } from '../../utils/locale';

export { API_BASE_URL } from '../../config/api';

const getApiLanguage = () =>
  resolveSupportedLanguage([
    { languageCode: i18n.resolvedLanguage || i18n.language },
  ]);

const withLanguageParam = (args: string | FetchArgs): FetchArgs => {
  const request = typeof args === 'string' ? { url: args } : args;

  return {
    ...request,
    params: {
      ...request.params,
      lang: getApiLanguage(),
    },
  };
};

interface ApiError {
  status: number;
  data: {
    message?: string;
    errors?: Record<string, string[]>;
    formattedMessage?: string;
  };
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token || (await readSession())?.token;

    if (token) headers.set('Authorization', `Bearer ${token}`);

    headers.set('Accept', 'application/json');
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(withLanguageParam(args), api, extraOptions);

  if (result.error?.status === 401) {
    await clearSession();
    api.dispatch(logout());
  }

  if (result.error) {
    const error = result.error as ApiError;

    if (error.data?.errors) {
      error.data.formattedMessage = Object.values(error.data.errors).flat().join('\n');
    }
  }

  return result;
};

const staggeredBaseQuery = retry(baseQueryWithReauth, {
  maxRetries: 3,
  backoff: async attempt => {
    const delay = Math.min(1000 * 2 ** attempt, 30000);
    await new Promise(resolve => setTimeout(resolve, delay));
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: staggeredBaseQuery,
  serializeQueryArgs: ({ endpointName, queryArgs, endpointDefinition }) =>
    `${defaultSerializeQueryArgs({ endpointName, queryArgs, endpointDefinition })}|lang=${getApiLanguage()}`,
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
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});
