import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import { ErrorDialog, WarningDialog } from '@shared/ui/overlay/DialogModal';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import type { IconName } from '@shared/ui/icon';
import { useGetInterventionsQuery } from '@entities/intervention/api/intervention.api';
import { useGetUnreadNotificationCountQuery } from '@entities/notification/api/notification.api';
import { useUpdateStatusMutation } from '@roles/professional/availability/api/availability.api';
import { selectUser } from '@store/slices/authSlice';
import type { Intervention } from '@entities/intervention/model';
import { colors } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { buildProfessionalStatusPayload, type Coordinates } from '@roles/professional/dashboard/model/professional-status';

const formatDate = (value?: string, language = 'fr') => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(language.startsWith('en') ? 'en' : 'fr-FR', { day: 'numeric', month: 'short' });
};

const serviceIcon = (item: Intervention): IconName => {
    const value = `${item.service?.name || ''} ${item.title}`.toLowerCase();
    return value.includes('plomb') ? 'fa-wrench' : value.includes('élect') ? 'fa-bolt' : 'fa-building';
};

type DashboardDialog = {
    type: 'warning' | 'error';
    title: string;
    message: string;
};

const ProfessionalHomeDashboard = () => {
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<any>();
    const user = useSelector(selectUser);
    const [updateStatus] = useUpdateStatusMutation();
    const { data, isLoading, refetch } = useGetInterventionsQuery({ type: 'professional' });
    const { data: unreadData } = useGetUnreadNotificationCountQuery();
    const [localOnline, setLocalOnline] = useState<boolean | null>(null);
    const [dialog, setDialog] = useState<DashboardDialog | null>(null);
    const isOnline = localOnline ?? user?.professional?.online_status ?? false;
    const interventions = useMemo(() => data?.data ?? [], [data?.data]);
    const name = user?.professional?.first_name || user?.name?.split(' ')[0] || t('client.home.user');

    const toggleStatus = async () => {
        const next = !isOnline;

        let hasLocationPermission = false;
        try {
            if (Platform.OS === 'ios') {
                hasLocationPermission = (await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)) === RESULTS.GRANTED;
            } else {
                const [fineLocation, coarseLocation] = await Promise.all([
                    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION),
                    check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION),
                ]);
                hasLocationPermission = fineLocation === RESULTS.GRANTED || coarseLocation === RESULTS.GRANTED;
            }
        } catch {
            hasLocationPermission = false;
        }

        if (!hasLocationPermission) {
            setDialog({
                type: 'warning',
                title: t('professional.dashboard.locationPermissionTitle'),
                message: t('professional.dashboard.locationPermissionMessage'),
            });
            return;
        }

        let coordinates: Coordinates;
        try {
            const position = await new Promise<Coordinates>((resolve, reject) => {
                Geolocation.getCurrentPosition(
                    ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude }),
                    reject,
                    { enableHighAccuracy: true, timeout: 15_000, maximumAge: 10_000 },
                );
            });
            coordinates = position;
        } catch {
            setDialog({
                type: 'error',
                title: t('professional.dashboard.positionUnavailable'),
                message: t('professional.dashboard.positionRequired'),
            });
            return;
        }

        try {
            await updateStatus(buildProfessionalStatusPayload(next, coordinates)).unwrap();
            setLocalOnline(next);
        } catch {
            setDialog({
                type: 'error',
                title: t('professional.dashboard.statusUnavailable'),
                message: t('professional.dashboard.statusFailed'),
            });
        }
    };

    const closeDialog = () => setDialog(null);

    const openLocationSettings = async () => {
        closeDialog();
        try {
            await Linking.openSettings();
        } catch {
            setDialog({
                type: 'error',
                title: t('professional.dashboard.statusUnavailable'),
                message: t('professional.dashboard.locationSettingsUnavailable'),
            });
        }
    };

    const openIntervention = (item: Intervention) => navigation.navigate('InterventionDetail', { intervention_id: item.id });

    return (
        <ScreenContainer scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(14)} backgroundColor={colors.white} contentContainerStyle={styles.content}>
            <Header>
                <LogoMediumPro24Icon width={moderateScale(112)} height={moderateScale(36)} />
                <HeaderActions>
                    <NotificationButton accessibilityRole="button" accessibilityLabel={t('client.settings.notifications')} onPress={() => navigation.navigate('Notifications')}>
                        <SvgIcon name="fa-bell" size={21} color={colors.gray900} />
                        {!!unreadData?.count && <NotificationDot><Text variant="notification" color={colors.white}>{unreadData.count > 9 ? '9+' : unreadData.count}</Text></NotificationDot>}
                    </NotificationButton>
                    <Avatar><SvgIcon name="fa-user" size={18} color={colors.primary} /></Avatar>
                </HeaderActions>
            </Header>

            <Text variant="title" color={colors.gray900} style={styles.greeting}>{t('professional.dashboard.greeting', { name })}</Text>
            <Text variant="regular" color={colors.gray700} style={styles.subtitle}>{t('professional.dashboard.subtitle')}</Text>

            <StatusCard online={isOnline}>
                <StatusIcon online={isOnline}><SvgIcon name={isOnline ? 'fa-check' : 'fa-user-clock'} size={23} color={colors.white} /></StatusIcon>
                <View style={styles.statusCopy}><Text variant="bold" color={colors.gray900}>{isOnline ? t('professional.dashboard.online') : t('professional.dashboard.offline')}</Text><Text variant="regularSmall" color={colors.gray700}>{isOnline ? t('professional.dashboard.onlineDescription') : t('professional.dashboard.offlineDescription')}</Text></View>
                <StatusSwitch accessibilityRole="switch" accessibilityState={{ checked: isOnline }} onPress={toggleStatus} online={isOnline}><SwitchThumb online={isOnline} /></StatusSwitch>
            </StatusCard>

            {dialog?.type === 'warning' ? (
                <WarningDialog
                    visible
                    animationType="none"
                    onRequestClose={closeDialog}
                    title={dialog.title}
                    message={dialog.message}
                    primaryButtonTitle={t('professional.dashboard.openSettings')}
                    onPrimaryPress={openLocationSettings}
                    secondaryButtonTitle={t('professional.dashboard.cancel')}
                    onSecondaryPress={closeDialog}
                    showCloseButton={true}
                />
            ) : dialog ? (
                <ErrorDialog
                    visible
                    animationType="none"
                    onRequestClose={closeDialog}
                    title={dialog.title}
                    message={dialog.message}
                    showCloseButton={true}
                />
            ) : null}

            <SectionHeading><View style={styles.sectionTitleWrap}><SvgIcon name="fa-folder-open" size={22} color={colors.primary} /><Text variant="title" color={colors.gray900} style={styles.sectionTitle}>{t('professional.dashboard.requests')}</Text></View>{interventions.length > 0 && <CountBadge><Text variant="bold" color={colors.primary}>{interventions.length}</Text></CountBadge>}</SectionHeading>

            {isLoading ? <Loading><ActivityIndicator color={colors.primary} /></Loading> : interventions.length === 0 ? <EmptyCard><SvgIcon name="fa-inbox" size={28} color={colors.gray500} /><Text variant="regular" color={colors.gray700}>{t('professional.dashboard.emptyRequests')}</Text></EmptyCard> : interventions.slice(0, 2).map(item => <RequestCard key={item.id} onPress={() => openIntervention(item)} accessibilityRole="button" accessibilityLabel={t('professional.dashboard.viewRequest') + ' ' + (item.title || t('professional.dashboard.request'))}>
                <RequestTop><ServiceIcon><SvgIcon name={serviceIcon(item)} size={22} color={colors.white} /></ServiceIcon><View style={styles.requestCopy}><Text variant="bold" color={colors.gray900}>{item.title || item.service?.name || t('professional.dashboard.intervention')}</Text><Text variant="regularSmall" color={colors.gray600}>{formatDate(item.requested_date || item.scheduled_date, i18n.language) || t('professional.dashboard.dateFallback')}</Text></View><SvgIcon name="fa-chevron-right" size={16} color={colors.gray600} /></RequestTop>
                <RequestDetails><View style={styles.detail}><SvgIcon name="fa-map-marker-alt" size={14} color={colors.gray600} /><Text variant="regularSmall" color={colors.gray700} numberOfLines={1}>{item.address?.address || t('professional.dashboard.address')}</Text></View><View style={styles.detail}><SvgIcon name="fa-clock" size={14} color={colors.gray600} /><Text variant="regularSmall" color={colors.gray700}>{formatDate(item.requested_date || item.scheduled_date, i18n.language) || t('professional.dashboard.dateFallback')}</Text></View></RequestDetails>
                <View style={styles.requestFooter}><Text variant="bold" color={colors.primary}>{t('professional.dashboard.viewRequest')}</Text><SvgIcon name="fa-chevron-right" size={14} color={colors.primary} /></View>
            </RequestCard>)}

            <SectionHeading><View style={styles.sectionTitleWrap}><SvgIcon name="fa-chart-line" size={22} color={colors.primary} /><Text variant="title" color={colors.gray900} style={styles.sectionTitle}>{t('professional.dashboard.today')}</Text></View></SectionHeading>
            <StatsCard><Stat><StatNumber color={colors.primary}>{interventions.length}</StatNumber><Text variant="regularSmall" color={colors.gray700}>{t('professional.dashboard.received')}</Text></Stat><Divider /><Stat><StatNumber color={colors.success}>{user?.professional?.services?.length || 0}</StatNumber><Text variant="regularSmall" color={colors.gray700}>{t('professional.dashboard.activeServices')}</Text></Stat><Divider /><Stat><StatNumber color={colors.info}>—</StatNumber><Text variant="regularSmall" color={colors.gray700}>{t('professional.dashboard.rating')}</Text></Stat></StatsCard>

            {user?.documents?.some(document => document.status !== 'approved') !== false && <ProfilePrompt onPress={() => navigation.navigate('Documents')} accessibilityRole="button"><SvgIcon name="fa-shield-alt" size={25} color={colors.primary} /><View style={styles.promptCopy}><Text variant="bold" color={colors.gray900}>{t('professional.dashboard.completeProfile')}</Text><Text variant="regularSmall" color={colors.gray700}>{t('professional.dashboard.documentsPrompt')}</Text></View><SvgIcon name="fa-chevron-right" size={16} color={colors.primary} /></ProfilePrompt>}
            <Pressable onPress={refetch} accessibilityRole="button"><Text variant="regularSmall" color={colors.primary} style={styles.refresh}>{t('professional.dashboard.refresh')}</Text></Pressable>
        </ScreenContainer>
    );
};

