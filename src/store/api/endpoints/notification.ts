// src/store/api/endpoints/notification.ts
import { api } from '../baseApi';
import {
    Notification,
    PaginatedResponse,
} from '../api.types';

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
            providesTags: ['Notifications'],
        }),

        // Read Notification
        readNotification: builder.mutation<{ message: string }, number>({
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
