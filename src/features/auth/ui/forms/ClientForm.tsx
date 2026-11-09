import FormProgress from './FormProgress';
import { Button } from '@shared/ui/button/Button';
import Field, { FieldValidators } from '@shared/ui/form/HookFormField';
import { validateClientRegistration, mapApiError, prepareRegistrationPayload } from '@features/auth/services/registration';
import { Spinner } from '@shared/ui/overlay/AppSpinner';
import Text from '@shared/ui/typography/Text';
import { horizontalScale } from '@utils/normalizedCss';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Toast } from '@core/notifications/toast';
import { getOneSignalSubscriptionId } from '../../../../core/notifications/oneSignalSubscription';
import styled from 'styled-components/native';
import { useTheme } from '@theme';

// Import from new Redux architecture
import { useRegisterClientMutation } from '@features/auth/api/auth.api';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectAuthLoading, setError, setLoading } from '@store/slices/authSlice';
import type { RegisterClientRequest } from '@entities/user/model';

interface ClientFormProps {
    onSuccess?: (data: RegisterClientRequest) => void;
    onError?: (error: any) => void;
}
const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView)`
  flex: 1;
  padding-horizontal: 0px;
`;

const FormContainer = styled(View)`
  width: 100%;
  padding: 0px;
`;

const FormIntro = styled(View)`
  margin-bottom: 18px;
`;


const fieldStyle = {
    marginBottom: 10,
    width: '100%',
};

const ButtonGroup = styled(View)<{ $compact: boolean }>`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(10)}px;
  margin-top: ${({ $compact }) => $compact ? 16 : 40}px;
  padding-top: 20px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const PreviousButtonWrapper = styled(View)`
  flex: 1;
`;

const NextButtonWrapper = styled(View)`
  flex: 1;
`;

const SubmitButtonWrapper = styled(View)`
  flex: 1;
