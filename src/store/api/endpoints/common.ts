// src/store/api/endpoints/common.ts
import { api } from '../baseApi';
import { Zone } from '../api.types';

export const commonEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get Zones
        getZones: builder.query<Zone[], void>({
            query: () => '/api/get-zones',
            providesTags: ['Zones'],
            transformResponse: (response: any) => response.data || response,
        }),

        // Get App Configuration
        getAppConfig: builder.query<{
            version: string;
            min_version: string;
            maintenance: boolean;
            features: Record<string, boolean>;
        }, void>({
            query: () => '/api/config',
            providesTags: ['Zones'],
        }),

        // Upload File (Generic)
        uploadFile: builder.mutation<{ url: string; path: string }, {
            file: any;
            type: 'image' | 'pdf' | 'document';
            folder?: string;
        }>({
            query: (data) => {
                const formData = new FormData();
                formData.append('file', data.file as any);
                formData.append('type', data.type);
                if (data.folder) {
                    formData.append('folder', data.folder);
                }

                return {
                    url: '/api/upload',
                    method: 'POST',
                    body: formData,
                };
            },
        }),
    }),
});

export const {
    useGetZonesQuery,
    useGetAppConfigQuery,
    useUploadFileMutation,
} = commonEndpoints;