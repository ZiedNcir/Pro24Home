import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ClientStackParamList } from '../routes';
import { ClientRoutes } from '../routes';
import { ClientBottomTabs } from '../tabs';
import { PlaceholderScreen } from '../utils/PlaceholderScreen';

const Stack = createNativeStackNavigator<ClientStackParamList>();

export const ClientStack = () => (
  <Stack.Navigator
    initialRouteName={ClientRoutes.Home}
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={ClientRoutes.Home}
      component={ClientBottomTabs}
    />
    <Stack.Screen
      name={ClientRoutes.Categories}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ClientRoutes.CreateRequest}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ClientRoutes.Matching}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ClientRoutes.Quote}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ClientRoutes.Tracking}
      component={PlaceholderScreen}
    />
  </Stack.Navigator>
);
