import { buildPhoneVerificationRequest, normalizeVerificationPhone } from '../model/phone-verification';
import { Text } from '@shared/ui';
import { Button } from '@shared/ui/button/Button';
import Field from '@shared/ui/form/HookFormField';
import AppImage from '@shared/ui/image/AppImage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IRole } from '@utils/constant';
import { Keyboard, ScrollView, View, type KeyboardEvent } from 'react-native';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from '@core/notifications/toast';
import styled from 'styled-components/native';

import { Spinner } from '@shared/ui';
import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import NavigationHeader from '@shared/ui/navigation/NavigationHeader';
import { AppStackType } from '../../../navigation/constant/core';
import { useVerifyAccountMutation, useResendVerificationMutation } from '@features/auth/api/auth.api';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface RouteParams {
    email?: string | null;
    phone_number?: string;
    role: IRole;
}

// Styled Components
const FormViewport = styled(View)<{ $availableHeight: number | null }>`
  flex: 1;
  ${({ $availableHeight }) => $availableHeight !== null && `max-height: ${$availableHeight}px;`}
`;

const FormScrollView = styled(ScrollView)`
  flex: 1;
`;

const InputSection = styled.View`
  width: 100%;
  align-items: center;
`;

const HeaderContainer = styled.View`
  align-items: center;
  padding-horizontal: ${horizontalScale(20)}px;
  padding-bottom: ${verticalScale(24)}px;
`;

const BrandIconContainer = styled.View`
  margin-vertical: ${verticalScale(2)}px;
`;

const DescriptionText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResendTouchable = styled.TouchableOpacity`
  margin-top: ${verticalScale(16)}px;
`;

const ResendText = styled.Text`
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
`;

const TimerContainer = styled.View`
  margin-top: ${verticalScale(16)}px;
`;

const TimerText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LoaderContainer = styled.View`
  margin-top: ${verticalScale(16)}px;
  align-items: center;
  justify-content: center;
`;

const VerifyButtonContainer = styled.View`
  margin-top: ${verticalScale(16)}px;
  width: 70%;
`;

