import { Button } from '@shared/ui/button/Button';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { logout, selectUser } from '@store/slices/authSlice';
import { useLogoutMutation } from '@features/auth/api/auth.api';
import { useGetProfileQuery } from '@entities/user/api/user.api';
import { api } from '@store/api/baseApi';
import { getHomeRouteFromAuthResponse } from '../../../../navigation/authNavigation';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';
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
    const { data, isFetching, isError } = useGetProfileQuery(undefined, { skip: !user, refetchOnMountOrArgChange: true });
    const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
    const documents = (user && data?.data?.id === user.id ? data?.data?.documents : undefined) ?? user?.documents ?? [];
    const progress = getDocumentSubmissionProgress(documents);
    const hasKnownDocumentStatuses = documents.length > 0 && documents.every(document => ['pending', 'approved', 'rejected'].includes(document.status));

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
        <PendingContainer
            scrollable
            withBottomSafeArea
            mode={themeMode}
            paddingHorizontal={horizontalScale(20)}
            paddingVertical={verticalScale(12)}
            backgroundColor={theme.colors.background}
        >
            <Logo width={moderateScale(140)} height={moderateScale(44)} />
            <Illustration source={require('@assets/images/account-pending-illustration.png')} resizeMode="contain" accessible={false} accessibilityIgnoresInvertColors />
            <Title variant="title" accessibilityRole="header" color={theme.colors.textPrimary}>
                {t('professional.verificationPending.title')}
            </Title>
            <Description variant="regular" fontSize={15} lineHeight={22} color={theme.colors.textSecondary}>
                {t('professional.verificationPending.description')}
            </Description>

            <Timeline>
                {(['submitted', 'review', 'activation'] as const).map((step, index) => (
                    <Step key={step}>
                        <StepMarker>
                            <SvgIcon name={index === 0 ? 'fa-check-circle' : 'fa-clock'} size={moderateScale(22)} color={index === 0 ? theme.colors.success : index === 1 ? theme.colors.primary : theme.colors.textSecondary} />
                            {index < 2 ? <StepLine /> : null}
                        </StepMarker>
                        <StepCopy>
                            <Text variant={index === 1 ? "bold" : "medium"} fontSize={15} color={index === 2 ? theme.colors.textSecondary : theme.colors.textPrimary}>{t(`professional.verificationPending.${step}Title`)}</Text>
                        </StepCopy>
                    </Step>
                ))}
            </Timeline>

            <DocumentsTitle variant="bold" accessibilityRole="header" fontSize={18} color={theme.colors.textPrimary}>
                {t('professional.verificationPending.documentsTitle')}
            </DocumentsTitle>
            {hasKnownDocumentStatuses ? <ProgressHeader>
                <Text variant="regularSmall" color={theme.colors.textPrimary}>{t('professional.documentDesign.progress', { sent: progress.submitted, total: progress.total })}</Text>
                <Text variant="regularSmall" color={theme.colors.textSecondary}>{Math.round(progress.submitted / progress.total * 100)} %</Text>
            </ProgressHeader> : null}
            {hasKnownDocumentStatuses ? <ProgressTrack accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: progress.total, now: progress.submitted }}>
                <ProgressFill $percent={progress.submitted / progress.total * 100} />
            </ProgressTrack> : null}
            {PROFESSIONAL_DOCUMENTS.map(item => {
                const document = getDocumentForType(documents, item.name);
                if (!document) return null;
                const statusKey = document.status === 'approved' ? 'approved' : document.status === 'rejected' ? 'rejected' : document.status === 'pending' ? 'pending' : 'unknown';
                return <DocumentRow key={item.name}>
                    <SvgIcon name={item.icon} size={moderateScale(18)} color={theme.colors.textSecondary} />
                    <DocumentCopy>
                        <Text variant="medium" fontSize={15} color={theme.colors.textPrimary}>{t(item.titleKey)}</Text>
                        <DocumentStatus variant="regularSmall" color={statusKey === 'rejected' ? theme.colors.danger : theme.colors.textSecondary}>{t(`professional.verificationPending.status.${statusKey}`)}</DocumentStatus>
                    </DocumentCopy>
                    {statusKey !== 'unknown' ? <SvgIcon name={statusKey === 'approved' ? 'fa-check-circle' : statusKey === 'rejected' ? 'fa-exclamation-circle' : 'fa-clock'} size={moderateScale(16)} color={statusKey === 'approved' ? theme.colors.success : statusKey === 'rejected' ? theme.colors.danger : theme.colors.primary} /> : null}
                </DocumentRow>;
            })}
            {documents.length === 0 ? <Text variant="regularSmall" color={theme.colors.textSecondary}>{t('professional.verificationPending.documentsUnavailable')}</Text> : null}
            <Logout>
                <Button title={t('professional.verificationPending.logout')} variant="outline" icon="fa-sign-out-alt"
                    textColor={theme.colors.textSecondary} onPress={handleLogout} disabled={isLoggingOut} loading={isLoggingOut} fullWidth />
            </Logout>
        </PendingContainer>
    );
};