`;

const ClientForm = ({ onSuccess, onError }: ClientFormProps) => {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const [formWidth, setFormWidth] = useState(width - 36);
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    // Use the new RTK Query mutation hook
    const [registerClient, { isLoading, error, isSuccess }] = useRegisterClientMutation();
    const steps = [
        { title: t('ui.form.personalInfo.label'), fields: ['first_name', 'last_name', 'address', 'postal_code', 'phone_number'] },
        { title: t('ui.form.security.label'), fields: ['email', 'password'] },
    ];

    // Use selector from new auth slice
    const authLoading = useAppSelector(selectAuthLoading);

    const [step, setStep] = useState(0);
    const [submittedData, setSubmittedData] = useState<RegisterClientRequest | null>(null);
    const { control, handleSubmit, trigger, formState: { errors, isValid } } = useForm<RegisterClientRequest>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone_number: '',
            address: '',
            postal_code: '',
            onesignal_key: '', // Will be populated
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    // Handle registration success
    useEffect(() => {
        if (isSuccess && onSuccess && submittedData) {
            onSuccess(submittedData);
        }
    }, [isSuccess, onSuccess, submittedData]);

    // Handle API errors
    useEffect(() => {
        if (error) {
            console.error('Registration error:', error);

            let errorMessage = t('auth.registrationFailed');

            // Extract error message from RTK Query error
            if ('data' in error && error.data) {
                const apiError = error.data as any;
                errorMessage = apiError?.message ||
                    apiError?.errors?.email?.[0] ||
                    apiError?.errors?.password?.[0] ||
                    errorMessage;
            } else if ('error' in error) {
                errorMessage = error.error || errorMessage;
            }

            // Dispatch error to auth slice
            dispatch(setError(errorMessage));

            // Show toast to user
            Toast.show(errorMessage, {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
            });

            if (onError) {
                onError(error);
            }
        }

        // Clear error when component unmounts
        return () => {
            dispatch(setError(null));
        };
    }, [error, t, dispatch, onError]);

    // Clear loading state on unmount
    useEffect(() => {
        return () => {
            dispatch(setLoading(false));
        };
    }, [dispatch]);

    const nextStep = async () => {
        const stepFields = step === 0
            ? ['first_name', 'last_name', 'address', 'postal_code', 'phone_number']
            : ['email', 'password'];

        const valid = await trigger(stepFields as any);
        if (valid) {
            setStep(prev => prev + 1);
        } else {
            const firstError = Object.keys(errors)[0];
            if (firstError) {
                Toast.show(errors[firstError as keyof RegisterClientRequest]?.message as string, {
                    type: 'danger',
                    placement: 'bottom',
                    duration: 4000,
                });
            }
        }
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 0));
    };

    const onSubmit = async (data: RegisterClientRequest) => {
        try {
            // Validate data before submission
            const validationErrors = validateClientRegistration(data);
            if (validationErrors.length > 0) {
                validationErrors.forEach(err => {
                    Toast.show(err.message, {
                        type: 'danger',
                        placement: 'bottom',
                        duration: 4000,
                    });
                });
                return;
            }

            // Set loading state in auth slice
            dispatch(setLoading(true));

            // Store the submitted data for success callback
            setSubmittedData(data);

            // Prepare the registration data with defaults
            const onesignalKey = await getOneSignalSubscriptionId();
            const registrationData = prepareRegistrationPayload(data, 'client', onesignalKey);

            // Call the API using RTK Query mutation
            const result = await registerClient(registrationData).unwrap();

            console.log('Registration successful:', result);

            // Show success message from API response
            const successMessage = result?.message || t('auth.registrationFailed');
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });

            // Dispatch success loading state
            dispatch(setLoading(false));

        } catch (err) {
            // Map API errors to structured format
            const apiErrors = mapApiError(err);
            apiErrors.forEach(apiError => {
                Toast.show(apiError.message, {
                    type: 'danger',
                    placement: 'bottom',
                    duration: 4000,
                });
            });
            console.error('Registration failed:', err);
            dispatch(setLoading(false));
        }
    };


    return (
        <StyledKeyboardAwareScrollView
            enableOnAndroid
            enableAutomaticScroll
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight={30}
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}>

            <FormContainer onLayout={event => { if (event.nativeEvent.layout.width > 0) setFormWidth(event.nativeEvent.layout.width); }}>
                <FormIntro>
                    <Text variant="bold" color={theme.colors.textPrimary} fontSize={26} lineHeight={32}>
                        {step === 0 ? t('auth.formDesign.profileTitle') : t('ui.form.security.label')}
                    </Text>
                    <Text variant="regular" color={theme.colors.textSecondary} fontSize={14} lineHeight={20} style={styles.description}>
                        {t(step === 0 ? 'auth.formDesign.profileDescriptionClient' : 'auth.registrationSteps.clientSecurityDescription')}
                    </Text>
                </FormIntro>
                <FormProgress labels={['profile', 'security'].map(key => t(`auth.formDesign.steps.${key}`))}
                    step={step} testID="client-form" counter={t('auth.registrationSteps.counter', { current: step + 1, total: steps.length })} />

                {step === 0 && (
                    <>
                        <Field<RegisterClientRequest>
                            name="first_name"
                            label={t('ui.form.firstName.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.firstName.placeholder')}
                            autoCapitalize="words"
                            keyboardType="default"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.firstName.required'),
                                minLength: {
                                    value: 2,
                                    message: t('ui.form.firstName.minLength'),
                                },
                                validate: {
                                    noNumbers: (value: any) =>
                                        !value || !/\d/.test(String(value)) || t('ui.form.error.noNumbers'),
                                },
                            }}
                            accessoryLeft="fa-user"
                            containerStyle={fieldStyle}
                            animated
                        />

                        <Field<RegisterClientRequest>
                            name="last_name"
                            label={t('ui.form.lastName.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.lastName.placeholder')}
                            autoCapitalize="words"
                            keyboardType="default"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.lastName.required'),
                                minLength: {
                                    value: 2,
                                    message: t('ui.form.lastName.minLength'),
                                },
                                validate: {
                                    noNumbers: (value: any) =>
                                        !/\d/.test(String(value)) || t('ui.form.error.noNumbers'),
                                },
                            }}
                            accessoryLeft="fa-user"
                            containerStyle={fieldStyle}
                            animated
                        />

                        <Field<RegisterClientRequest>
                            name="address"
                            label={t('ui.form.address.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.address.placeholder')}
                            autoCapitalize="sentences"
                            keyboardType="default"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.address.required'),
                                minLength: {
                                    value: 3,
                                    message: t('ui.form.address.minLength'),
                                },
                            }}
                            accessoryLeft="fa-map-marker-alt"
                            containerStyle={fieldStyle}
                            animated
                        />

                        <View style={formWidth >= 335 ? styles.contactRow : styles.contactStack}>
                        <Field<RegisterClientRequest>
                            name="postal_code"
                            label={t('ui.form.postCode.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.postCode.placeholder')}
                            autoCapitalize="characters"
                            keyboardType="number-pad"
                            returnKeyType="next"
                            maxLength={5}
                            rules={{
                                required: t('ui.form.postCode.required'),
                                pattern: {
                                    value: /^\d{5}$/,
                                    message: t('ui.form.postCode.invalid'),
                                },
                            }}
                            accessoryLeft="fa-map-marker-alt"
                            containerStyle={[fieldStyle, formWidth >= 335 && styles.postalField]}
                            animated
                        />

                        <Field<RegisterClientRequest>
                            name="phone_number"
                            label={t('ui.form.phone.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.phone.placeholder')}
                            isPhone={true}
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.phone.required'),
                                pattern: {
                                    value: /^[+]?[\d\s-]{10,}$/,
                                    message: t('ui.form.phone.invalid'),
                                },
                            }}
                            containerStyle={[fieldStyle, formWidth >= 335 && styles.phoneField]}
                            animated
                        />
                        </View>
                    </>
                )}

                {step === 1 && (
                    <>
                        <Field<RegisterClientRequest>
                            name="email"
                            label={t('ui.form.email.label')}
                            required
                            email // Auto-applies email validation
                            control={control}
                            placeholder={t('ui.form.email.placeholder')}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            returnKeyType="next"
                            rules={FieldValidators.required(t('ui.form.email.required'))}
                            accessoryLeft="fa-envelope-open-text"
                            containerStyle={fieldStyle}
                        />

                        {/* Password */}
                        <Field<RegisterClientRequest>
                            name="password"
                            label={t('ui.form.password.label')}
                            required
                            password // Auto-applies password validation
                            control={control}
                            placeholder={t('ui.form.password.placeholder')}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                            rules={FieldValidators.required(t('ui.form.password.required'))}
                            accessoryLeft="fa-lock"
                            containerStyle={fieldStyle}
                        />
                    </>
                )}

                <ButtonGroup $compact={formWidth < 335}>
                    {step > 0 && (
                        <PreviousButtonWrapper>
                            <Button
                                title={t('ui.button.previous')}
                                onPress={prevStep}
                                variant="outline"
                                size="large"
                                height={48}
                                disabled={isLoading || authLoading}
                            />
                        </PreviousButtonWrapper>
                    )}

                    {step === 0 ? (
                        <NextButtonWrapper>
                            <Button
                                title={t('common.actions.continue')}
                                testID="client-form-primary-action"
                                onPress={nextStep}
                                variant="primary"
                                size="large"
                                height={48}
                                disabled={isLoading || authLoading || !isValid}
                                loading={isLoading || authLoading}
                                fullWidth
                            />
                        </NextButtonWrapper>
                    ) : (
                        <SubmitButtonWrapper>
                            <Button
                                title={t('ui.button.signUp')}
                                testID="client-form-primary-action"
                                onPress={handleSubmit(onSubmit)}
                                variant="primary"
                                size="large"
                                height={48}
                                disabled={isLoading || authLoading}
                                loading={isLoading || authLoading}
                                fullWidth
                            />
                        </SubmitButtonWrapper>
                    )}
                </ButtonGroup>

                {/* Show loading spinner */}
                {(isLoading || authLoading) && (
                    <Spinner
                        visible={true}
                        animationType='dots'
                        onRequestClose={function (): void {
                            // Registration cannot be dismissed while the server responds.
                        }}
                    />
                )}
            </FormContainer>
        </StyledKeyboardAwareScrollView>
    );
};

export default ClientForm;

const styles = StyleSheet.create({
    description: { marginTop: 10 },
    contactRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
    contactStack: { width: '100%' },
    postalField: { width: '36%' },
    phoneField: { flex: 1, width: undefined },
});
