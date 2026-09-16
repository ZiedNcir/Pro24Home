import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';

import { store } from '../../store';
import { ThemeProvider } from '@theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <ThemeProvider>
      <ToastProvider
        placement="top"
        duration={4000}
        animationType="slide-in"
        animationDuration={250}
        successColor="#4CAF50"
        dangerColor="#F44336"
        warningColor="#FF9800"
        normalColor="#FF6B00"
        textStyle={{ fontFamily: 'Inter-Regular', fontSize: 14, color: '#FFFFFF' }}
        offset={50}
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled
      >
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </ToastProvider>
    </ThemeProvider>
  </Provider>
);
