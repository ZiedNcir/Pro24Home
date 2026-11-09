import { DefaultTheme } from 'styled-components/native';
import { darkColors } from '../colors/dark';
import { spacing, borderRadius, typography, elevation, animation, zIndex } from '../tokens';

const darkTheme: DefaultTheme = {
    colors: darkColors,
    spacing,
    borderRadius,
    typography,
    elevation: {
        ...elevation,
        // Darker shadows for dark mode
        xs: {
            ...elevation.xs,
            shadowColor: darkColors.black,
            shadowOpacity: 0.3,
        },
        sm: {
            ...elevation.sm,
            shadowColor: darkColors.black,
            shadowOpacity: 0.4,
        },
        md: {
            ...elevation.md,
            shadowColor: darkColors.black,
            shadowOpacity: 0.5,
        },
        lg: {
            ...elevation.lg,
            shadowColor: darkColors.black,
            shadowOpacity: 0.6,
        },
        xl: {
            ...elevation.xl,
            shadowColor: darkColors.black,
            shadowOpacity: 0.7,
        },
    },
    animation,
    zIndex,
};

export default darkTheme;
