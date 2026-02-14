// src/store/api/endpoints/reclamation.ts
import { api } from '../baseApi';
import {
    Reclamation,
    CreateReclamationRequest,
    PaginatedResponse,
} from '../api.types';
import { prepareFormData } from '../../../utils/api.helpers';

export const reclamationEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Add Reclamation (Client)
        addClientReclamation: builder.mutation<Reclamation, CreateReclamationRequest>({
            query: (data) => {
                const formData = prepareFormData(
                    {
                        intervention_id: data.intervention_id,
                        motif: data.motif,
                        description: data.description,
                    },
                    data.files ? ['files'] : []
                );

                if (data.files) {
                    data.files.forEach((file, index) => {
                        formData.append(`files[${index + 1}]`, file as any);
                    });
                }

                return {
                    url: '/api/client/reclamations',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Reclamations'],
        }),

        // Add Reclamation (Professional)
        addProfessionalReclamation: builder.mutation<Reclamation, CreateReclamationRequest>({
            query: (data) => {
                const formData = prepareFormData(
                    {
                        intervention_id: data.intervention_id,
                        motif: data.motif,
                        description: data.description,
                    },
                    data.files ? ['files'] : []
                );

                if (data.files) {
                    data.files.forEach((file, index) => {
                        formData.append(`files[${index + 1}]`, file as any);
                    });
                }

                return {
                    url: '/api/professional/reclamations',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Reclamations'],
        }),

        // Get Reclamations (Client)
        getClientReclamations: builder.query<PaginatedResponse<Reclamation>, {
            page?: number;
            per_page?: number;
        }>({
            query: (params = {}) => ({
                url: '/api/client/reclamations',
                method: 'GET',
                params,
            }),
            providesTags: ['Reclamations'],
        }),

        // Get Reclamations (Professional)
        getProfessionalReclamations: builder.query<PaginatedResponse<Reclamation>, {
            page?: number;
            per_page?: number;
        }>({
            query: (params = {}) => ({
                url: '/api/professional/reclamations',
                method: 'GET',
                params,
            }),
            providesTags: ['Reclamations'],
        }),

        // Update Reclamation (Client)
        updateClientReclamation: builder.mutation<Reclamation, {
            id: number;
            motif: string;
            description: string;
            files?: any[];
        }>({
            query: ({ id, ...data }) => {
                const formData = prepareFormData(
                    {
                        motif: data.motif,
                        description: data.description,
                    },
                    data.files ? ['files'] : []
                );

                if (data.files) {
                    data.files.forEach((file, index) => {
                        formData.append(`files[${index + 1}]`, file as any);
                    });
                }

                return {
                    url: `/api/client/reclamations/${id}`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Reclamations'],
        }),

        // Update Reclamation (Professional)
        updateProfessionalReclamation: builder.mutation<Reclamation, {
            id: number;
            motif: string;
            description: string;
            files?: any[];
        }>({
            query: ({ id, ...data }) => {
                const formData = prepareFormData(
                    {
                        motif: data.motif,
                        description: data.description,
                    },
                    data.files ? ['files'] : []
                );

                if (data.files) {
                    data.files.forEach((file, index) => {
                        formData.append(`files[${index + 1}]`, file as any);
                    });
                }

                return {
                    url: `/api/professional/reclamations/${id}`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Reclamations'],
        }),

        // Delete Reclamation (Client)
        deleteClientReclamation: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/reclamations/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reclamations'],
        }),

        // Delete Reclamation (Professional)
        deleteProfessionalReclamation: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/professional/reclamations/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reclamations'],
        }),
    }),
});

export const {
    useAddClientReclamationMutation,
    useAddProfessionalReclamationMutation,
    useGetClientReclamationsQuery,
    useGetProfessionalReclamationsQuery,
    useUpdateClientReclamationMutation,
    useUpdateProfessionalReclamationMutation,
    useDeleteClientReclamationMutation,
    useDeleteProfessionalReclamationMutation,
} = reclamationEndpoints;