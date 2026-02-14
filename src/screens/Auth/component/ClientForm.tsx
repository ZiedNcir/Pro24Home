import { Button } from '@components/Button/Button';
import { Field, FieldValidators } from '@components/Field';
import { Spinner } from '@components/Modal/AppSpinner';
import { verticalScale } from '@utils/normalizedCss';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Alert, View, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Import from new Redux architecture
import { useRegisterClientMutation } from '@store/api/endpoints/auth';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectAuthLoading, setError, setLoading } from '@store/slices/authSlice';
import type { RegisterClientRequest } from '@store/api/api.types';

interface ClientFormProps {
    onSuccess?: () => void;
    onError?: (error: any) => void;
    onFieldFocus?: (fieldName: string) => void;
}

const ClientForm = ({ onSuccess, onError, onFieldFocus }: ClientFormProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    // Use the new RTK Query mutation hook
    const [registerClient, { isLoading, error, isSuccess }] = useRegisterClientMutation();

    // Use selector from new auth slice
    const authLoading = useAppSelector(selectAuthLoading);

    const { control, handleSubmit, formState: { isValid } } = useForm<RegisterClientRequest>({
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
    });

    // Handle registration success
    useEffect(() => {
        if (isSuccess && onSuccess) {
            onSuccess();
        }
    }, [isSuccess, onSuccess]);

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

            // Show alert to user
            Alert.alert(
                t('common.error'),
                errorMessage,
                [{ text: t('common.ok') }]
            );

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

    const onSubmit = async (data: RegisterClientRequest) => {
        try {
            // Set loading state in auth slice
            dispatch(setLoading(true));

            // For OneSignal integration, you need to get the device token
            // This depends on how you've set up OneSignal in your app
            // Example:
            // const onesignalKey = await OneSignal.getDeviceState().userId;

            // Prepare the registration data
            const registrationData: RegisterClientRequest = {
                ...data,
                onesignal_key: 'onesignal-device-token-here', // Replace with actual token
                lang: 'fr', // Get from i18n if needed
            };

            // Call the API using RTK Query mutation
            const result = await registerClient(registrationData).unwrap();

            // The onQueryStarted in auth.api.ts will automatically:
            // 1. Dispatch setCredentials to update auth state
            // 2. Save to AsyncStorage
            // 3. Set the user as authenticated

            console.log('Registration successful:', result);

            // Dispatch success loading state
            dispatch(setLoading(false));

        } catch (err) {
            // Error is already handled by the mutation error handling
            console.error('Registration failed:', err);
            dispatch(setLoading(false));
        }
    };

    const handleFieldFocus = (fieldName: string) => {
        if (onFieldFocus) {
            onFieldFocus(fieldName);
        }
    };

    const handleFieldBlur = () => {
        // Dismiss keyboard on blur for better UX
        Keyboard.dismiss();
    };
    return (
        <KeyboardAwareScrollView
            contentContainerStyle={styles.scroll}
            enableOnAndroid
            enableAutomaticScroll
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            extraScrollHeight={30}
            keyboardOpeningTime={0}
            enableResetScrollToCoords={false}>

            <View style={styles.formContainer}>
                {/* First Name */}
                <Field<RegisterClientRequest>
                    name="first_name"
                    label={t('ui.form.firstName.label')}
                    required
                    control={control}
                    placeholder={t('ui.form.firstName.placeholder')}
                    autoCapitalize="words"
                    autoCorrect={false}
                    keyboardType="default"
                    returnKeyType="next"
                    rules={{
                        ...FieldValidators.required(t('ui.form.firstName.required')),
                        ...FieldValidators.minLength(2, t('ui.form.firstName.minLength')),
                        ...FieldValidators.maxLength(50, t('ui.form.firstName.maxLength')),
                        validate: {
                            noNumbers: (value: string | undefined) =>
                                !value || !/\d/.test(value) || t('ui.form.error.noNumbers'),
                        },
                    }}
                    accessoryLeft="fa-user"
                    containerStyle={styles.field}
                    animated
                    shakeOnError
                    pulseOnFocus
                    onFocus={() => handleFieldFocus('first_name')}
                    onBlur={handleFieldBlur}
                />

                {/* Email */}
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
                    accessoryLeft="fa-exclamation-circle"
                    containerStyle={styles.field}
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
                    containerStyle={styles.field}
                />

                {/* Password Confirmation */}


                {/* Postal Code */}
                <Field<RegisterClientRequest>
                    name="postal_code"
                    label={t('ui.form.postCode.label')}
                    required
                    numeric // Auto-applies numeric validation
                    control={control}
                    placeholder={t('ui.form.postCode.placeholder')}
                    autoCapitalize="characters"
                    keyboardType="number-pad"
                    returnKeyType="next"
                    rules={{
                        ...FieldValidators.required(t('ui.form.postCode.required')),
                        ...FieldValidators.minLength(5, t('ui.form.postCode.invalid')),
                        ...FieldValidators.maxLength(5, t('ui.form.postCode.invalid')),
                        ...FieldValidators.customPattern(
                            /^\d{5}$/,
                            t('ui.form.postCode.invalid')
                        ),
                    }}
                    maxCharacters={5}
                    showCharacterCount
                    accessoryLeft="fa-map-marker-alt"
                    containerStyle={styles.field}
                />
                {/* Hidden field for onesignal_key */}


                <Button
                    variant="primary"
                    title={t('ui.button.signUp')}
                    style={styles.signUpButton}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading || authLoading || !isValid}
                    loading={isLoading || authLoading}
                    size="large"
                    fullWidth
                />

                {/* Show loading spinner */}
                {(isLoading || authLoading) && (
                    <Spinner
                        visible={true}
                        animationType='dots'
                        onRequestClose={function (): void {
                            throw new Error('Function not implemented.');
                        }}
                    />
                )}
            </View>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    formContainer: {
        paddingTop: verticalScale(20),
    },
    field: {
        marginBottom: verticalScale(16),
    },
    signUpButton: {
        marginTop: verticalScale(32),
        marginBottom: verticalScale(20),
    },
    termsContainer: {
        marginTop: verticalScale(16),
        paddingHorizontal: verticalScale(4),
    },
    termsText: {
        textAlign: 'center',
        lineHeight: 20,
    },
    termsLink: {
        textDecorationLine: 'underline',
    },
});

export default ClientForm;
