import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText, Button, colors, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import ScreenContainer from '@components/ScreenContainer';
import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES, OTP_CODE_LENGTH } from '../constants';
import { AuthStepProgress, OtpCodeInput } from '../components';
import Pro24Logo from '../../../../assets/logo/logo-mediumPro24.svg';

type Props = NativeStackScreenProps<any>;

export const C07ClientOtp: React.FC<Props> = ({ navigation, route }) => {
  const [code, setCode] = useState('');
  const phone = (route.params as any)?.phone ?? '';

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea={false}>
      <View style={styles.container}>
        <View style={styles.logo}><Pro24Logo width={150} height={64} /></View>
        <AuthStepProgress current={2} labels={[t('module1.steps.account'), t('module1.steps.verification'), t('module1.steps.done')]} />

        <View style={styles.header}>
          <AppText variant="h1" align="center" color={colors.text}>{t('module1.otp.title')}</AppText>
          <AppText variant="bodyLarge" align="center" color={colors.textMuted}>{t('module1.otp.subtitle')}</AppText>
          {phone ? <AppText variant="bodyMedium" align="center" color={colors.primary[600]}>{phone}</AppText> : null}
        </View>

        <View style={styles.visualCard}>
          <View style={styles.phoneMock}>
            <View style={styles.otpBubble}>
              <AppText variant="h2" color={colors.primary[600]}>***</AppText>
            </View>
          </View>
        </View>

        <AppText variant="title" align="center" color={colors.text}>{t('module1.otp.enterCode')}</AppText>
        <OtpCodeInput value={code} length={OTP_CODE_LENGTH} onChangeText={setCode} />

        <View style={styles.resendCard}>
          <View>
            <AppText variant="bodyMedium" color={colors.text}>{t('module1.otp.noCode')}</AppText>
            <AppText variant="body" color={colors.textMuted}>{t('module1.otp.noCodeDescription')}</AppText>
          </View>
          <Button title={t('module1.otp.resend')} variant="ghost" fullWidth={false} onPress={() => { }} />
        </View>

        <Button title={t('module1.otp.button')} rightIcon="arrowRight" onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.registerSuccess)} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sizes.screen.horizontalPadding, paddingTop: vSpacing[6], paddingBottom: vSpacing[6], backgroundColor: colors.background },
  logo: { alignItems: 'center' },
  header: { gap: vSpacing[2] },
  visualCard: { alignItems: 'center', justifyContent: 'center', height: vSpacing[16] * 2.3 },
  phoneMock: { width: spacing[16] * 2, height: vSpacing[16] * 2, borderRadius: radius['2xl'], backgroundColor: colors.primary[50], alignItems: 'center', justifyContent: 'center' },
  otpBubble: { borderRadius: radius.xl, backgroundColor: colors.white, paddingHorizontal: spacing[8], paddingVertical: vSpacing[4], ...shadows.sm },
  resendCard: { borderRadius: radius.xl, backgroundColor: colors.white, padding: spacing[4], marginVertical: vSpacing[4], gap: vSpacing[2], ...shadows.sm },
});
