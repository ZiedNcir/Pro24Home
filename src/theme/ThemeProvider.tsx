import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from 'react';
import { ColorSchemeName } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: DefaultTheme;
    themeMode: ThemeMode;
    isDarkMode: boolean;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ColorSchemeName | ThemeMode;
}

const resolveThemeMode = (scheme?: ColorSchemeName | ThemeMode): ThemeMode => {
    return scheme === 'dark' ? 'dark' : 'light';
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    initialTheme = 'light',
}) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(
        resolveThemeMode(initialTheme),
    );

    useEffect(() => {
        setThemeMode(resolveThemeMode(initialTheme));
    }, [initialTheme]);

    const theme = useMemo(
        () => (themeMode === 'dark' ? darkTheme : lightTheme),
        [themeMode],
    );

    const value = useMemo(
        () => ({
            theme,
            themeMode,
            isDarkMode: themeMode === 'dark',
            toggleTheme: () => {
                setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
            },
            setThemeMode,
        }),
        [theme, themeMode],
    );

    return (
        <ThemeContext.Provider value={value}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};

export const useThemeValues = () => {
    const { theme } = useTheme();
    return theme;
};

export const useColorMode = () => {
    const { themeMode, isDarkMode } = useTheme();
    return { themeMode, isDarkMode };
};

export const useToggleTheme = () => {
    const { toggleTheme } = useTheme();
    return toggleTheme;
};
