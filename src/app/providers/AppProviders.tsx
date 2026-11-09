import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';

import { store } from '../../store';
import { ThemeProvider } from '@theme';
import { useTheme } from '@theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <ThemeProvider>
      <ThemedToastProvider>{children}</ThemedToastProvider>
    </ThemeProvider>
  </Provider>
);

const ThemedToastProvider = ({ children }: AppProvidersProps) => {
  const { theme } = useTheme();

  return (
    <ToastProvider
      placement="top"
      duration={4000}
      animationType="slide-in"
      animationDuration={250}
      successColor={theme.colors.success}
      dangerColor={theme.colors.danger}
      warningColor={theme.colors.warning}
      normalColor={theme.colors.primary}
      textStyle={{ fontFamily: 'Inter-Regular', fontSize: 14, color: theme.colors.textInverse }}
      offset={50}
      offsetTop={30}
      offsetBottom={40}
      swipeEnabled
    >
      <SafeAreaProvider>{children}</SafeAreaProvider>
    </ToastProvider>
  );
};
