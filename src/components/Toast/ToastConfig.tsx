// src/components/Toast/ToastConfig.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '@components/Text';
import SvgIcon, { IconName } from '@components/Icon/SvgIcon';
import { useTheme } from '@theme/ThemeProvider';

interface CustomToastProps {
    message: string;
    type: 'success' | 'error' | 'warning' | 'info' | 'normal';
}

export const CustomToast: React.FC<CustomToastProps> = ({ message, type }) => {
    const { theme } = useTheme();

    const getToastConfig = () => {
        switch (type) {
            case 'success':
                return {
                    icon: 'fa-check-circle',
                    backgroundColor: theme.colors.success,
                    textColor: theme.colors.white,
                };
            case 'error':
                return {
                    icon: 'fa-times-circle',
                    backgroundColor: theme.colors.danger,
                    textColor: theme.colors.white,
                };
            case 'warning':
                return {
                    icon: 'fa-exclamation-triangle',
                    backgroundColor: theme.colors.warning,
                    textColor: theme.colors.white,
                };
            case 'info':
                return {
                    icon: 'fa-info-circle',
                    backgroundColor: theme.colors.info,
                    textColor: theme.colors.white,
                };
            default:
                return {
                    icon: 'fa-info-circle',
                    backgroundColor: theme.colors.primary,
                    textColor: theme.colors.white,
                };
        }
    };

    const config = getToastConfig();

    return (
        <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
            <SvgIcon
                name={`fa-${config.icon.split('-')[1]}` as IconName}
                size={20}
                color={config.textColor}
                style={styles.icon}
            />
            <Text
                variant="regular"
                color="white"
                style={styles.message}
            >
                {message}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 16,
        minHeight: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    icon: {
        marginRight: 12,
    },
    message: {
        flex: 1,
    },
});

// Custom toast renderer for react-native-toast-notifications
export const toastConfig = {
    success: (toast: any) => (
        <CustomToast message={toast.message} type="success" />
    ),
    error: (toast: any) => (
        <CustomToast message={toast.message} type="error" />
    ),
    warning: (toast: any) => (
        <CustomToast message={toast.message} type="warning" />
    ),
    info: (toast: any) => (
        <CustomToast message={toast.message} type="info" />
    ),
    normal: (toast: any) => (
        <CustomToast message={toast.message} type="normal" />
    ),
};