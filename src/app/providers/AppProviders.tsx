import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProvider } from 'react-native-toast-notifications';

import { store } from '../../store';
import { ThemeProvider } from '@theme';
import {
  NavigationProvider,
  TaskRemovedBehavior,
} from '@googlemaps/react-native-navigation-sdk';

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
        <SafeAreaProvider>
          <NavigationProvider
            termsAndConditionsDialogOptions={{
              title: 'Navigation Pro24Home',
              companyName: 'Pro24Home',
              showOnlyDisclaimer: false,
            }}
            taskRemovedBehavior={TaskRemovedBehavior.CONTINUE_SERVICE}
          >
            {children}
          </NavigationProvider>
        </SafeAreaProvider>
      </ToastProvider>
    </ThemeProvider>
  </Provider>
);
