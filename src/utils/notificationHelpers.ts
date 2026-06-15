// src/utils/notificationHelpers.ts
import { Notification } from '@store/api/api.types';
import { NotificationItem } from '@screens/Notification/components/NotificationCard';

export const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;

    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const getNotificationIcon = (type: Notification['type']): NotificationItem['icon'] => {
    switch (type) {
        case 'intervention':
            return 'fa-tools';
        case 'devis':
            return 'fa-file-invoice-dollar';
        case 'reclamation':
            return 'fa-exclamation-triangle';
        case 'payment':
            return 'fa-credit-card';
        case 'system':
        default:
            return 'fa-info-circle';
    }
};

export const getNotificationColor = (type: Notification['type']): NotificationItem['color'] => {
    switch (type) {
        case 'intervention':
            return 'success';
        case 'payment':
            return 'purple';
        case 'system':
            return 'blue';
        default:
            return undefined;
    }
};

export const transformNotificationToItem = (notification: Notification): NotificationItem => {
    return {
        id: notification.id,
        icon: getNotificationIcon(notification.type),
        title: notification.title,
        description: notification.message,
        time: formatTimeAgo(notification.created_at),
        unread: !notification.read,
        color: getNotificationColor(notification.type),
    };
};

export const groupNotificationsByTime = (notifications: Notification[], transformedNotifications: NotificationItem[]) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

    const today: NotificationItem[] = [];
    const week: NotificationItem[] = [];
    const older: NotificationItem[] = [];

    notifications.forEach((notification, index) => {
        const notificationDate = new Date(notification.created_at);
        const transformedItem = transformedNotifications[index];

        if (notificationDate >= todayStart) {
            today.push(transformedItem);
        } else if (notificationDate >= weekStart) {
            week.push(transformedItem);
        } else {
            older.push(transformedItem);
        }
    });

    return { today, week, older };
};