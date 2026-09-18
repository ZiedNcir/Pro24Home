// src/store/api/endpoints/notification.ts
import { api } from '../baseApi';
import {
    Notification,
    PaginatedResponse,
} from '../api.types';

const normalizeNotificationsResponse = (response: unknown): PaginatedResponse<Notification> => {
    const raw = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data) ? (response as any).data : [];

    return {
        data: raw.map((item: any) => ({
            id: String(item.id),
            user_id: item.notifiable_id,
            title: item.data?.title || 'Notification',
            message: item.data?.message || '',
            type: item.type || 'system',
            data: item.data,
            read: item.read_at !== null && item.read_at !== undefined,
            read_at: item.read_at,
            created_at: item.created_at,
        })),
        meta: (response as any)?.meta || { current_page: 1, from: raw.length ? 1 : 0, last_page: 1, links: [], path: '', per_page: raw.length, to: raw.length, total: raw.length },
    };
};

export const notificationEndpoints = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get Notifications
        getNotifications: builder.query<PaginatedResponse<Notification>, {
            page?: number;
            per_page?: number;
            unread_only?: boolean;
        }>({
            query: (params = {}) => ({
                url: '/api/get-notifications',
                method: 'GET',
                params,
            }),
            transformResponse: normalizeNotificationsResponse,
            providesTags: ['Notifications'],
        }),

        // Read Notification
        readNotification: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/api/notifications/read/${id}`,
                method: 'GET',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // Mark All as Read
        markAllNotificationsAsRead: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: '/api/notifications/mark-all-read',
                method: 'POST',
            }),
            invalidatesTags: ['Notifications'],
        }),

        // Get Unread Count
        getUnreadNotificationCount: builder.query<{ count: number }, void>({
            query: () => '/api/notifications/unread-count',
            providesTags: ['Notifications'],
            transformResponse: (response: any) => ({
                count: response.data?.count || response.count || 0,
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useLazyGetNotificationsQuery,
    useReadNotificationMutation,
    useMarkAllNotificationsAsReadMutation,
    useGetUnreadNotificationCountQuery,
} = notificationEndpoints;
