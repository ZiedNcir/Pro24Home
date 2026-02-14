// src/store/api/endpoints/intervention.ts
import { api } from '../baseApi';
import {
    Intervention,
    Devis,
    PaginatedResponse,
} from '../api.types';

export const interventionEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get All Interventions (Both client and pro)
        getInterventions: builder.query<PaginatedResponse<Intervention>, {
            page?: number;
            per_page?: number;
            status?: string;
            type?: 'client' | 'professional';
        }>({
            query: (params = {}) => ({
                url: '/api/get-interventions',
                method: 'GET',
                params,
            }),
            providesTags: ['Interventions'],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newItems) => {
                if (newItems.meta.current_page === 1) {
                    return newItems;
                }

                return {
                    ...newItems,
                    data: [...(currentCache?.data || []), ...newItems.data],
                };
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
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

        // Get Intervention Price
        getInterventionPrice: builder.query<{ price: number }, void>({
            query: () => '/api/get-intervention-price',
            providesTags: ['Interventions'],
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
    useGetInterventionPriceQuery,
    useGetInterventionDevisQuery,
} = interventionEndpoints;