export const VerifyAccountScreen = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation<AppNavigationProp>();
    const params = (route.params || { role: 'client' }) as RouteParams;

    const { handleSubmit, control, getValues } = useForm({
        defaultValues: {
            code: '',
            email: params.email || '',
            phone_number: params.phone_number || '',
        },
    });
    const requestBusy = useRef(false);
    const [_resending, setResending] = useState(false);
    const [_verifying, setVerifying] = useState(false);
    const [timer, setTimer] = useState(5 * 60);
    const [phoneNeedsCorrection, setPhoneNeedsCorrection] = useState(false);
    const scrollRef = useRef<ScrollView>(null);
    const viewportRef = useRef<View>(null);
    const [availableHeight, setAvailableHeight] = useState<number | null>(null);
    const inputSectionY = useRef(0);
    const keyboardVisible = useRef(false);

    const revealInputs = useCallback(() => {
        if (keyboardVisible.current) {
            scrollRef.current?.scrollTo({
                y: Math.max(0, inputSectionY.current - verticalScale(16)),
                animated: true,
            });
        }
    }, []);

    useEffect(() => {
        const updateKeyboardSpace = (event: KeyboardEvent) => {
            keyboardVisible.current = true;
            viewportRef.current?.measureInWindow((_x, y) => {
                if (!keyboardVisible.current) return;
                setAvailableHeight(Math.max(0, event.endCoordinates.screenY - y - verticalScale(16)));
                revealInputs();
            });
        };
        const show = Keyboard.addListener('keyboardDidShow', updateKeyboardSpace);
        const change = Keyboard.addListener('keyboardWillChangeFrame', updateKeyboardSpace);
        const hide = Keyboard.addListener('keyboardDidHide', () => {
            keyboardVisible.current = false;
            setAvailableHeight(null);
        });
        return () => {
            show.remove();
            change.remove();
            hide.remove();
        };
    }, [revealInputs]);

    // API mutations
    const [verifyAccount] = useVerifyAccountMutation();
    const [resendVerification] = useResendVerificationMutation();

    // Timer effect - countdown from 5 minutes after unsuccessful resend
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer]);

    const doVerification = async () => {
        if (requestBusy.current) return;
        requestBusy.current = true;
        try {
            setVerifying(true);
            const code = getValues('code');

            if (!/^\d{6}$/.test(code.trim())) {
                Toast.show(t('ui.form.code.invalid') || 'Invalid code', {
                    type: 'warning',
                    placement: 'bottom',
                    duration: 4000,
                });
                setVerifying(false);
                return;
            }

            const phone = normalizeVerificationPhone(getValues('phone_number'));
            if (!phone) {
                setPhoneNeedsCorrection(true);
                Toast.show(t('auth.onboarding.phoneRequired'), { type: 'danger', placement: 'bottom' });
                return;
            }
            if (phone.length > 15 || !/^\+?\d+$/.test(phone)) {
                setPhoneNeedsCorrection(true);
                Toast.show(t(phone.length > 15 ? 'auth.onboarding.phoneTooLong' : 'ui.form.phone.invalid'), { type: 'danger', placement: 'bottom' });
                return;
            }
            const result = await verifyAccount(buildPhoneVerificationRequest(code, phone)).unwrap();

            // Show success message
            const successMessage = result?.message || t('auth.verificationSuccess') || 'Email verified successfully';
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });


            navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: params.role || 'client' } }] });

        } catch (error: any) {
            console.error('Verification error:', error);

            let errorMessage = t('auth.verificationFailed') || 'Verification failed. Please try again.';

            if (error?.data?.message) {
                errorMessage = error.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            Toast.show(errorMessage, {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
            });
        } finally {
            requestBusy.current = false;
            setVerifying(false);
        }
    };

    const resendCode = async () => {
        // Don't allow resend if timer is still running
        if (timer > 0 || requestBusy.current) return;
        if (!params.email?.trim()) {
            Toast.show(t('auth.onboarding.emailRequired'), { type: 'danger', placement: 'bottom' });
            return;
        }
        requestBusy.current = true;
        try {
            setResending(true);

            const result = await resendVerification({
                email: params.email,
            }).unwrap();

            setTimer(300);
            const successMessage = result?.message || t('auth.codeSent') || 'Verification code sent to your email';
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });

        } catch (error: any) {
            console.error('Resend error:', error);

            let errorMessage = t('auth.resendFailed') || 'Failed to resend code. Please try again.';

            // Check if error contains a wait time message and extract/set 5 minute timer
            if (error?.data?.message) {
                errorMessage = error.data.message;
                // If error is about waiting time, set timer to 5 minutes (300 seconds)
                if (errorMessage.toLowerCase().includes('patienter') || errorMessage.toLowerCase().includes('wait')) {
                    setTimer(300);
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }

            Toast.show(errorMessage, {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
            });
        } finally {
            requestBusy.current = false;
            setResending(false);
        }
    };

    // Format timer display as MM:SS
    const formatTimer = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <ScreenContainer withBottomSafeArea>
            <NavigationHeader showBackButton={true} logoSize={moderateScale(120)} />
            <FormViewport ref={viewportRef} collapsable={false} $availableHeight={availableHeight}>
            <FormScrollView
                ref={scrollRef}
                onLayout={revealInputs}
                onContentSizeChange={revealInputs}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
            >
            <HeaderContainer>
                <BrandIconContainer>
                    <AppImage
                        source={require('../../../assets/images/sms.png')}
                        style={{
                            marginTop: verticalScale(5),
                        }}
                        resizeMode='contain'
                        showLoader={false}
                        width={horizontalScale(280)}
                        height={verticalScale(240)}
                    />
                </BrandIconContainer>

                <Text variant="title">{t('screen.verifyAccount')}</Text>

                <DescriptionText>
                    {t('terms.labelCode')}
                </DescriptionText>

                <InputSection onLayout={event => {
                    inputSectionY.current = event.nativeEvent.layout.y;
                    revealInputs();
                }}>
                {!params.phone_number || phoneNeedsCorrection ? <Field
                    name="phone_number"
                    required
                    control={control}
                    label={t('ui.form.phone.label')}
                    placeholder={t('ui.form.phone.placeholder')}
                    keyboardType="phone-pad"
                /> : null}

                <Field
                    name="code"
                    required
                    control={control}
                    placeholder={t('ui.form.code.label')}
                    code
                />

                {timer > 0 ? (
                    <TimerContainer>
                        <TimerText>
                            {t('ui.form.code.resendIn')} {formatTimer(timer)}
                        </TimerText>
                    </TimerContainer>
                ) : (
                    <ResendTouchable onPress={resendCode}>
                        <ResendText>
                            {t('ui.button.resendCode')}
                        </ResendText>
                    </ResendTouchable>
                )}

                {(_verifying || _resending) && (
                    <LoaderContainer>
                        <Spinner
                            visible={true}
                            animationType='dots'
                            onRequestClose={() => undefined}
                        />
                    </LoaderContainer>
                )}

                <VerifyButtonContainer>
                    <Button
                        variant="primary"
                        title={t('ui.button.validate')}
                        onPress={handleSubmit(doVerification)}
                        fullWidth

                        disabled={_verifying || _resending}
                    />
                </VerifyButtonContainer>
                </InputSection>
            </HeaderContainer>
            </FormScrollView>
            </FormViewport>
        </ScreenContainer>
    );
};
