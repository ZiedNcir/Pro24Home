// src/components/NavigationHeader.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { verticalScale } from '@utils/normalizedCss';
import { SvgIcon } from './index';
import { AppStackType } from '../navigation/constant/core';
import { colors } from '@theme/index';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface NavigationHeaderProps {
    logoSize?: number;
    showBackButton?: boolean;
    backButtonTestID?: string;
    onBackPress?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
    logoSize = verticalScale(150),
    showBackButton = true,
    backButtonTestID = 'back-button',
    onBackPress,
}) => {
    const navigation = useNavigation<AppNavigationProp>();

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <>
            {showBackButton && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleBackPress}
                    testID={backButtonTestID}
                >
                    <SvgIcon name="fa-chevron-left" size={verticalScale(20)} color={colors.primary} />
                </TouchableOpacity>
            )}

            <SvgIcon
                name="logo-pro24"
                style={styles.logo}
                size={logoSize}
            />
        </>
    );
};

const styles = StyleSheet.create({
    backButton: {
        position: 'absolute',
        top: verticalScale(20),
        left: verticalScale(20),
        zIndex: 1,
        padding: verticalScale(5),
        borderRadius: verticalScale(30),
        backgroundColor: colors.white,
    },
    logo: {
        alignSelf: 'center',

        marginTop: verticalScale(-40),

    },
});

export default NavigationHeader;