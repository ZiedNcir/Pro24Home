import { DefaultTheme } from 'styled-components/native';

// Color Palette
export const colors = {
    // Brand Colors
    primary: '#FF6B00', // Orange
    primaryDark: '#E55E00',
    primaryLight: '#FF944D',
    primaryLighter: '#FFD9BF',

    // Secondary Colors
    secondary: '#1A1A1A', // Dark Gray
    secondaryLight: '#333333',
    secondaryLighter: '#4D4D4D',

    // Status Colors
    success: '#4CAF50',
    successLight: '#E8F5E9',
    warning: '#FF9800',
    warningLight: '#FFF3E0',
    danger: '#F44336',
    dangerLight: '#FFEBEE',
    info: '#2196F3',
    infoLight: '#E3F2FD',

    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray900: '#212121',
    gray800: '#424242',
    gray700: '#616161',
    gray600: '#757575',
    gray500: '#9E9E9E',
    gray400: '#BDBDBD',
    gray300: '#E0E0E0',
    gray200: '#EEEEEE',
    gray100: '#F5F5F5',
    gray50: '#FAFAFA',

    // Background Colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F5F5F5',

    // Text Colors
    textPrimary: '#212121',
    textSecondary: '#616161',
    textDisabled: '#9E9E9E',
    textInverse: '#FFFFFF',

    // Border Colors
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    borderDark: '#BDBDBD',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(0, 0, 0, 0.3)',

    // Transparent
    transparent: 'transparent',
};

// Spacing Scale (8-point grid system)
export const spacing = {
    xxxs: 2,
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
} as const;

// Border Radius
export const borderRadius = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
} as const;

// Typography System
export const typography = {
    fonts: {
        poppins: {
            regular: 'Poppins-Regular',
            medium: 'Poppins-Medium',
            semiBold: 'Poppins-SemiBold',
            bold: 'Poppins-Bold',
        },
        inter: {
            regular: 'Inter-Regular',
            medium: 'Inter-Medium',
            bold: 'Inter-Bold',
        },
    },

    sizes: {
        // Font sizes in pixels (will be converted to scaled pixels)
        display: {
            large: 57,
            medium: 45,
            small: 36,
        },
        headline: {
            large: 32,
            medium: 28,
            small: 24,
        },
        title: {
            large: 22,
            medium: 18,
            small: 16,
        },
        body: {
            large: 16,
            medium: 14,
            small: 12,
        },
        label: {
            large: 14,
            medium: 12,
            small: 11,
        },
    },

    lineHeights: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    letterSpacing: {
        tighter: -0.5,
        tight: -0.25,
        normal: 0,
        wide: 0.25,
        wider: 0.5,
    },
} as const;

// Elevation (Shadows)
export const elevation = {
    none: {
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
    },
    xs: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    xl: {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
};

// Animation Durations
export const animation = {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
} as const;

// Z-index layers
export const zIndex = {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1700,
    tooltip: 1800,
} as const;

// Main Theme Object
export const theme: DefaultTheme = {
    colors,
    spacing,
    borderRadius,
    typography,
    elevation,
    animation,
    zIndex,
};

// TypeScript declarations for styled-components
declare module 'styled-components/native' {
    export interface DefaultTheme {
        colors: typeof colors;
        spacing: typeof spacing;
        borderRadius: typeof borderRadius;
        typography: typeof typography;
        elevation: typeof elevation;
        animation: typeof animation;
        zIndex: typeof zIndex;
    }
}

export type Theme = typeof theme;
export type Color = keyof typeof colors;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;

export default theme;