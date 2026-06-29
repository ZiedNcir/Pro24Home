import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ClientAuthStackParamList } from '../routes';
import { ClientAuthRoutes } from '../routes';

import {
  C01ClientSplash,
  C01ClientWelcome,
  C05ClientLogin,
  C06ClientRegister,
  C07ClientOtp,
  C08ClientGpsPermission,
  C09ClientNotificationsPermission,
} from '../../features/client/auth';

import {
  C02ClientOnboardingOne,
  C03ClientOnboardingTwo,
  C04ClientOnboardingThree,
} from '../../features/client/onboarding';

const Stack = createNativeStackNavigator<ClientAuthStackParamList>();

export const ClientAuthStack = () => (
  <Stack.Navigator
    initialRouteName={ClientAuthRoutes.Splash}
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={ClientAuthRoutes.Splash}
      component={C01ClientSplash}
    />
    <Stack.Screen
      name={ClientAuthRoutes.Welcome}
      component={C01ClientWelcome}
    />
    <Stack.Screen
      name={ClientAuthRoutes.OnboardingOne}
      component={C02ClientOnboardingOne}
    />
    <Stack.Screen
      name={ClientAuthRoutes.OnboardingTwo}
      component={C03ClientOnboardingTwo}
    />
    <Stack.Screen
      name={ClientAuthRoutes.OnboardingThree}
      component={C04ClientOnboardingThree}
    />
    <Stack.Screen
      name={ClientAuthRoutes.Login}
      component={C05ClientLogin}
    />
    <Stack.Screen
      name={ClientAuthRoutes.Register}
      component={C06ClientRegister}
    />
    <Stack.Screen
      name={ClientAuthRoutes.Otp}
      component={C07ClientOtp}
    />
    <Stack.Screen
      name={ClientAuthRoutes.GpsPermission}
      component={C08ClientGpsPermission}
    />
    <Stack.Screen
      name={ClientAuthRoutes.NotificationsPermission}
      component={C09ClientNotificationsPermission}
    />
  </Stack.Navigator>
);
