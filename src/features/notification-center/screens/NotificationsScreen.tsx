import { Toast } from '@core/notifications/toast';
import { getNotificationInterventionId } from '@core/notifications/notification-target';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import NotificationHeader from '../components/NotificationHeader';
import NotificationFilters, { FilterItem } from '../components/NotificationFilters';
import NotificationSection from '../components/NotificationSection';
import NotificationEmptyState from '../components/NotificationEmptyState';

import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useGetNotificationsQuery, useReadNotificationMutation } from '@entities/notification/api/notification.api';
import { transformNotificationToItem, groupNotificationsByTime } from '@utils/notificationHelpers';

export const NotificationsScreen = () => {
    const { t } = useTranslation();
    const { data: notificationsResponse, isLoading, error } = useGetNotificationsQuery({});
    const [readNotification] = useReadNotificationMutation();
    const navigation = useNavigation<any>();
    const [activeFilter, setActiveFilter] = useState('all');

    const transformedNotifications = useMemo(() => {
        if (!notificationsResponse?.data) return [];
        return notificationsResponse.data.map(transformNotificationToItem);
    }, [notificationsResponse]);

    const filteredNotifications = useMemo(() => {
        if (!notificationsResponse?.data) return [];

        switch (activeFilter) {
            case 'unread':
                return notificationsResponse.data.filter(notification => !notification.read);
            case 'all':
            default:
                return notificationsResponse.data;
        }
    }, [notificationsResponse, activeFilter]);

    const filteredTransformedNotifications = useMemo(() => {
        return filteredNotifications.map(transformNotificationToItem);
    }, [filteredNotifications]);

    const { today, week, older } = useMemo(() => {
        if (filteredNotifications.length === 0) return { today: [], week: [], older: [] };
        return groupNotificationsByTime(filteredNotifications, filteredTransformedNotifications);
    }, [filteredNotifications, filteredTransformedNotifications]);

    const filterItems: FilterItem[] = useMemo(() => {
        if (!notificationsResponse?.data) return [];

        const all = notificationsResponse.data.length;
        const unread = notificationsResponse.data.filter(n => !n.read).length;

        return [
            { key: 'all', label: t('notifications.all'), icon: 'fa-bell', count: all },
            { key: 'unread', label: t('notifications.unread'), icon: 'fa-envelope-open-text', count: unread },
        ];
    }, [notificationsResponse, t]);

    const handleDeleteNotification = async (id: string) => {
        try {
            await readNotification(id).unwrap();
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    const handleOpenNotification = (id: string) => {
        const notification = notificationsResponse?.data.find(item => item.id === id);
        handleDeleteNotification(id);
        const interventionId = getNotificationInterventionId(notification);
        if (interventionId !== undefined) {
            navigation.navigate('InterventionDetail', { intervention_id: interventionId });
        } else {
            Toast.show(t('notifications.interventionUnavailable'), { type: 'warning', placement: 'bottom' });
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer
                scrollable

                paddingHorizontal={horizontalScale(18)}
                paddingVertical={verticalScale(14)}
                contentContainerStyle={{ paddingBottom: verticalScale(110) }}
            >
                <NotificationHeader />
                <Content>
                    <LoadingText>{t('notifications.loading')}</LoadingText>
                </Content>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer
                scrollable

                paddingHorizontal={horizontalScale(18)}
                paddingVertical={verticalScale(14)}
                contentContainerStyle={{ paddingBottom: verticalScale(110) }}
            >
                <NotificationHeader />
                <Content>
                    <ErrorText>{t('notifications.loadError')}</ErrorText>
                </Content>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer
            scrollable

            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(14)}
            contentContainerStyle={{ paddingBottom: verticalScale(110) }}
        >
            <NotificationHeader />

            <NotificationFilters
                filters={filterItems}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            <Content>
                {today.length > 0 && (
                    <NotificationSection title={t('notifications.today')} data={today} onDelete={handleDeleteNotification} onPress={handleOpenNotification} />
                )}
                {week.length > 0 && (
                    <NotificationSection title={t('notifications.week')} data={week} grouped onDelete={handleDeleteNotification} onPress={handleOpenNotification} />
                )}
                {older.length > 0 && (
                    <NotificationSection title={t('notifications.older')} data={older} onDelete={handleDeleteNotification} onPress={handleOpenNotification} />
                )}

                {transformedNotifications.length === 0 && <NotificationEmptyState />}
            </Content>
        </ScreenContainer>
    );
};


const Content = styled.View`
  margin-top: ${verticalScale(8)}px;
  gap: ${verticalScale(20)}px;
`;

const LoadingText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${verticalScale(40)}px;
`;

const ErrorText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.danger};
  margin-top: ${verticalScale(40)}px;
`;
