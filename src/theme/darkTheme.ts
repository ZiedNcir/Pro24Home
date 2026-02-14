import { DefaultTheme } from 'styled-components/native';
import { colors, spacing, borderRadius, typography, elevation, animation, zIndex } from './index';

const darkTheme: DefaultTheme = {
    colors: {
        ...colors,
        // Dark theme specific overrides
        primary: '#FF944D', // Lighter orange for dark mode
        primaryDark: '#FF6B00',
        primaryLight: '#FFB380',
        primaryLighter: '#FFE0CC',

        background: '#121212',
        surface: '#1E1E1E',
        surfaceVariant: '#2D2D2D',

        textPrimary: '#FFFFFF',
        textSecondary: '#B0B0B0',
        textDisabled: '#666666',
        textInverse: '#000000',

        border: '#404040',
        borderLight: '#333333',
        borderDark: '#505050',

        gray900: '#FFFFFF',
        gray800: '#F0F0F0',
        gray700: '#E0E0E0',
        gray600: '#B0B0B0',
        gray500: '#808080',
        gray400: '#666666',
        gray300: '#4D4D4D',
        gray200: '#333333',
        gray100: '#242424',
        gray50: '#1A1A1A',
    },
    spacing,
    borderRadius,
    typography,
    elevation: {
        ...elevation,
        // Darker shadows for dark mode
        xs: {
            ...elevation.xs,
            shadowColor: colors.black,
            shadowOpacity: 0.3,
        },
        sm: {
            ...elevation.sm,
            shadowColor: colors.black,
            shadowOpacity: 0.4,
        },
        md: {
            ...elevation.md,
            shadowColor: colors.black,
            shadowOpacity: 0.5,
        },
        lg: {
            ...elevation.lg,
            shadowColor: colors.black,
            shadowOpacity: 0.6,
        },
        xl: {
            ...elevation.xl,
            shadowColor: colors.black,
            shadowOpacity: 0.7,
        },
    },
    animation,
    zIndex,
};

export default darkTheme;