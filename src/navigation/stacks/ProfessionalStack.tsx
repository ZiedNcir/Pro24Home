import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ProfessionalStackParamList } from '../routes';
import { ProfessionalRoutes } from '../routes';
import { ProfessionalBottomTabs } from '../tabs';
import { PlaceholderScreen } from '../utils/PlaceholderScreen';

const Stack = createNativeStackNavigator<ProfessionalStackParamList>();

export const ProfessionalStack = () => (
  <Stack.Navigator
    initialRouteName={ProfessionalRoutes.Dashboard}
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen
      name={ProfessionalRoutes.Dashboard}
      component={ProfessionalBottomTabs}
    />
    <Stack.Screen
      name={ProfessionalRoutes.MissionDetails}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ProfessionalRoutes.QuoteCreation}
      component={PlaceholderScreen}
    />
    <Stack.Screen
      name={ProfessionalRoutes.Navigation}
      component={PlaceholderScreen}
    />
  </Stack.Navigator>
);
