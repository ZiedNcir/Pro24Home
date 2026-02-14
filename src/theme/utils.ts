import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Responsive scaling
export const scale = (size: number) => {
    const scaleWidth = width / 375; // Based on iPhone 6/7/8
    const newSize = size * scaleWidth;

    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    }

    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Font scaling with line height
export const fontScale = (size: number, lineHeightMultiplier = 1.5) => {
    const scaledSize = scale(size);
    return {
        fontSize: scaledSize,
        lineHeight: Math.round(scaledSize * lineHeightMultiplier),
    };
};

// Color utilities
export const hexToRgba = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Darken/Lighten colors
export const darkenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;

    return `#${(
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
        .toString(16)
        .slice(1)}`;
};

export const lightenColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return `#${(
        0x1000000 +
        (R > 255 ? 255 : R) * 0x10000 +
        (G > 255 ? 255 : G) * 0x100 +
        (B > 255 ? 255 : B)
    )
        .toString(16)
        .slice(1)}`;
};

// Spacing utilities
export const createSpacing = (multiplier: number) => {
    return multiplier * 8; // Using 8-point grid
};

// Shadow utilities
export const createShadow = (
    elevation: number,
    shadowColor: string = '#000',
    shadowOpacity: number = 0.2,
) => {
    return {
        shadowColor,
        shadowOffset: {
            width: 0,
            height: elevation / 2,
        },
        shadowOpacity,
        shadowRadius: elevation,
        elevation,
    };
};

// Media queries (simplified)
export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

export const media = {
    sm: `@media (min-width: ${breakpoints.sm}px)`,
    md: `@media (min-width: ${breakpoints.md}px)`,
    lg: `@media (min-width: ${breakpoints.lg}px)`,
    xl: `@media (min-width: ${breakpoints.xl}px)`,
};