const PendingContainer = styled(ScreenContainer).attrs({
    contentContainerStyle: { flexGrow: 1, paddingBottom: verticalScale(24) },
})``;
const Logo = styled(LogoMediumPro24Icon)`
    align-self: center;
    margin-bottom: ${verticalScale(4)}px;
`;
const Illustration = styled.Image`
    width: 100%;
    height: ${verticalScale(125)}px;
    margin-top: ${verticalScale(4)}px;
    margin-bottom: ${verticalScale(12)}px;
`;
const Title = styled(Text)`text-align: center;`;
const Description = styled(Text)`
    text-align: center;
    margin-top: ${verticalScale(8)}px;
`;
const Timeline = styled.View`
    margin-top: ${verticalScale(20)}px;
    padding: ${moderateScale(16)}px;
    padding-bottom: ${moderateScale(8)}px;
    border-radius: ${moderateScale(14)}px;
    background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;
const Step = styled.View`
    flex-direction: row;
    gap: ${horizontalScale(14)}px;
    min-height: ${verticalScale(38)}px;
`;
const StepMarker = styled.View`
    align-items: center;
    width: ${moderateScale(24)}px;
`;
const StepLine = styled.View`
    width: ${horizontalScale(2)}px;
    flex: 1;
    margin-vertical: ${verticalScale(3)}px;
    background-color: ${({ theme }) => theme.colors.border};
`;
const StepCopy = styled.View`
    flex: 1;
    padding-bottom: ${verticalScale(8)}px;
`;
const DocumentsTitle = styled(Text)`
    margin-top: ${verticalScale(22)}px;
    margin-bottom: ${verticalScale(8)}px;
`;
const ProgressHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    gap: ${horizontalScale(8)}px;
`;
const ProgressTrack = styled.View`
    height: ${verticalScale(7)}px;
    border-radius: ${moderateScale(4)}px;
    overflow: hidden;
    margin-vertical: ${verticalScale(10)}px;
    background-color: ${({ theme }) => theme.colors.border};
`;
const ProgressFill = styled.View<{ $percent: number }>`
    height: 100%;
    width: ${({ $percent }) => $percent}%;
    border-radius: ${moderateScale(4)}px;
    background-color: ${({ theme }) => theme.colors.primary};
`;
const DocumentRow = styled.View`
    flex-direction: row;
    align-items: center;
    gap: ${horizontalScale(12)}px;
    padding-vertical: ${verticalScale(12)}px;
    min-height: ${verticalScale(60)}px;
    border-bottom-width: ${StyleSheet.hairlineWidth}px;
    border-bottom-color: ${({ theme }) => theme.colors.borderLight};
`;
const DocumentCopy = styled.View`flex: 1;`;
const DocumentStatus = styled(Text)`margin-top: ${verticalScale(3)}px;`;
const Logout = styled.View`margin-top: ${verticalScale(20)}px;`;

export default ProfessionalVerificationPendingScreen;
