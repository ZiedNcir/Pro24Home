import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from './routes';
import { RootRoutes } from './routes';
import { navigationRef } from './service';
import { navigationTheme } from './theme';
import { AuthGuard } from './guards';
import {
  ClientAuthStack,
  ClientStack,
  ProfessionalStack,
} from './stacks';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const GuestScreen = () => <ClientAuthStack />;
const ClientScreen = () => <ClientStack />;
const ProfessionalScreen = () => <ProfessionalStack />;

export const AppNavigator = () => {
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
