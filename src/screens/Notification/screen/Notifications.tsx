import React, { useMemo, useState } from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import NotificationHeader from '../components/NotificationHeader';
import NotificationFilters, { FilterItem } from '../components/NotificationFilters';
import NotificationSection from '../components/NotificationSection';
import NotificationEmptyState from '../components/NotificationEmptyState';

import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useGetNotificationsQuery, useReadNotificationMutation } from '@store/api/endpoints/notification';
import { transformNotificationToItem, groupNotificationsByTime } from '@utils/notificationHelpers';

export const NotificationsScreen = () => {
    const { data: notificationsResponse, isLoading, error } = useGetNotificationsQuery({});
    const [readNotification] = useReadNotificationMutation();
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
            case 'requests':
                return notificationsResponse.data.filter(notification => notification.type === 'intervention');
            case 'promos':
                return notificationsResponse.data.filter(notification => notification.type === 'system');
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
        const requests = notificationsResponse.data.filter(n => n.type === 'intervention').length;
        const promos = notificationsResponse.data.filter(n => n.type === 'system').length;

        return [
            { key: 'all', label: 'Toutes', icon: 'fa-envelope', count: all },
            { key: 'unread', label: 'Non lues', icon: 'fa-envelope-open-text', count: unread },
            { key: 'requests', label: 'Demandes', icon: 'fa-file-alt', count: requests },
            { key: 'promos', label: 'Promotions', icon: 'fa-tag', count: promos },
        ];
    }, [notificationsResponse]);

    const handleDeleteNotification = async (id: number) => {
        try {
            await readNotification(id).unwrap();
        } catch (err) {
            console.error('Failed to mark notification as read:', err);
        }
    };

    if (isLoading) {
        return (
            <ScreenContainer
                mode="light"
                scrollable
                useImageBackground
                backgroundImage={require('@assets/images/background_ligth.png')}
                imageResizeMode="cover"
                paddingHorizontal={horizontalScale(18)}
                paddingVertical={verticalScale(18)}
                contentContainerStyle={{ paddingBottom: verticalScale(110) }}
            >
                <NotificationHeader />
                <Content>
                    <LoadingText>Chargement des notifications...</LoadingText>
                </Content>
            </ScreenContainer>
        );
    }

    if (error) {
        return (
            <ScreenContainer
                mode="light"
                scrollable
                useImageBackground
                backgroundImage={require('@assets/images/background_ligth.png')}
                imageResizeMode="cover"
                paddingHorizontal={horizontalScale(18)}
                paddingVertical={verticalScale(18)}
                contentContainerStyle={{ paddingBottom: verticalScale(110) }}
            >
                <NotificationHeader />
                <Content>
                    <ErrorText>Erreur lors du chargement des notifications</ErrorText>
                </Content>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer
            mode="light"
            scrollable
            useImageBackground
            backgroundImage={require('@assets/images/background_ligth.png')}
            imageResizeMode="cover"
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(18)}
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
                    <NotificationSection title="Aujourd’hui" data={today} onDelete={handleDeleteNotification} />
                )}
                {week.length > 0 && (
                    <NotificationSection title="Cette semaine" data={week} grouped onDelete={handleDeleteNotification} />
                )}
                {older.length > 0 && (
                    <NotificationSection title="Plus anciennes" data={older} onDelete={handleDeleteNotification} />
                )}

                {transformedNotifications.length === 0 && <NotificationEmptyState />}
            </Content>
        </ScreenContainer>
    );
};


const Content = styled.View`
  margin-top: ${verticalScale(20)}px;
  gap: ${verticalScale(20)}px;
`;

const LoadingText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-top: ${verticalScale(40)}px;
`;

const ErrorText = styled.Text`
  text-align: center;
  font-size: 16px;
  color: #ff4444;
  margin-top: ${verticalScale(40)}px;
`;