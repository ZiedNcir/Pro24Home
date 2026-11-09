import FormProgress from './FormProgress';
import { Spinner } from '@shared/ui';
import { Button } from '@shared/ui/button/Button';
import Field from '@shared/ui/form/HookFormField';
import { validateProfessionalRegistration, mapApiError, prepareRegistrationPayload } from '@features/auth/services/registration';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';



// Import from new Redux architecture
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { RegisterProfessionalRequest } from '@entities/user/model';
import type { Service } from '@entities/service/model';
import { useRegisterProfessionalMutation } from '@features/auth/api/auth.api';
import { selectAuthLoading, setError, setLoading } from '@store/slices/authSlice';

// Components
import ListeServices from './ListServices';
import Text from '@shared/ui/typography/Text';
import { verticalScale } from '@utils/normalizedCss';

import { useTheme } from '@theme';
import { resolveSupportedLanguage } from '@utils/locale';
import ServicesSkeleton from './ServicesSkeleton';
import { Toast } from '@core/notifications/toast';
import { getOneSignalSubscriptionId } from '../../../../core/notifications/oneSignalSubscription';



const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
  padding-top: 0px;
  padding-bottom: 0px;
`;

const StepContainer = styled(View)`
  width: 100%;
`;

const FormIntro = styled(View)`
  width: 100%;
  margin-bottom: 18px;
`;


const ButtonGroup = styled(View)<{ $compact: boolean }>`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: ${({ $compact }) => $compact ? 16 : 90}px;
  padding-top: 20px;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;


const ScrollContainer = styled(KeyboardAwareScrollView)`
  flexGrow: 1;
  width: 100%;
  padding-horizontal: 0px;
  padding-vertical: 0px;
`;

const PreviousButton = styled(Button)`
  flex: 1;
  margin-right: ${verticalScale(10)}px;
`;

const NextButton = styled(Button)`
  flex: 1;

`;

const SubmitButton = styled(Button)`
  flex: 1;
`;

// Types
interface ProfessionalFormProps {
    onSuccess?: (data: Pick<RegisterProfessionalRequest, 'email' | 'phone_number'>) => void | Promise<void>;
    referral?: Pick<RegisterProfessionalRequest, 'source' | 'commercial_id'>;
    onError?: (error: any) => void;
    services: Service[];
    servicesLoading?: boolean;

}

