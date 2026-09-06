// src/store/api/endpoints/intervention.ts
import { api } from '../baseApi';
import {
    Intervention,
    Devis,
    ApiResponse,
} from '../api.types';
import { normalizeInterventionsResponse } from '../utils/interventionsResponse';

export const interventionEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get All Interventions (Both client and pro)
        getInterventions: builder.query<ApiResponse<Intervention[]>, {
            status?: string;
            type?: 'client' | 'professional';
        }>({
            query: (params = {}) => ({
                url: '/api/get-interventions',
                method: 'GET',
                params,
            }),
            providesTags: ['Interventions'],
            transformResponse: normalizeInterventionsResponse,
        }),

        // Get Single Intervention
        getIntervention: builder.query<Intervention, number>({
            query: (id) => `/api/get-intervention/${id}`,
            providesTags: (result, error, id) => [{ type: 'Interventions', id }],
            transformResponse: (response: any) => response.data || response,
        }),

        // Accept Devis (Client)
        acceptDevis: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/devis/${id}/accept`,
                method: 'GET',
            }),
            invalidatesTags: ['Interventions', 'Devis'],
        }),

        // Revise Devis (Client)
        reviseDevis: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/devis/${id}/revise`,
                method: 'GET',
            }),
            invalidatesTags: ['Interventions', 'Devis'],
        }),

        // Get Devis for Intervention
        getInterventionDevis: builder.query<Devis[], number>({
            query: (interventionId) => ({
                url: `/api/interventions/${interventionId}/devis`,
                method: 'GET',
            }),
            providesTags: ['Devis'],
            transformResponse: (response: any) => response.data || response,
        }),
    }),
});

export const {
    useGetInterventionsQuery,
    useLazyGetInterventionsQuery,
    useGetInterventionQuery,
    useLazyGetInterventionQuery,
    useAcceptDevisMutation,
    useReviseDevisMutation,
    useGetInterventionDevisQuery,
} = interventionEndpoints;
