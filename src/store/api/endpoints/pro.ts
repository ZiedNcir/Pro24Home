// src/store/api/endpoints/pro.ts
import { api } from '../baseApi';
import {
    Professional,
    Vehicle,
    Document,
    DocumentType,
} from '../api.types';
import { prepareFormData } from '../../../utils/api.helpers';

export const professionalEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Upload Document
        uploadDocument: builder.mutation<Document, {
            file: any;
            type: 'pdf' | 'img';
            name: DocumentType;
        }>({
            query: (data) => {
                const formData = prepareFormData(
                    {
                        type: data.type,
                        name: data.name,
                    },
                    ['file']
                );

                formData.append('file', data.file as any);

                return {
                    url: '/api/professional/upload-document',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Documents', 'User'],
        }),

        // Download Document
        downloadDocument: builder.query<Blob, DocumentType>({
            query: (name) => ({
                url: `/api/professional/download-document/${name}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
                cache: 'no-cache',
            }),
            providesTags: (result, error, name) => [{ type: 'Documents', id: name }],
        }),

        // Update Vehicles
        updateVehicle: builder.mutation<{ message: string }, { vehicles: Vehicle[] }>({
            query: (data) => ({
                url: '/api/professional/upload-vehicle',
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            }),
            invalidatesTags: ['Vehicles', 'User'],
        }),

        // Update Professional Profile
        updateProProfile: builder.mutation<Professional, Partial<{
            first_name: string;
            last_name: string;
            postal_code: string;
            onesignal_key: string;
            address: string;
            company_name: string;
            services: number[];
            zone_id: number;
        }>>({
            query: (data) => ({
                url: '/api/professional/update-profil',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['User'],
        }),

        // Update Zone
        updateZone: builder.mutation<{ message: string }, { zone_id: number }>({
            query: (data) => ({
                url: '/api/professional/zone-professional',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['User'],
        }),

        // Update Notifications
        updateNotifications: builder.mutation<{ message: string }, { notifications_enabled: 0 | 1 }>({
            query: (data) => ({
                url: '/api/professional/notifications',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['User'],
        }),

        // Update Status (Online/Offline)
        updateStatus: builder.mutation<{ message: string }, {
            online: 0 | 1;
            latitude: number;
            longitude: number;
        }>({
            query: (data) => ({
                url: '/api/professional/update-status',
                method: 'POST',
                body: prepareFormData({
                    onligne: data.online,
                    latitude: data.latitude,
                    longitude: data.longitude,
                }),
            }),
            invalidatesTags: ['User'],
        }),

        // Toggle Online Status with State Update
        toggleOnlineStatus: builder.mutation<ApiResponse<Professional>, { online: boolean }>({
            query: (statusData) => ({
                url: '/professional/toggle-online',
                method: 'POST',
                body: statusData,
            }),
            invalidatesTags: ['User'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.data) {
                        dispatch({
                            type: 'auth/updateUserProfile',
                            payload: { online_status: (data.data as Professional).online_status },
                        });
                    }
                } catch (error) {
                    console.error('Failed to toggle online status:', error);
                }
            },
        }),


        // Accept Intervention
        acceptIntervention: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/professional/interventions/${id}/accept`,
                method: 'GET',
            }),
            invalidatesTags: ['Interventions', 'Devis'],
        }),

        // Revise Intervention
        reviseIntervention: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/professional/interventions/${id}/revise`,
                method: 'GET',
            }),
            invalidatesTags: ['Interventions', 'Devis'],
        }),

        // Add Devis
        addDevis: builder.mutation<any, { interventionId: number; price: number }>({
            query: ({ interventionId, price }) => ({
                url: `/api/professional/interventions/add-devis/${interventionId}`,
                method: 'POST',
                body: prepareFormData({ price }),
            }),
            invalidatesTags: ['Interventions', 'Devis'],
        }),

        // Update Intervention Status
        updateInterventionStatus: builder.mutation<{ message: string }, {
            interventionId: number;
            status: 'in progress' | 'rejected' | 'completed';
        }>({
            query: ({ interventionId, status }) => ({
                url: `/api/professional/interventions/${interventionId}/update-status`,
                method: 'POST',
                body: prepareFormData({ status }),
            }),
            invalidatesTags: ['Interventions'],
        }),
    }),
});

export const {
    useUploadDocumentMutation,
    useDownloadDocumentQuery,
    useLazyDownloadDocumentQuery,
    useUpdateVehicleMutation,
    useUpdateProProfileMutation,
    useUpdateZoneMutation,
    useUpdateNotificationsMutation,
    useUpdateStatusMutation,
    useAcceptInterventionMutation,
    useReviseInterventionMutation,
    useAddDevisMutation,
    useToggleOnlineStatusMutation,
    useUpdateInterventionStatusMutation,
} = professionalEndpoints;