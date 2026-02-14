// screens/auth/RegisterScreen.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '@utils/constant';
import { verticalScale } from '@utils/normalizedCss';

// Components
import Text from '@components/Text';

// New Redux imports
import { useAppSelector } from '@store/hooks';

// OneSignal integration
import { selectAuthLoading, selectIsAuthenticated } from '@store/slices/authSlice';
import ProfessionalForm from './component/ProfessionalForm';
import ClientForm from './component/ClientForm';
import { useGetServicesQuery } from '@store/api/endpoints/auth';
import SvgIcon from '@components/Icon/SvgIcon';

// Types
interface RouteParams {
    role?: 'client' | 'professional';
}

export const RegisterScreen = () => {
    const { t } = useTranslation();
    const route = useRoute();
    const navigation = useNavigation();


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
            Alert.alert(
                t('common.error'),
                t('services.loadFailed'),
                [{ text: t('common.ok') }]
            );
        }
    }, [servicesError, t, params.role]);

    const handleUserRegistrationSuccess = () => {
        console.log('Client registration successful');
        // Navigation is handled by the isAuthenticated useEffect
    };

    const handleUserRegistrationError = (error: any) => {
        console.error('Client registration error:', error);
        // Error is handled in the FormUser component
    };

    const handleProfessionalRegistrationSuccess = () => {
        console.log('Professional registration successful');
        // Navigation is handled by the isAuthenticated useEffect
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
        <View style={styles.container}>
            {/* Logo */}
            <SvgIcon
                name="logo-pro24"
                style={styles.logo}
                size={verticalScale(150)}

            />

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
                    style={styles.bottomText}
                    onPress={navigateToSignIn}
                    disabled={authLoading}>
                    <Text variant="medium">{t('terms.client') || 'Déjà inscrit ?'} </Text>
                    <Text variant="medium" color="warning">
                        {t('terms.loginAccount') || 'Se connecter'}
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingTop: verticalScale(10),
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        flex: 1,
    },
    logo: {
        alignSelf: 'center',
    },
    title: {
        textAlign: 'center',
    },
    bottomText: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: verticalScale(10),
        marginBottom: verticalScale(30),
        alignSelf: 'flex-end',
        marginRight: verticalScale(10),
    },
});