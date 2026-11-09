import type { ThemeColors } from './colors/types';

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
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    xl: {
        shadowColor: '#000000',
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

// TypeScript declarations for styled-components
declare module 'styled-components/native' {
    export interface DefaultTheme {
        colors: ThemeColors;
        spacing: typeof spacing;
        borderRadius: typeof borderRadius;
        typography: typeof typography;
        elevation: typeof elevation;
        animation: typeof animation;
        zIndex: typeof zIndex;
    }
}

export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
