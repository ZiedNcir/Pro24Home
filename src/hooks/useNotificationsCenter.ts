import {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useReadNotificationMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetUnreadNotificationCountQuery,
} from '../store/api';

export const useNotificationsCenter = (params?: {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}) => {
  const query = useGetNotificationsQuery(params ?? {});
  const unreadCountQuery = useGetUnreadNotificationCountQuery();
  const [readNotification, readNotificationState] = useReadNotificationMutation();
  const [markAllAsRead, markAllAsReadState] = useMarkAllNotificationsAsReadMutation();

  return {
    ...query,
    notifications: query.data?.data ?? [],
    unreadCount: unreadCountQuery.data?.count ?? 0,
    readNotification,
    markAllAsRead,
    readNotificationState,
    markAllAsReadState,
    unreadCountQuery,
    useLazyGetNotificationsQuery,
  };
};
