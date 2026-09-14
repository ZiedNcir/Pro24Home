import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { ACCOUNT_PENDING_STEPS } from '@screens/Home/client/utils/accountPending';

export const AccountPendingScreen = () => {
    const navigation = useNavigation<any>();

    const handleLogout = () => {
        navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    };

    const handleSupport = () => {
        navigation.navigate('ContactSupport');
    };

    return (
        <ScreenContainer scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(14)} backgroundColor={colors.white} contentContainerStyle={styles.content}>
            <Header>
                <LogoMediumPro24Icon width={moderateScale(126)} height={moderateScale(40)} />
                <HelpButton accessibilityRole="button" accessibilityLabel="Aide" onPress={handleSupport}>
                    <SvgIcon name="fa-question" size={18} color={colors.gray900} />
                </HelpButton>
            </Header>

            <Hero>
                <HeroImage source={require('@assets/images/account-pending-illustration.png')} resizeMode="contain" />
                <StatusPill><SvgIcon name="fa-clock" size={14} color={colors.primary} /><Text variant="notification" color={colors.primary}>EN COURS DE VÉRIFICATION</Text></StatusPill>
                <Text variant="title" color={colors.gray900} style={styles.heroTitle}>Votre compte est en cours de vérification</Text>
                <Text variant="regular" color={colors.gray700} style={styles.heroDescription}>Merci ! Notre équipe examine actuellement vos informations professionnelles et vos documents. Vous serez informé dès que votre compte sera activé.</Text>
            </Hero>

            <TimelineCard>
                {ACCOUNT_PENDING_STEPS.map((step, index) => (
                    <TimelineRow key={step.title}>
                        <TimelineRail>
                            <StepCircle status={step.status}>
                                {step.status === 'done' ? <SvgIcon name="fa-check" size={15} color={colors.white} /> : step.status === 'current' ? <View style={styles.currentDot} /> : <Text variant="bold" color={colors.gray700}>{index + 1}</Text>}
                            </StepCircle>
                            {index < ACCOUNT_PENDING_STEPS.length - 1 && <RailLine active={step.status === 'done'} />}
                        </TimelineRail>
                        <View style={styles.stepCopy}><Text variant="bold" color={colors.gray900}>{step.title}</Text><Text variant="regular" color={colors.gray700} style={styles.stepDescription}>{step.description}</Text>{step.status === 'current' && <Text variant="regularSmall" color={colors.primary} style={styles.stepHint}>Cela peut prendre jusqu’à 24 à 48 h.</Text>}</View>
                    </TimelineRow>
                ))}
            </TimelineCard>

            <SupportButton accessibilityRole="button" onPress={handleSupport}>
                <SvgIcon name="fa-headset" size={21} color={colors.white} /><Text variant="bold" color={colors.white}>Contacter le support</Text>
            </SupportButton>
            <LogoutButton accessibilityRole="button" onPress={handleLogout}><SvgIcon name="fa-sign-out-alt" size={18} color={colors.primary} /><Text variant="bold" color={colors.primary}>Se déconnecter</Text></LogoutButton>
        </ScreenContainer>
    );
};

const Header = styled.View`height: ${verticalScale(52)}px; flex-direction: row; align-items: center; justify-content: space-between; margin-bottom: ${verticalScale(12)}px;`;
const HelpButton = styled(Pressable)`width: ${moderateScale(38)}px; height: ${moderateScale(38)}px; border-radius: ${moderateScale(20)}px; border-width: 1px; border-color: ${colors.gray200}; align-items: center; justify-content: center;`;
const Hero = styled.View`align-items: center;`;
const HeroImage = styled(Image)`width: 100%; height: ${verticalScale(205)}px; margin-bottom: ${verticalScale(10)}px;`;
const StatusPill = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(7)}px; background-color: #fff1e8; border-radius: ${moderateScale(18)}px; padding: ${verticalScale(7)}px ${horizontalScale(12)}px; margin-bottom: ${verticalScale(14)}px;`;
const TimelineCard = styled.View`background-color: ${colors.white}; border-width: 1px; border-color: ${colors.gray200}; border-radius: ${moderateScale(18)}px; padding: ${moderateScale(16)}px; margin: ${verticalScale(6)}px 0 ${verticalScale(16)}px;`;
const TimelineRow = styled.View`flex-direction: row; min-height: ${verticalScale(80)}px;`;
const TimelineRail = styled.View`width: ${moderateScale(36)}px; align-items: center;`;
const StepCircle = styled.View<{ status: 'done' | 'current' | 'upcoming' }>`width: ${moderateScale(32)}px; height: ${moderateScale(32)}px; border-radius: ${moderateScale(18)}px; align-items: center; justify-content: center; background-color: ${({ status }) => status === 'done' ? colors.success : status === 'current' ? colors.white : colors.gray100}; border-width: ${({ status }) => status === 'current' ? 2 : 0}px; border-color: ${colors.primary};`;
const RailLine = styled.View<{ active: boolean }>`flex: 1; width: 2px; background-color: ${({ active }) => active ? colors.success : colors.gray200}; margin: ${verticalScale(3)}px 0;`;
const SupportButton = styled(Pressable)`height: ${verticalScale(54)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(10)}px;`;
const LogoutButton = styled(Pressable)`height: ${verticalScale(48)}px; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(8)}px;`;

const styles = StyleSheet.create({
    content: { paddingBottom: verticalScale(24) },
    heroTitle: { textAlign: 'center', fontSize: 23, lineHeight: 29, maxWidth: horizontalScale(320) },
    heroDescription: { textAlign: 'center', lineHeight: 21, marginTop: verticalScale(10), marginBottom: verticalScale(14) },
    currentDot: { width: moderateScale(11), height: moderateScale(11), borderRadius: moderateScale(6), backgroundColor: colors.primary },
    stepCopy: { flex: 1, paddingLeft: horizontalScale(10), paddingTop: verticalScale(3) },
    stepDescription: { marginTop: verticalScale(3), lineHeight: 19 },
    stepHint: { marginTop: verticalScale(4) },
});

export default AccountPendingScreen;