const Header = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(24)}px;`;
const HeaderActions = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(12)}px;`;
const NotificationButton = styled(Pressable)`width: ${moderateScale(38)}px; height: ${moderateScale(38)}px; align-items: center; justify-content: center;`;
const NotificationDot = styled.View`position: absolute; right: 0; top: 0; min-width: ${moderateScale(17)}px; height: ${moderateScale(17)}px; border-radius: ${moderateScale(10)}px; background-color: ${colors.primary}; align-items: center; justify-content: center; padding-horizontal: ${moderateScale(3)}px;`;
const Avatar = styled.View`width: ${moderateScale(38)}px; height: ${moderateScale(38)}px; border-radius: ${moderateScale(20)}px; background-color: #fff0e7; align-items: center; justify-content: center;`;
const StatusCard = styled.View<{ online: boolean }>`border-width: 1px; border-color: ${({ online }) => online ? '#b7e6c0' : colors.gray200}; background-color: ${({ online }) => online ? '#f3fff5' : colors.gray50}; border-radius: ${moderateScale(17)}px; padding: ${moderateScale(15)}px; flex-direction: row; align-items: center; margin-bottom: ${verticalScale(24)}px;`;
const StatusIcon = styled.View<{ online: boolean }>`width: ${moderateScale(44)}px; height: ${moderateScale(44)}px; border-radius: ${moderateScale(23)}px; background-color: ${({ online }) => online ? colors.success : colors.gray500}; align-items: center; justify-content: center; margin-right: ${horizontalScale(12)}px;`;
const StatusSwitch = styled(Pressable) <{ online: boolean }>`width: ${moderateScale(48)}px; height: ${moderateScale(28)}px; border-radius: ${moderateScale(16)}px; background-color: ${({ online }) => online ? colors.success : colors.gray300}; padding: ${moderateScale(3)}px; justify-content: center;`;
const SwitchThumb = styled.View<{ online: boolean }>`width: ${moderateScale(22)}px; height: ${moderateScale(22)}px; border-radius: ${moderateScale(12)}px; background-color: ${colors.white}; align-self: ${({ online }) => online ? 'flex-end' : 'flex-start'};`;
const SectionHeading = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(10)}px;`;
const CountBadge = styled.View`min-width: ${moderateScale(28)}px; height: ${moderateScale(28)}px; border-radius: ${moderateScale(16)}px; background-color: #fff0e7; align-items: center; justify-content: center;`;
const RequestCard = styled(Pressable)`border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(16)}px; padding: ${moderateScale(14)}px; margin-bottom: ${verticalScale(10)}px;`;
const RequestTop = styled.View`flex-direction: row; align-items: center;`;
const ServiceIcon = styled.View`width: ${moderateScale(46)}px; height: ${moderateScale(46)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const RequestDetails = styled.View`border-top-width: 1px; border-top-color: ${colors.gray200}; margin-top: ${verticalScale(12)}px; padding-top: ${verticalScale(10)}px; gap: ${verticalScale(7)}px;`;
const StatsCard = styled.View`border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(16)}px; padding: ${moderateScale(15)}px 0; flex-direction: row; align-items: center; margin-bottom: ${verticalScale(18)}px;`;
const Stat = styled.View`flex: 1; align-items: center;`;
const StatNumber = styled(Text) <{ color: string }>`font-size: ${moderateScale(22)}px; line-height: ${moderateScale(29)}px; color: ${({ color }) => color}; margin-bottom: ${verticalScale(2)}px;`;
const Divider = styled.View`height: ${verticalScale(38)}px; width: 1px; background-color: ${colors.gray200};`;
const ProfilePrompt = styled(Pressable)`background-color: #fff6f0; border-radius: ${moderateScale(16)}px; padding: ${moderateScale(14)}px; flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px;`;
const EmptyCard = styled.View`border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(16)}px; padding: ${moderateScale(24)}px; align-items: center; gap: ${verticalScale(10)}px; margin-bottom: ${verticalScale(18)}px;`;
const Loading = styled.View`padding: ${verticalScale(28)}px; align-items: center;`;

const styles = StyleSheet.create({
    content: { paddingBottom: verticalScale(112) },
    greeting: { marginBottom: verticalScale(4) },
    subtitle: { marginBottom: verticalScale(20) },
    statusCopy: { flex: 1, gap: verticalScale(3) },
    sectionTitleWrap: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(10) },
    sectionTitle: { fontSize: 20 },
    requestCopy: { flex: 1, marginLeft: horizontalScale(12), gap: verticalScale(3) },
    detail: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(7) },
    requestFooter: { borderTopWidth: 1, borderTopColor: colors.gray200, marginTop: verticalScale(12), paddingTop: verticalScale(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    promptCopy: { flex: 1, gap: verticalScale(3) },
    refresh: { textAlign: 'center', marginTop: verticalScale(12) },
});

export default ProfessionalHomeDashboard;
