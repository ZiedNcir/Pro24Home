import React, { useEffect } from 'react';
import { markAccountCreated } from '@core/session/account-onboarding';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from '@core/notifications/toast';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useTheme } from '@theme';

// Components
import { Text } from '@shared/ui';
import { Button } from '@shared/ui/button/Button';
import ScreenContainer from '@shared/ui/layout/ScreenContainer';

// Redux
import { useAppSelector } from '@store/hooks';
import { selectAuthLoading } from '@store/slices/authSlice';

// Screens & Forms
import ProfessionalForm from './forms/ProfessionalForm';
import ClientForm from './forms/ClientForm';
import { useGetServicesQuery } from '@entities/service/api/service.api';

// Types
import { AppStackType } from '../../../navigation/constant/core';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface RouteParams {
    role?: 'client' | 'professional';
    source?: string;
    commercial_id?: number;
}

export const RegisterScreen = () => {
    const { t, i18n } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation<AppNavigationProp>();
    const insets = useSafeAreaInsets();
    const { theme, themeMode } = useTheme();


    const params = (route.params || { role: 'client' }) as RouteParams;


    // Get authentication state
    const authLoading = useAppSelector(selectAuthLoading);

    // Get services for professional form
    const { data: services, isLoading: servicesLoading, error: servicesError, refetch: refetchServices } = useGetServicesQuery({ lang: i18n.resolvedLanguage || i18n.language });

    // Handle services loading error
    useEffect(() => {
        if (servicesError && params.role === 'professional') {
            console.error('Failed to load services:', servicesError);
            Toast.show(t('services.loadFailed'), {
                type: 'danger',
                placement: 'bottom',
                duration: 4000,
            });
        }
    }, [servicesError, t, params.role]);

    const handleUserRegistrationSuccess = async (data: any) => {
        console.log('Client registration successful');
        await markAccountCreated().catch(() => undefined);
        navigation.navigate('VerifyScreen', {
            email: data.email,
            phone_number: data.phone_number,
            role: 'client'
        });
    };

    const handleUserRegistrationError = (error: any) => {
        console.error('Client registration error:', error);
        // Error is handled in the FormUser component
    };

    const handleProfessionalRegistrationSuccess = async () => {
        await markAccountCreated().catch(() => undefined);
        navigation.reset({ index: 0, routes: [{ name: 'SignIn', params: { role: 'professional' } }] });
    };

    const navigateToSignIn = () => {
        navigation.navigate('SignIn', { role: params.role });
    };



    return (
        <ScreenContainer
            mode={themeMode}
            scrollable
            paddingHorizontal={0}
            paddingVertical={0}
        >
            <View style={styles.navigationHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    accessibilityRole="button"
                    accessibilityLabel={t('accessibility.back')}
                >
                    <Text style={[styles.backIcon, { color: theme.colors.primary }]}>‹</Text>
                </TouchableOpacity>
                <LogoMediumPro24Icon style={styles.logo} />
            </View>

            <View style={styles.cardContainer}>
                <View style={[styles.card, { backgroundColor: theme.colors.background, shadowColor: theme.colors.black }]}>

                    {params.role === 'professional' && servicesError ? <Button
                        title={t('auth.onboarding.retryServices')}
                        variant="outline"
                        onPress={() => refetchServices()}
                    /> : null}

                    {/* Form based on role */}
                    {params.role === 'client' ? (
                        <ClientForm
                            onSuccess={handleUserRegistrationSuccess}
                            onError={handleUserRegistrationError}
                        />
                    ) : (
                        <ProfessionalForm
                            services={services?.data || []}
                            servicesLoading={servicesLoading}
                            onSuccess={handleProfessionalRegistrationSuccess}
                            referral={{ source: params.source, commercial_id: params.commercial_id }}

                        />
                    )}

                    {/* Link to sign in */}
                    <TouchableOpacity
                        style={[styles.bottomText, { paddingBottom: Math.max(insets.bottom, 20) }]}
                        onPress={navigateToSignIn}
                        accessibilityRole="button"
                        disabled={authLoading}>
                        <Text variant="regular" fontSize={13} lineHeight={20} color={theme.colors.textSecondary}>{t('auth.formDesign.loginPrompt')} </Text>
                        <Text variant="bold" fontSize={13} lineHeight={20} color={theme.colors.primary} style={styles.loginLink}>
                            {t('terms.loginAccount') || 'Se connecter'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>


        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    navigationHeader: {
        height: verticalScale(78),
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        position: 'absolute',
        left: horizontalScale(8),
        top: verticalScale(17),
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    backIcon: {
        fontFamily: 'Inter-Regular',
        fontSize: 34,
        lineHeight: 34,
    },
    logo: {
        width: horizontalScale(150),
        height: verticalScale(42),
    },
    cardContainer: {
        width: '100%',
        paddingHorizontal: 18,
    },
    card: {
        width: '100%',
        borderRadius: 0,
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0,
        shadowRadius: 16,
        elevation: 0,
        alignItems: 'center',
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        lineHeight: 34,
        marginBottom: verticalScale(12),
    },
    loginLink: { textDecorationLine: 'underline' },
    bottomText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
        paddingTop: 14,
    },
});
