import type { Notification } from '../store/api/api.types';

export interface NotificationCardViewModel {
  title: string;
  message: string;
  time?: string;
  unread?: boolean;
}

export const notificationToCard = (
  notification: Notification,
): NotificationCardViewModel => ({
  title: notification.title,
  message: notification.message,
  time: notification.created_at,
  unread: !notification.read,
});
