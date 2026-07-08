import React, { useMemo } from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './routes';
import { RootRoutes } from './routes';
import { navigationRef } from './service';
import { AuthGuard } from './guards';
import {
  ClientAuthStack,
  ClientStack,
  ProfessionalStack,
} from './stacks';

import { useTheme } from '../theme/ThemeProvider';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const ClientScreen = () => <ClientStack />;
const ProfessionalScreen = () => <ProfessionalStack />;

export const AppNavigator = () => {
  const { theme, themeMode } = useTheme();

  const navigationTheme = useMemo(() => {
    const baseTheme = themeMode === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: theme.colors.primary,
        background: theme.colors.background,
        card: theme.colors.surface,
        text: theme.colors.textPrimary,
        border: theme.colors.border,
        notification: theme.colors.primary,
      },
    };
  }, [theme, themeMode]);

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <RootStack.Navigator
        initialRouteName={RootRoutes.ClientAuth}
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <RootStack.Screen name={RootRoutes.ClientAuth}>
          {() => (
            <AuthGuard
              guest={<ClientAuthStack />}
              client={<ClientStack />}
              professional={<ProfessionalStack />}
            />
          )}
        </RootStack.Screen>

        <RootStack.Screen
          name={RootRoutes.ClientApp}
          component={ClientScreen}
        />

        <RootStack.Screen
          name={RootRoutes.ProfessionalApp}
          component={ProfessionalScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
