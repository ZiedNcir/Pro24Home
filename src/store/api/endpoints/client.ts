// src/store/api/endpoints/client.ts
import { api } from '../baseApi';
import {
    Client,
    Address,
    Professional,
    CreateInterventionRequest,
    CreateRatingRequest,
    Rating,
} from '../api.types';
import { prepareFormData } from '../../../utils/api.helpers';
import { normalizeAddressesResponse } from '../response.utils';

export const clientEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Update Client Profile
        updateClientProfile: builder.mutation<Client, Partial<{
            first_name: string;
            last_name: string;
            address: string;
            postal_code: string;
            onesignal_key: string;
        }>>({
            query: (data) => ({
                url: '/api/client/update-profil',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['User'],
        }),

        // Add Address
        addAddress: builder.mutation<Address, {
            latitude: number;
            longitude: number;
            address: string;
            location_name: string;
            details?: string;
            phone: string;
            code_maison?: string;
            zone_id: number;
            type: 'maison' | 'appartement' | 'entreprise' | 'hotel';
            floor?: string;
            hotel_name?: string;
            company_name?: string;
        }>({
            query: (data) => ({
                url: '/api/client/address',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['Addresses'],
        }),

        // Get Addresses
        getAddresses: builder.query<Address[], void>({
            query: () => '/api/client/address',
            providesTags: ['Addresses'],
            transformResponse: normalizeAddressesResponse<Address>,
        }),

        // Delete Address
        deleteAddress: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/address/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Addresses'],
        }),

        // Find Professionals by Address
        findProfessionalsByAddress: builder.mutation<Professional[], {
            latitude: number;
            longitude: number;
            service_id: number;
        }>({
            query: (data) => ({
                url: '/api/client/professionels/adress',
                method: 'POST',
                body: prepareFormData(data),
            }),
            transformResponse: (response: any) => response.data || response,
        }),

        // Find Professionals by Zone
        findProfessionalsByZone: builder.query<Professional[], {
            zoneId: number;
            latitude: number;
            longitude: number;
            distance: number;
        }>({
            query: ({ zoneId, ...params }) => ({
                url: `/api/client/professionels/zone/${zoneId}`,
                method: 'GET',
                params,
            }),
            transformResponse: (response: any) => response.data || response,
        }),

        // Add Rating
        addRating: builder.mutation<Rating, CreateRatingRequest>({
            query: (data) => ({
                url: '/api/client/rating',
                method: 'POST',
                body: prepareFormData(data),
            }),
            invalidatesTags: ['Ratings', 'Interventions'],
        }),

        // Add Intervention (Client)
        addIntervention: builder.mutation<any, CreateInterventionRequest>({
            query: (data) => {
                const formData = prepareFormData(
                    {
                        service_id: data.service_id,
                        adresse_id: data.address_id,
                        title: data.title,
                        description: data.description,
                        price: data.price || '',
                    },
                    ['image_1', 'image_2', 'image_3']
                );

                if (data.image_1) {
                    formData.append('image_1', data.image_1 as any);
                }
                if (data.image_2) {
                    formData.append('image_2', data.image_2 as any);
                }
                if (data.image_3) {
                    formData.append('image_3', data.image_3 as any);
                }
                console.log('formData', formData);
                return {
                    url: '/api/client/interventions',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Interventions'],
        }),

        // Cancel Intervention
        cancelIntervention: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/interventions/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: ['Interventions'],
        }),

        // Delete Intervention
        deleteIntervention: builder.mutation<{ message: string }, number>({
            query: (id) => ({
                url: `/api/client/interventions/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Interventions'],
        }),
    }),
});

export const {
    useUpdateClientProfileMutation,
    useAddAddressMutation,
    useGetAddressesQuery,
    useDeleteAddressMutation,
    useFindProfessionalsByAddressMutation,
    useFindProfessionalsByZoneQuery,
    useAddRatingMutation,
    useAddInterventionMutation,
    useCancelInterventionMutation,
    useDeleteInterventionMutation,
} = clientEndpoints;
