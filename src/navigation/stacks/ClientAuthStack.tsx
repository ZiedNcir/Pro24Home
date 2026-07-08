import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ClientAuthStackParamList } from '../routes';
import { ClientAuthRoutes } from '../routes';

import {
  C01ClientSplash,
  C01ClientWelcome,
  C05ClientLogin,
  C06ClientRegister,
  C06ProfessionalRegister,
  C07ClientOtp,
  C08ClientGpsPermission,
  C08ClientRegisterSuccess,
  C09ClientNotificationsPermission,
  C11ClientAccountTypeScreen,
} from '../../features/client/auth';



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
      name={ClientAuthRoutes.RegisterSuccess}
      component={C08ClientRegisterSuccess}
    />
    <Stack.Screen
      name={ClientAuthRoutes.AccountType}
      component={C11ClientAccountTypeScreen}
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
      name={ClientAuthRoutes.ProfessionalRegister}
      component={C06ProfessionalRegister}
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
