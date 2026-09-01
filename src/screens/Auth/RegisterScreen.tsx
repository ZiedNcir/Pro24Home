// screens/auth/RegisterScreen.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-notifications';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { useTheme } from '@theme/ThemeProvider';

// Components
import { Text, ScreenContainer } from '@components/index';

// Redux
import { useAppSelector } from '@store/hooks';
import { selectAuthLoading, selectIsAuthenticated } from '@store/slices/authSlice';

// Screens & Forms
import ProfessionalForm from './component/ProfessionalForm';
import ClientForm from './component/ClientForm';
import { useGetServicesQuery } from '@store/api/endpoints/auth';

// Types
import { AppStackType } from '../../navigation/constant/core';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface RouteParams {
    role?: 'client' | 'professional';
}

export const RegisterScreen = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation<AppNavigationProp>();
    const insets = useSafeAreaInsets();
    const { theme, themeMode } = useTheme();


    const params = route.params as RouteParams;


    // Get authentication state
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const authLoading = useAppSelector(selectAuthLoading);

    // Get services for professional form
    const { data: services, isLoading: servicesLoading, error: servicesError } = useGetServicesQuery({ lang: 'fr' });

    // Redirect to home if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' as never }],
            });
        }
    }, [isAuthenticated, navigation]);

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

    const handleUserRegistrationSuccess = (data: any) => {
        console.log('Client registration successful');
        navigation.navigate('VerifyScreen', {
            email: data.email,
            role: 'client'
        });
    };

    const handleUserRegistrationError = (error: any) => {
        console.error('Client registration error:', error);
        // Error is handled in the FormUser component
    };

    const handleProfessionalRegistrationSuccess = (data: any) => {
        console.log('Professional registration successful');
        navigation.navigate('VerifyScreen', {
            email: data.email,
            role: 'professional'
        });
    };

    const handleProfessionalRegistrationError = (error: any) => {
        console.error('Professional registration error:', error);
        // Error is handled in the FormProfitionel component
    };

    const navigateToSignIn = () => {
        navigation.navigate('SignIn', { role: params.role });
    };



    // Get appropriate title based on role
    const getTitle = () => {
        if (params.role === 'client') {
            return t('screen.creationClient') || t('screen.creation') || 'Créer votre compte client';
        } else if (params.role === 'professional') {
            return t('screen.creationPro') || t('screen.creation') || 'Créer votre compte professionnel';
        }
        return t('screen.creation') || 'Créer votre compte';
    };

    // Show loading state if services are loading for professional


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
                    accessibilityLabel="Retour"
                >
                    <Text style={[styles.backIcon, { color: theme.colors.primary }]}>‹</Text>
                </TouchableOpacity>
                <LogoMediumPro24Icon style={styles.logo} />
            </View>

            <View style={styles.cardContainer}>
                <View style={[styles.card, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.black }]}>
                    <Text variant="title" style={[styles.title, { color: theme.colors.textPrimary }]}>
                        {getTitle()}
                    </Text>

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
                            onError={handleProfessionalRegistrationError}

                        />
                    )}

                    {/* Link to sign in */}
                    <TouchableOpacity
                        style={[styles.bottomText, { marginBottom: Math.max(insets.bottom - verticalScale(25)) }]}
                        onPress={navigateToSignIn}
                        disabled={authLoading}>
                        <Text variant="medium" color={theme.colors.textSecondary}>{t('terms.client') || 'Déjà inscrit ?'} </Text>
                        <Text variant="medium" color={theme.colors.primary}>
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
        color: '#123D79',
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
        paddingHorizontal: horizontalScale(18),
    },
    card: {
        width: '100%',
        borderRadius: 28,
        paddingHorizontal: horizontalScale(24),
        paddingTop: verticalScale(28),
        paddingBottom: verticalScale(30),
        shadowOffset: { width: 0, height: verticalScale(8) },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
        alignItems: 'center',
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
        fontSize: 28,
        lineHeight: 34,
        marginBottom: verticalScale(12),
    },
    bottomText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-end',
        marginRight: verticalScale(15),
    },
});