const ProfessionalForm = ({ onSuccess, onError, services, servicesLoading, referral }: ProfessionalFormProps) => {
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const [formWidth, setFormWidth] = useState(width - 36);
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    // Use the new RTK Query mutation hook
    const [registerProfessional, { isLoading }] = useRegisterProfessionalMutation();

    // Use selector from new auth slice
    const authLoading = useAppSelector(selectAuthLoading);

    // State for multi-step form
    const [step, setStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);

    const { control, handleSubmit, trigger, setError: setFieldError, formState: { errors } } = useForm<RegisterProfessionalRequest>({
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
            lang: resolveSupportedLanguage([
                { languageCode: i18n.resolvedLanguage || i18n.language },
            ]),
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
        if (submittingRef.current) return;
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

            submittingRef.current = true;
            dispatch(setError(null));
            setIsSubmitting(true);
            dispatch(setLoading(true));

            // Prepare the registration data with defaults
            const onesignalKey = await getOneSignalSubscriptionId();
            const registrationData = prepareRegistrationPayload(
                { ...data, ...referral },
                'professional',
                onesignalKey,
                selectedServices
            );

            await registerProfessional(registrationData as RegisterProfessionalRequest).unwrap();

            // Show success message from API response
            const successMessage = t('auth.onboarding.registrationToSignIn');
            Toast.show(successMessage, {
                type: 'success',
                placement: 'bottom',
                duration: 3000,
            });

            await onSuccess?.({ email: data.email, phone_number: data.phone_number });

        } catch (err) {
            // Map API errors to structured format
            const apiErrors = mapApiError(err);
            let correctionStep = steps.length;
            apiErrors.forEach(apiError => {
                const field = apiError.field?.split('.')[0]?.split('[')[0];
                const fieldStep = steps.findIndex(item => item.fields.includes(field || ''));
                if (field && fieldStep >= 0) {
                    setFieldError(field as keyof RegisterProfessionalRequest, { type: 'server', message: apiError.message });
                    correctionStep = Math.min(correctionStep, fieldStep);
                }
            });
            if (correctionStep < steps.length) setStep(correctionStep);
            apiErrors.forEach(apiError => {
                Toast.show(apiError.message, {
                    type: 'danger',
                    placement: 'bottom',
                    duration: 4000,
                });
            });
            dispatch(setError(apiErrors.map(item => item.message).join('\n')));
            onError?.(err);
        } finally {
            submittingRef.current = false;
            dispatch(setLoading(false));
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => <FormProgress
        labels={['profile', 'company', 'security', 'services'].map(key => t(`auth.formDesign.steps.${key}`))}
        step={step} testID="professional-form"
        counter={t('auth.registrationSteps.counter', { current: step + 1, total: steps.length })}
    />;

    const renderStepTitle = () => (
        <FormIntro>
            <Text variant="bold" color={theme.colors.textPrimary} fontSize={26} lineHeight={32}>{step === 0 ? t('auth.formDesign.profileTitle') : steps[step]?.title ?? ''}</Text>
            <Text variant="regular" color={theme.colors.textSecondary} fontSize={14} lineHeight={20} style={styles.description}>
                {step === 0 ? t('auth.formDesign.profileDescriptionPro') : t(['auth.registrationSteps.professionalProfileDescription', 'auth.registrationSteps.professionalActivityDescription', 'auth.registrationSteps.professionalSecurityDescription', 'auth.registrationSteps.professionalServicesDescription'][step]!)}
            </Text>
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

            <Container onLayout={event => { if (event.nativeEvent.layout.width > 0) setFormWidth(event.nativeEvent.layout.width); }}>
                {renderStepTitle()}
                {renderStepIndicator()}

                {/* Step 0: Personal Information */}
                {step === 0 && (
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
                            />

                            <View style={formWidth >= 335 ? styles.contactRow : styles.contactStack}>
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
                                        value: /^\d{5}$/,
                                        message: t('ui.form.postCode.invalid'),
                                    },
                                }}
                                accessoryLeft="fa-map-marker-alt"
                                containerStyle={[styles.field, formWidth >= 335 && styles.postalField]}
                                animated
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
                                containerStyle={[styles.field, formWidth >= 335 && styles.phoneField]}
                                animated
                            />
                            </View>
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
                        {servicesLoading ? <ServicesSkeleton rows={6} /> : <ListeServices
                            services={services}
                            selectedServices={selectedServices}
                            onSelect={handleServiceSelection}
                        />}
                        {!servicesLoading && selectedServices.length === 0 && (
                            <Text variant="regular" color={theme.colors.danger} style={[styles.servicesError, { marginTop: verticalScale(10) }]}>
                                {t('ui.form.services.required')}
                            </Text>
                        )}
                    </StepContainer>
                )}

                {/* Navigation Buttons */}
                <ButtonGroup $compact={formWidth < 335}>
                    {step > 0 && (
                        <PreviousButton
                            title={t('ui.button.previous')}
                            onPress={prevStep}
                            variant="outline"
                            size="large"
                            height={48}
                            disabled={isLoading || authLoading || isSubmitting}
                        />
                    )}

                    {step < steps.length - 1 ? (
                            <NextButton
                                title={t('common.actions.continue')}
                                testID="professional-form-primary-action"
                            onPress={nextStep}
                            variant="primary"
                            size="large"
                            height={48}
                            disabled={isLoading || authLoading || isSubmitting}
                            loading={isLoading || authLoading}
                        />
                    ) : (
                        <SubmitButton
                            title={t('ui.button.signUp')}
                            testID="professional-form-primary-action"
                            onPress={handleSubmit(onSubmit)}
                            variant="primary"
                            size="large"
                            height={48}
                            disabled={isLoading || authLoading || isSubmitting || servicesLoading || selectedServices.length === 0}
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
                        color={theme.colors.primary} />
                )}
            </Container>
        </ScrollContainer>
    );
};

const styles = StyleSheet.create({
    description: { marginTop: 10 },
    progressLabel: { textAlign: 'right' },
    contactRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
    contactStack: { width: '100%' },
    postalField: { width: '36%' },
    phoneField: { flex: 1, width: undefined },
    servicesError: { textAlign: 'center' },
    field: {
        width: '100%',
        marginBottom: 10,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: 0,
    },
});

export default ProfessionalForm;
