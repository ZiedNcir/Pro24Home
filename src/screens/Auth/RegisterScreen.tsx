// screens/auth/RegisterScreen.tsx
import React, { useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Toast } from 'react-native-toast-notifications';
import { verticalScale } from '@utils/normalizedCss';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Components
import { Text, ScreenContainer, NavigationHeader } from '@components/index';

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
        //navigation.navigate('SignIn', { role: params.role } as never);
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
        <ScreenContainer >
            <NavigationHeader />

            <View style={styles.header}>
                <Text variant="title" style={styles.title}>
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
                    style={[styles.bottomText, { marginBottom: Math.max(insets.bottom- verticalScale(25) ) }]}
                    onPress={navigateToSignIn}
                    disabled={authLoading}>
                    <Text variant="medium">{t('terms.client') || 'Déjà inscrit ?'} </Text>
                    <Text variant="medium" color="warning">
                        {t('terms.loginAccount') || 'Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>


        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        flex: 1,
    },
    title: {
        textAlign: 'center',
    },
    bottomText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'flex-end',
        marginRight: verticalScale(15),
    },
});