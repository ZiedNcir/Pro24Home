import { useTheme } from './ThemeProvider';
import theme, { Color, Spacing, BorderRadius } from './index';

export const useColor = (color: Color) => {
    const { theme } = useTheme();
    return theme.colors[color];
};

export const useSpacing = (size: Spacing) => {
    const { theme } = useTheme();
    return theme.spacing[size];
};

export const useBorderRadius = (radius: BorderRadius) => {
    const { theme } = useTheme();
    return theme.borderRadius[radius];
};

export const useTypography = () => {
    const { theme } = useTheme();
    return theme.typography;
};

export const useElevation = (level: keyof typeof theme.elevation) => {
    const { theme } = useTheme();
    return theme.elevation[level];
};

// Responsive hooks (if needed)
export const useResponsiveValue = <T>(values: {
    base: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
}): T => {
    // You can implement screen size detection here
    // For now, return base value
    return values.base;
};

// Hook for component variants
export const useVariant = <T>(variants: Record<string, T>, variant: string): T | undefined => {
    return variants[variant] || variants.default;
};