import { DefaultTheme } from 'styled-components/native';
import { colors, spacing, borderRadius, typography, elevation, animation, zIndex } from './index';

const lightTheme: DefaultTheme = {
    colors: {
        ...colors,
        // Light theme specific overrides
        background: colors.white,
        surface: colors.white,
        surfaceVariant: colors.gray100,
        textPrimary: colors.gray900,
        textSecondary: colors.gray600,
        textDisabled: colors.gray400,
        textInverse: colors.white,
        border: colors.gray300,
        borderLight: colors.gray200,
        borderDark: colors.gray400,
    },
    spacing,
    borderRadius,
    typography,
    elevation,
    animation,
    zIndex,
};

export default lightTheme;