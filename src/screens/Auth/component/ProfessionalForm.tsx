// screens/auth/component/professional_form/index.tsx
import { Button, Field, Spinner } from '@components/index';
import { validateProfessionalRegistration, mapApiError, prepareRegistrationPayload } from '@services/index';
import { Colors } from '@utils/constant';
import { StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';



// Import from new Redux architecture
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { RegisterProfessionalRequest, Service } from '@store/api/api.types';
import { useRegisterProfessionalMutation } from '@store/api/endpoints/auth';
import { selectAuthLoading, setError, setLoading } from '@store/slices/authSlice';

// Components
import ListeServices from './ListServices';
import Text from '@components/Text';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';

import { colors } from '@theme/index';
import ServicesSkeleton from './ServicesSkeleton';
import { Toast } from 'react-native-toast-notifications';



const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: ${verticalScale(18)}px;
  padding-bottom: ${verticalScale(28)}px;
`;

const StepContainer = styled(View)`
  width: 100%;
`;

const StepIndicator = styled(View)`
  width: 100%;
  margin-bottom: ${verticalScale(18)}px;
`;

const ProgressHeader = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${verticalScale(8)}px;
`;

const ProgressLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter-Bold';
  font-size: 13px;
`;

const ProgressHint = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Regular';
  font-size: 12px;
  margin-left: ${horizontalScale(12)}px;
  text-align: right;
`;

const ProgressTrack = styled(View)`
  height: 6px;
  overflow: hidden;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.surfaceVariant};
`;

const ProgressFill = styled(View)<{ width: string }>`
  width: ${({ width }) => width};
  height: 100%;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

const FormIntro = styled(View)`
  margin-bottom: ${verticalScale(20)}px;
`;

const FormKicker = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Bold';
  font-size: 11px;
  letter-spacing: 1px;
  margin-bottom: ${verticalScale(6)}px;
`;

const FormDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Regular';
  font-size: 13px;
  line-height: 19px;
  margin-top: ${verticalScale(8)}px;
`;

const StepTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter-Bold';
  font-size: 18px;
`;

const ButtonGroup = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: ${verticalScale(20)}px;
`;

const ErrorText = styled(Text)`
  color: ${Colors.danger};
  marginTop: ${verticalScale(10)}px;
  textAlign: center;
`;

const ScrollContainer = styled(KeyboardAwareScrollView)`
  flexGrow: 1;
  width: 100%;
  padding-horizontal: ${horizontalScale(20)}px;
  paddingVertical: ${verticalScale(5)}px;
`;

const PreviousButton = styled(Button)`
  flex: 1;
  margin-right: ${verticalScale(10)}px;
`;

const NextButton = styled(Button)`
  flex: 1;
  margin-left: ${verticalScale(10)}px;
`;

const SubmitButton = styled(Button)`
  flex: 1;
`;

// Types
interface ProfessionalFormProps {
    onSuccess?: (data: RegisterProfessionalRequest) => void;
    onError?: (error: any) => void;
    services: Service[];
    servicesLoading?: boolean;

}

const ProfessionalForm = ({ onSuccess, onError, services, servicesLoading }: ProfessionalFormProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    // Use the new RTK Query mutation hook
    const [registerProfessional, { isLoading, error, isSuccess }] = useRegisterProfessionalMutation();

    // Use selector from new auth slice
    const authLoading = useAppSelector(selectAuthLoading);

    // State for multi-step form
    const [step, setStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedData, setSubmittedData] = useState<RegisterProfessionalRequest | null>(null);

    const { control, handleSubmit, trigger, formState: { errors } } = useForm<RegisterProfessionalRequest>({
        defaultValues: {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            phone_number: '',
            address: '',
            postal_code: '',
            company_name: '',
            siret_number: '',
            services: [],
            onesignal_key: '',
            lang: 'fr',
        },
        mode: 'onBlur',
    });

    // Define form steps
    const steps = [
        { title: t('ui.form.personalInfo.label'), fields: ['first_name', 'last_name', 'address', 'postal_code', 'phone_number'] },
        { title: t('ui.form.companyInfo.label'), fields: ['company_name', 'siret_number'] },
        { title: t('ui.form.security.label'), fields: ['email', 'password'] },
        { title: t('ui.form.services.label'), fields: ['services'] },
    ];

    // Handle registration success
    useEffect(() => {
        if (isSuccess && onSuccess && submittedData) {
            onSuccess(submittedData);
        }
    }, [isSuccess, onSuccess, submittedData]);

    // Handle API errors
    useEffect(() => {
        if (error) {
            console.error('Professional registration error:', error);

            let errorMessage = t('auth.registrationFailed');

            if ('data' in error && error.data) {
                const apiError = error.data as any;
                errorMessage = apiError?.errors || errorMessage;
            } else if ('error' in error) {
                errorMessage = error.error || errorMessage;
            }

            dispatch(setError(errorMessage));
            errorMessage && typeof errorMessage === 'object' && (() => {
                const field = Object.keys(errorMessage)[0];
                if (field) {
                    const msgArr = errorMessage[field];
                    let msg = Array.isArray(msgArr) ? msgArr[0] : msgArr;

                    console.log(`Error in field ${field}: ${msg}`);
                    return Toast.show(`${field}: ${String(msg)}`, {
                        type: 'danger',
                        placement: 'bottom',
                        duration: 4000,

                    });;

                }
            })();



            if (onError) {
                onError(error);
            }

            setIsSubmitting(false);
        }

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

    // Navigation to next step with validation
    const nextStep = async () => {
        const currentStepFields = steps[step]?.fields ?? [];

        // For services step, just proceed if at least one service is selected
        if (step === 3) {
            if (selectedServices.length === 0) {
                Toast.show(t('ui.form.services.required'), {
                    type: 'danger',
                    placement: 'bottom',
                    duration: 4000,
                });
                return;
            }
            setStep(prev => prev + 1);
            return;
        }

        // Validate current step fields
        const isValid = await trigger(currentStepFields as any);

        if (isValid) {
            setStep(prev => prev + 1);
        } else {
            // Scroll to first error
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                Toast.show(errors[firstErrorField as keyof RegisterProfessionalRequest]?.message as string, {
                    type: 'danger',
                    placement: 'bottom',
                    duration: 4000,
                });
            }
        }
    };

    const prevStep = () => {
        setStep(prev => prev - 1);
    };

    const handleServiceSelection = (serviceIds: number[]) => {
        setSelectedServices(serviceIds);
    };

    const onSubmit = async (data: RegisterProfessionalRequest) => {
        try {
            // Validate data before submission
            const validationErrors = validateProfessionalRegistration(data, selectedServices);
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

            setIsSubmitting(true);
            dispatch(setLoading(true));

            // Store the submitted data for success callback
            setSubmittedData(data);

            // Prepare the registration data with defaults
            const registrationData = prepareRegistrationPayload(
                data,
                'professional',
                'onesignal-device-token-here',
                selectedServices
            );

            console.log('Submitting professional registration:', {
                ...registrationData,
                password: '***HIDDEN***'
            });

            const result = await registerProfessional(registrationData).unwrap();

            console.log('Professional registration successful:', result);

            // Show success message from API response
            const successMessage = result?.message || t('auth.registrationSuccess');
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });

            dispatch(setLoading(false));
            setIsSubmitting(false);

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
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <StepIndicator>
            <ProgressHeader>
                <ProgressLabel testID="professional-form-step">Étape {step + 1} sur {steps.length}</ProgressLabel>
                <ProgressHint>{['Vos informations', 'Votre activité', 'Votre sécurité', 'Vos services'][step]}</ProgressHint>
            </ProgressHeader>
            <ProgressTrack testID="professional-form-progress">
                <ProgressFill width={`${((step + 1) / steps.length) * 100}%`} />
            </ProgressTrack>
        </StepIndicator>
    );

    const renderStepTitle = () => (
        <FormIntro>
            <FormKicker>CRÉATION DE COMPTE PROFESSIONNEL</FormKicker>
            <StepTitle>{steps[step]?.title ?? ''}</StepTitle>
            <FormDescription>
                {[
                    'Présentez-vous pour commencer votre inscription.',
                    'Ajoutez les informations de votre activité professionnelle.',
                    'Créez vos identifiants pour accéder à votre espace.',
                    'Choisissez les services que vous proposez.',
                ][step]}
            </FormDescription>
        </FormIntro>
    );

    return (
        <ScrollContainer
            contentContainerStyle={styles.scroll}
            enableOnAndroid
            enableAutomaticScroll
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight={30}
            keyboardOpeningTime={0}>

            <Container>
                {renderStepIndicator()}
                {renderStepTitle()}

                {/* Step 0: Personal Information */}
                {servicesLoading ? (
                    <ServicesSkeleton rows={8} />
                ) :
                    step === 0 && (
                        <StepContainer>
                            <Field<RegisterProfessionalRequest>
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
                                containerStyle={styles.field}
                                animated
                                shakeOnError
                            />

                            <Field<RegisterProfessionalRequest>
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
                                containerStyle={styles.field}
                                animated
                                shakeOnError
                            />

                            <Field<RegisterProfessionalRequest>
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
                                containerStyle={styles.field}
                                animated
                                shakeOnError
                            />

                            <Field<RegisterProfessionalRequest>
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
                                        value: /^\d{4}$/,
                                        message: t('ui.form.postCode.invalid'),
                                    },
                                }}
                                accessoryLeft="fa-map-marker-alt"
                                containerStyle={styles.field}
                                animated
                                shakeOnError
                            />

                            <Field<RegisterProfessionalRequest>
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
                                containerStyle={styles.field}
                                animated
                                shakeOnError
                            />
                        </StepContainer>
                    )}

                {/* Step 1: Company Information */}
                {step === 1 && (
                    <StepContainer>
                        <Field<RegisterProfessionalRequest>
                            name="company_name"
                            label={t('ui.form.companyName.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.companyName.placeholder')}
                            autoCapitalize="words"
                            keyboardType="default"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.companyName.required'),
                                minLength: {
                                    value: 2,
                                    message: t('ui.form.companyName.minLength'),
                                },
                            }}
                            accessoryLeft="fa-building"
                            containerStyle={styles.field}
                            animated
                            shakeOnError
                        />

                        <Field<RegisterProfessionalRequest>
                            name="siret_number"
                            label={t('ui.form.siret.label')}
                            required
                            control={control}
                            placeholder={t('ui.form.siret.placeholder')}
                            keyboardType="number-pad"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.siret.required'),
                                pattern: {
                                    value: /^\d{14}$/,
                                    message: t('ui.form.siret.invalid'),
                                },
                            }}
                            accessoryLeft="fa-id-card"
                            containerStyle={styles.field}
                            animated
                            shakeOnError
                            helperText={t('ui.form.siret.helper')}
                        />
                    </StepContainer>
                )}

                {/* Step 2: Security Information */}
                {step === 2 && (
                    <StepContainer>
                        <Field<RegisterProfessionalRequest>
                            name="email"
                            label={t('ui.form.email.label')}
                            required
                            email
                            control={control}
                            placeholder={t('ui.form.email.placeholder')}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            returnKeyType="next"
                            rules={{
                                required: t('ui.form.email.required'),
                            }}
                            containerStyle={styles.field}
                            animated
                            shakeOnError
                        />

                        <Field<RegisterProfessionalRequest>
                            name="password"
                            label={t('ui.form.password.label')}
                            required
                            password
                            control={control}
                            placeholder={t('ui.form.password.placeholder')}
                            autoCapitalize="none"
                            returnKeyType="done"
                            rules={{
                                required: t('ui.form.password.required'),
                            }}
                            containerStyle={styles.field}
                            animated
                            shakeOnError
                            helperText={t('ui.form.password.helper')}

                        />
                    </StepContainer>
                )}

                {/* Step 3: Services Selection */}
                {step === 3 && (
                    <StepContainer>
                        <ListeServices
                            services={services}
                            selectedServices={selectedServices}
                            onSelect={handleServiceSelection}
                        />
                        {selectedServices.length === 0 && (
                            <ErrorText variant="regular">
                                {t('ui.form.services.required')}
                            </ErrorText>
                        )}
                    </StepContainer>
                )}

                {/* Navigation Buttons */}
                <ButtonGroup>
                    {step > 0 && (
                        <PreviousButton
                            title={t('ui.button.previous')}
                            onPress={prevStep}
                            variant="outline"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting}
                        />
                    )}

                    {step < steps.length - 1 ? (
                            <NextButton
                                title={t('ui.button.next')}
                                testID="professional-form-primary-action"
                            onPress={nextStep}
                            variant="primary"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting || servicesLoading}
                            loading={isLoading || authLoading}
                        />
                    ) : (
                        <SubmitButton
                            title={t('ui.button.signUp')}
                            testID="professional-form-primary-action"
                            onPress={handleSubmit(onSubmit)}
                            variant="primary"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting || selectedServices.length === 0}
                            loading={isLoading || authLoading || isSubmitting}
                            fullWidth
                        />
                    )}
                </ButtonGroup>

                {/* Loading Spinner */}
                {(isLoading || authLoading || isSubmitting) && (
                    <Spinner
                        visible={true}
                        animationType='pulse'
                        onRequestClose={() => { }}
                        showBackdrop={true}
                        iconName='logo-pro24'
                        size={600}
                        color={colors.primary} />
                )}
            </Container>
        </ScrollContainer>
    );
};

const styles = StyleSheet.create({
    field: {
        width: '100%',
        marginBottom: verticalScale(5),
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: verticalScale(76),
    },
});

export default ProfessionalForm;
