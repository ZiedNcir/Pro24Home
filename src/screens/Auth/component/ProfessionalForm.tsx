// screens/auth/component/professional_form/index.tsx
import { Button } from '@components/Button/Button';
import { Field } from '@components/Field';
import { Spinner } from '@components/Modal/AppSpinner';
import { Colors } from '@utils/constant';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, Alert, useWindowDimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Import from new Redux architecture
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { RegisterProfessionalRequest, Service } from '@store/api/api.types';

// Components
import ListeServices from './ListServices';
import Text from '@components/Text';
import { useRegisterProfessionalMutation } from '@store/api/endpoints/auth';
import { selectAuthLoading, setError, setLoading } from '@store/slices/authSlice';
import { colors } from '@theme/index';
import ServicesSkeleton from './ServicesSkeleton';
import { Toast } from 'react-native-toast-notifications';

// Types
interface ProfessionalFormProps {
    onSuccess?: () => void;
    onError?: (error: any) => void;
    services: Service[];
    servicesLoading?: boolean;

}

const ProfessionalForm = ({ onSuccess, onError, services, servicesLoading }: ProfessionalFormProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const screen_width = useWindowDimensions().width;

    // Use the new RTK Query mutation hook
    const [registerProfessional, { isLoading, error, isSuccess }] = useRegisterProfessionalMutation();

    // Use selector from new auth slice
    const authLoading = useAppSelector(selectAuthLoading);

    // State for multi-step form
    const [step, setStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    }, [isSuccess, onSuccess]);

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
                Alert.alert(
                    t('common.error'),
                    t('ui.form.services.required'),
                    [{ text: t('common.ok') }]
                );
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
                Alert.alert(
                    t('common.error'),
                    errors[firstErrorField as keyof RegisterProfessionalRequest]?.message as string,
                    [{ text: t('common.ok') }]
                );
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
            setIsSubmitting(true);
            dispatch(setLoading(true));

            // Get OneSignal device token (implement based on your setup)
            const onesignalKey = 'onesignal-device-token-here'; // Replace with actual token

            const registrationData: RegisterProfessionalRequest = {
                ...data,
                services: selectedServices,
                onesignal_key: onesignalKey,
                lang: 'fr',
                // Add commercial_id and source if available
                // commercial_id: 1,
                // source: 'mobile_app',
            };

            console.log('Submitting professional registration:', {
                ...registrationData,
                password: '***HIDDEN***'
            });

            await registerProfessional(registrationData).unwrap();

            console.log('Professional registration successful');
            dispatch(setLoading(false));
            setIsSubmitting(false);

        } catch (err) {
            console.error('Registration failed:', err);
            dispatch(setLoading(false));
            setIsSubmitting(false);
        }
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicator}>
            {steps.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.stepDot,
                        index === step && styles.stepDotActive,
                        index < step && styles.stepDotCompleted,
                    ]}
                />
            ))}
            <View style={styles.stepLine} />
        </View>
    );

    const renderStepTitle = () => (
        <Text variant="medium" style={styles.stepTitle}>
            {steps[step]?.title ?? ''}
        </Text>
    );

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scroll}
            enableOnAndroid
            enableAutomaticScroll
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight={30}
            keyboardOpeningTime={0}>

            <View style={styles.container}>
                {renderStepIndicator()}
                {renderStepTitle()}

                {/* Step 0: Personal Information */}
                {servicesLoading ? (
                    <ServicesSkeleton rows={8} />
                ) :
                    step === 0 && (
                        <View style={styles.stepContainer}>
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
                                containerStyle={[styles.field, { width: screen_width * 0.80 }]}
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
                                        value: /^\d{5}$/,
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
                        </View>
                    )}

                {/* Step 1: Company Information */}
                {step === 1 && (
                    <View style={styles.stepContainer}>
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
                            containerStyle={[styles.field, { width: screen_width * 0.80 }]}
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
                            containerStyle={[styles.field, { width: screen_width * 0.80 }]}
                            animated
                            shakeOnError
                            helperText={t('ui.form.siret.helper')}
                        />
                    </View>
                )}

                {/* Step 2: Security Information */}
                {step === 2 && (
                    <View style={styles.stepContainer}>
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
                            containerStyle={[styles.field, { width: screen_width * 0.86 }]}
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
                            containerStyle={[styles.field, { width: screen_width * 0.86 }]}
                            animated
                            shakeOnError
                            helperText={t('ui.form.password.helper')}

                        />
                    </View>
                )}

                {/* Step 3: Services Selection */}
                {step === 3 && (
                    <View style={styles.stepContainer}>
                        <ListeServices
                            services={services}
                            selectedServices={selectedServices}
                            onSelect={handleServiceSelection}
                        />
                        {selectedServices.length === 0 && (
                            <Text style={styles.errorText} variant="regular">
                                {t('ui.form.services.required')}
                            </Text>
                        )}
                    </View>
                )}

                {/* Navigation Buttons */}
                <View style={styles.buttonGroup}>
                    {step > 0 && (
                        <Button
                            title={t('ui.button.previous')}
                            onPress={prevStep}
                            style={styles.previousButton}
                            variant="outline"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting}
                        />
                    )}

                    {step < steps.length - 1 ? (
                        <Button
                            title={t('ui.button.next')}
                            onPress={nextStep}
                            style={styles.nextButton}
                            variant="primary"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting || servicesLoading}
                            loading={isLoading || authLoading}
                        />
                    ) : (
                        <Button
                            title={t('ui.button.signUp')}
                            onPress={handleSubmit(onSubmit)}
                            style={styles.submitButton}
                            variant="primary"
                            size="medium"
                            disabled={isLoading || authLoading || isSubmitting || selectedServices.length === 0}
                            loading={isLoading || authLoading || isSubmitting}
                            fullWidth
                        />
                    )}
                </View>

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




            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
    },
    stepIndicator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        marginTop: verticalScale(10),
        position: 'relative',
    },
    stepDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.gray100,
        marginHorizontal: 8,
        zIndex: 1,
    },
    stepDotActive: {
        backgroundColor: colors.primary,
        transform: [{ scale: 1.2 }],
    },
    stepDotCompleted: {
        backgroundColor: colors.success,
    },
    stepLine: {
        position: 'absolute',
        top: 5,
        left: 5,
        right: 5,
        height: 2,
        backgroundColor: colors.gray100,
        zIndex: 0,
    },
    stepTitle: {
        textAlign: 'center',
        marginBottom: verticalScale(10),
        color: colors.textPrimary,
    },
    stepContainer: {

    },
    field: {
        paddingHorizontal: horizontalScale(3),
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: verticalScale(15),
    },
    previousButton: {
        flex: 1,
        marginRight: horizontalScale(10),
    },
    nextButton: {
        flex: 1,
        marginLeft: horizontalScale(10),
    },
    submitButton: {
        flex: 1,
    },
    errorText: {
        color: Colors.danger,
        marginTop: verticalScale(10),
        textAlign: 'center',
    },
});

export default ProfessionalForm;