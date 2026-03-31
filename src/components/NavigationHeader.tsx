// src/components/NavigationHeader.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { verticalScale } from '@utils/normalizedCss';
import { Colors } from '@utils/constant';
import { SvgIcon } from './index';
import { AppStackType } from '../navigation/constant/core';

type AppNavigationProp = NativeStackNavigationProp<AppStackType>;

interface NavigationHeaderProps {
    logoSize?: number;
    showBackButton?: boolean;
    backButtonTestID?: string;
    onBackPress?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
    logoSize = verticalScale(100),
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
                    <SvgIcon name="fa-chevron-left" size={24} color={Colors.black} />
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
        top: verticalScale(30),
        left: verticalScale(20),
        zIndex: 1,
        padding: verticalScale(8),
    },
    logo: {
        alignSelf: 'flex-start',
        left: verticalScale(20),
    },
});

export default NavigationHeader;