import { DefaultTheme } from 'styled-components/native';
import { lightColors } from '../colors/light';
import { spacing, borderRadius, typography, elevation, animation, zIndex } from '../tokens';

const lightTheme: DefaultTheme = {
    colors: lightColors,
    spacing,
    borderRadius,
    typography,
    elevation,
    animation,
    zIndex,
};

export default lightTheme;
