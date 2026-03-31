import { Button, Field, Text } from '@components';
import AppImage from '@components/Image/AppImage';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IRole } from '@utils/constant';
import useKeyboardOverlay from '@utils/kayboard';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Toast } from 'react-native-toast-notifications';
import styled from 'styled-components/native';

import { ScreenContainer, NavigationHeader, Spinner } from '@components/index';
import { AppStackType } from '../../navigation/constant/core';
import { useVerifyAccountMutation, useResendVerificationMutation } from '@store/api/endpoints/auth';
import { useAppDispatch } from '@store/hooks';
import { setCredentials } from '@store/slices/authSlice';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface RouteParams {
    email: string;
    role: IRole;
}

// Styled Components
const HeaderContainer = styled.View`
  align-items: center;
  padding-horizontal: ${horizontalScale(20)}px;
`;

const BrandIconContainer = styled.View`
  margin-vertical: ${verticalScale(2)}px;
`;

const DescriptionText = styled.Text`
  margin-top: ${verticalScale(16)}px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
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
  color: ${({ theme }) => theme.colors.text};
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
    const params = route.params as RouteParams;
    const dispatch = useAppDispatch();
    
    const { Overlay } = useKeyboardOverlay();
    const { handleSubmit, control, getValues } = useForm({
        defaultValues: {
            code: '',
            email: params.email,
        },
    });
    const [_resending, setResending] = useState(false);
    const [_verifying, setVerifying] = useState(false);
    const [timer, setTimer] = useState(5*60);
    
    // API mutations
    const [verifyAccount] = useVerifyAccountMutation();
    const [resendVerification] = useResendVerificationMutation();

    // Timer effect - countdown from 5 minutes after unsuccessful resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const doVerification = async () => {
        try {
            setVerifying(true);
            const code = getValues('code');
            
            if (!code || code.length < 4) {
                Toast.show(t('ui.form.code.invalid') || 'Invalid code', {
                    type: 'warning',
                    placement: 'bottom',
                    duration: 4000,
                });
                setVerifying(false);
                return;
            }

            const result = await verifyAccount({
                code,
                email: params.email,
            }).unwrap();

            // Show success message
            const successMessage = result?.message || t('auth.verificationSuccess') || 'Email verified successfully';
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });

            // If result contains user data, update auth state
            if (result.data) {
                dispatch(setCredentials({
                    user: result.data,
                    token: result.data.token || '',
                    refreshToken: result.data.refreshToken,
                }));
            }

            // Navigate based on user role
            setTimeout(() => {
                if (params.role === 'client') {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' as never }],
                    });
                } else {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Welcome' as never }],
                    });
                }
            }, 2000);

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
            setVerifying(false);
        }
    };

    const resendCode = async () => {
        // Don't allow resend if timer is still running
        if (timer > 0) {
            return;
        }

        try {
            setResending(true);
            
            const result = await resendVerification({
                email: params.email,
            }).unwrap();

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
       <ScreenContainer>
        <NavigationHeader showBackButton={true} logoSize={moderateScale(120)} />
                <HeaderContainer>
                    <BrandIconContainer>
                        <AppImage
                            source={require('../../assets/images/sms.png')}
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
                        onRequestClose={function (): void {
                            throw new Error('Function not implemented.');
                        }}
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
                </HeaderContainer>
            <Overlay />
       </ScreenContainer>
    );
};