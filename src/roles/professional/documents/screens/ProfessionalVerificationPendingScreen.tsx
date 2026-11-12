import { Button } from '@shared/ui/button/Button';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, selectUser } from '@store/slices/authSlice';
import { useLogoutMutation } from '@features/auth/api/auth.api';
import { useGetProfileQuery } from '@entities/user/api/user.api';
import { api } from '@store/api/baseApi';
import { getHomeRouteFromAuthResponse } from '../../../../navigation/authNavigation';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useTheme } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { getDocumentForType, getDocumentSubmissionProgress, PROFESSIONAL_DOCUMENTS } from '../model/professional-documents';

const ProfessionalVerificationPendingScreen = () => {
    const { t } = useTranslation();
    const { theme, themeMode } = useTheme();
    const navigation = useNavigation<any>();

    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { data, isFetching, isError, error, refetch } = useGetProfileQuery(undefined, { skip: !user, refetchOnMountOrArgChange: true });
    const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
    const documents = (user && data?.data?.id === user.id ? data?.data?.documents : undefined) ?? user?.documents ?? [];
    const progress = getDocumentSubmissionProgress(documents);
    const hasKnownDocumentStatuses = documents.length > 0 && documents.every(document => ['pending', 'approved', 'rejected'].includes(document.status));
    const profileUnavailable = error && 'status' in error && error.status === 404;

    useEffect(() => {
        if (!user) {
            navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
            return;
        }
        if (isFetching || isError || !data?.data || data.data.id !== user.id || data.success === false) return;
        const profile = data.data;
        // Entry into this screen follows a confirmed submission. Server decisions
        // must remain usable even when local phone storage is unavailable.
        const destination = getHomeRouteFromAuthResponse({ user: profile }, 'professional', true);
        if (destination !== 'ProfessionalVerificationPending') navigation.reset({ index: 0, routes: [{ name: destination }] });
    }, [data, isFetching, isError, navigation, user]);

    const handleLogout = async () => {
        try {
            await logoutRequest().unwrap();
        } catch {
            // Always close the local session even when the server is unreachable.
        } finally {
            dispatch(logout());
            dispatch(api.util.resetApiState());
            navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
        }
    };

    return (
        <ScreenContainer
            scrollable
            withBottomSafeArea
            mode={themeMode}
            paddingHorizontal={horizontalScale(20)}
            paddingVertical={verticalScale(18)}
            backgroundColor={theme.colors.background}
            contentContainerStyle={styles.content}
        >
            <LogoMediumPro24Icon width={moderateScale(140)} height={moderateScale(44)} style={styles.logo} />
            <Image source={require('@assets/images/account-pending-illustration.png')} style={styles.illustration} resizeMode="contain" accessibilityIgnoresInvertColors />
            <Text variant="title" color={theme.colors.textPrimary} style={styles.title}>
                {t('professional.verificationPending.title')}
            </Text>
            <Text variant="regular" color={theme.colors.textSecondary} style={styles.description}>
                {t('professional.verificationPending.description')}
            </Text>

            <View style={styles.timeline}>
                {(['submitted', 'review', 'activation'] as const).map((step, index) => (
                    <View key={step} style={styles.step}>
                        <View style={styles.stepMarker}>
                            <SvgIcon name={index === 0 ? 'fa-check-circle' : 'fa-clock'} size={22} color={index === 0 ? theme.colors.success : index === 1 ? theme.colors.primary : theme.colors.textDisabled} />
                            {index < 2 ? <View style={[styles.stepLine, { backgroundColor: theme.colors.border }]} /> : null}
                        </View>
                        <View style={styles.stepCopy}>
                            <Text variant="bold" color={theme.colors.textPrimary}>{t(`professional.verificationPending.${step}Title`)}</Text>
                        </View>
                    </View>
                ))}
            </View>
            <View style={styles.refresh}>
                {isError ? <Text variant="regularSmall" color={theme.colors.danger}>{t(profileUnavailable ? 'professional.verificationPending.signInToCheckDescription' : 'auth.onboarding.profileRefreshFailed')}</Text> : null}
                <Button title={t(profileUnavailable ? 'professional.verificationPending.signInToCheck' : 'auth.onboarding.checkDossier')} icon="fa-sync-alt"
                    onPress={() => {
                        if (profileUnavailable) navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
                        else refetch().unwrap().catch(() => undefined);
                    }} loading={isFetching}
                    disabled={isFetching || isLoggingOut || !user} fullWidth />
            </View>
            <Button title={t('professional.verificationPending.logout')} variant="outline" icon="fa-sign-out-alt"
                onPress={handleLogout} disabled={isLoggingOut} loading={isLoggingOut} fullWidth />

            <Text variant="bold" fontSize={18} color={theme.colors.textPrimary} style={styles.documentsTitle}>
                {t('professional.verificationPending.documentsTitle')}
            </Text>
            {hasKnownDocumentStatuses ? <View style={styles.progressHeader}>
                <Text variant="regularSmall" color={theme.colors.textPrimary}>{t('professional.documentDesign.progress', { sent: progress.submitted, total: progress.total })}</Text>
                <Text variant="regularSmall" color={theme.colors.textSecondary}>{Math.round(progress.submitted / progress.total * 100)} %</Text>
            </View> : null}
            {hasKnownDocumentStatuses ? <View style={[styles.progressTrack, { backgroundColor: theme.colors.border }]} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: progress.total, now: progress.submitted }}>
                <View style={[styles.progressFill, { backgroundColor: theme.colors.primary, width: `${progress.submitted / progress.total * 100}%` }]} />
            </View> : null}
            {PROFESSIONAL_DOCUMENTS.map(item => {
                const document = getDocumentForType(documents, item.name);
                if (!document) return null;
                const statusKey = document.status === 'approved' ? 'approved' : document.status === 'rejected' ? 'rejected' : document.status === 'pending' ? 'pending' : 'unknown';
                return <View key={item.name} style={[styles.documentRow, { borderBottomColor: theme.colors.borderLight }]}>
                    <SvgIcon name={item.icon} size={18} color={theme.colors.textSecondary} />
                    <Text variant="regular" color={theme.colors.textPrimary} style={styles.documentName}>{t(item.titleKey)}</Text>
                    <Text variant="medium" fontSize={14} color={theme.colors.textPrimary}>{t(`professional.verificationPending.status.${statusKey}`)}</Text>
                </View>;
            })}
            {documents.length === 0 ? <Text variant="regularSmall" color={theme.colors.textSecondary}>{t('professional.verificationPending.documentsUnavailable')}</Text> : null}
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    content: { flexGrow: 1, paddingBottom: verticalScale(24) },
    illustration: { width: '100%', height: verticalScale(170), marginVertical: verticalScale(8) },
    logo: { alignSelf: 'center', marginBottom: verticalScale(4) },
    title: { textAlign: 'center' },
    description: { textAlign: 'center', lineHeight: 22, marginTop: verticalScale(10) },
    timeline: { marginTop: verticalScale(20), alignSelf: 'center', width: '90%' },
    step: { flexDirection: 'row', gap: horizontalScale(14), minHeight: verticalScale(46) },
    stepMarker: { alignItems: 'center', width: moderateScale(24) },
    stepLine: { width: 2, flex: 1, marginVertical: verticalScale(3) },
    stepCopy: { flex: 1, paddingBottom: verticalScale(8) },
    documentsTitle: { marginTop: verticalScale(22), marginBottom: verticalScale(8) },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: horizontalScale(8) },
    progressTrack: { height: verticalScale(7), borderRadius: moderateScale(4), overflow: 'hidden', marginVertical: verticalScale(10) },
    progressFill: { height: '100%', borderRadius: moderateScale(4) },
    documentRow: { flexDirection: 'row', alignItems: 'center', gap: horizontalScale(10), minHeight: verticalScale(48), borderBottomWidth: StyleSheet.hairlineWidth },
    documentName: { flex: 1 },
    refresh: { marginTop: verticalScale(12), marginBottom: verticalScale(10), gap: verticalScale(12) },
});

export default ProfessionalVerificationPendingScreen;
