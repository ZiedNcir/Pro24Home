import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { DefaultTheme } from 'styled-components/native';
import lightTheme from './lightTheme';
import darkTheme from './darkTheme';

export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    theme: DefaultTheme;
    themeMode: ThemeMode;
    toggleTheme: () => void;
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    initialTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    initialTheme = 'light',
}) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>(initialTheme);

    const theme = themeMode === 'dark' ? darkTheme : lightTheme;

    const toggleTheme = () => {
        setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, themeMode, toggleTheme, setThemeMode }}>
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

// Hook to get theme values
export const useThemeValues = () => {
    const { theme } = useTheme();
    return theme;
};

// Hook to toggle theme
export const useToggleTheme = () => {
    const { toggleTheme } = useTheme();
    return toggleTheme;
};