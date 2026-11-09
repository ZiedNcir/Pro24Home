import { Button } from '@shared/ui/button/Button';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, selectUser } from '@store/slices/authSlice';
import { useLogoutMutation } from '@features/auth/api/auth.api';
import { useGetProfileQuery } from '@entities/user/api/user.api';
import { api } from '@store/api/baseApi';
import { getHomeRouteFromAuthResponse } from '../../../../navigation/authNavigation';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useTheme } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';

const ProfessionalVerificationPendingScreen = () => {
    const { t } = useTranslation();
    const { theme, themeMode } = useTheme();
    const navigation = useNavigation<any>();

    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const { data, isFetching, isError, refetch } = useGetProfileQuery(undefined, { skip: !user, refetchOnMountOrArgChange: true });
    const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();

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
            mode={themeMode}
            paddingHorizontal={horizontalScale(20)}
            paddingVertical={verticalScale(18)}
            backgroundColor={theme.colors.background}
            contentContainerStyle={styles.content}
        >
            <Header>
                <LogoMediumPro24Icon width={moderateScale(140)} height={moderateScale(44)} />
            </Header>

            <StatusIcon $backgroundColor={theme.colors.primaryLighter}>
                <SvgIcon name="fa-clock" size={38} color={theme.colors.primary} />
            </StatusIcon>
            <Text variant="title" color={theme.colors.textPrimary} style={styles.title}>
                {t('professional.verificationPending.title')}
            </Text>
            <Text variant="regular" color={theme.colors.textSecondary} style={styles.description}>
                {t('professional.verificationPending.description')}
            </Text>

            <InfoCard $backgroundColor={theme.colors.surface} $borderColor={theme.colors.border}>
                <SvgIcon name="fa-file-alt" size={20} color={theme.colors.primary} />
                <View style={styles.infoCopy}>
                    <Text variant="bold" color={theme.colors.textPrimary}>
                        {t('professional.verificationPending.documentsReceived')}
                    </Text>
                    <Text variant="regularSmall" color={theme.colors.textSecondary}>
                        {t('professional.verificationPending.documentsReceivedDescription')}
                    </Text>
                </View>
            </InfoCard>

            <View style={styles.refresh}>
                {isError ? <Text variant="regularSmall" color={theme.colors.danger}>{t('auth.onboarding.profileRefreshFailed')}</Text> : null}
                <Button title={t('auth.onboarding.checkDossier')} variant="outline" leftIcon="fa-sync-alt"
                    onPress={() => { refetch().unwrap().catch(() => undefined); }} loading={isFetching}
                    disabled={isFetching || isLoggingOut || !user} fullWidth />
            </View>
            <LogoutButton accessibilityRole="button" onPress={handleLogout} disabled={isLoggingOut}>
                <SvgIcon name="fa-sign-out-alt" size={18} color={theme.colors.primary} />
                <Text variant="bold" color={theme.colors.primary}>
                    {t('professional.verificationPending.logout')}
                </Text>
            </LogoutButton>
        </ScreenContainer>
    );
};

const Header = styled.View`height: ${verticalScale(58)}px; align-items: center; justify-content: center; margin-bottom: ${verticalScale(42)}px;`;
const StatusIcon = styled.View<{ $backgroundColor: string }>`width: ${moderateScale(88)}px; height: ${moderateScale(88)}px; border-radius: ${moderateScale(46)}px; background-color: ${({ $backgroundColor }) => $backgroundColor}; align-items: center; justify-content: center; align-self: center; margin-bottom: ${verticalScale(22)}px;`;
const InfoCard = styled.View<{ $backgroundColor: string; $borderColor: string }>`width: 100%; flex-direction: row; align-items: flex-start; gap: ${horizontalScale(12)}px; padding: ${moderateScale(16)}px; background-color: ${({ $backgroundColor }) => $backgroundColor}; border-width: 1px; border-color: ${({ $borderColor }) => $borderColor}; border-radius: ${moderateScale(16)}px; margin-top: ${verticalScale(26)}px;`;
const LogoutButton = styled(Pressable)`min-height: ${verticalScale(52)}px; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(8)}px; margin-top: ${verticalScale(24)}px;`;

const styles = StyleSheet.create({
    content: { flexGrow: 1, justifyContent: 'center', paddingBottom: verticalScale(24) },
    title: { textAlign: 'center', maxWidth: horizontalScale(320), alignSelf: 'center' },
    description: { textAlign: 'center', lineHeight: 22, marginTop: verticalScale(12), maxWidth: horizontalScale(330), alignSelf: 'center' },
    infoCopy: { flex: 1, gap: verticalScale(4) },
    refresh: { marginTop: verticalScale(24), gap: verticalScale(12) },
});

export default ProfessionalVerificationPendingScreen;
