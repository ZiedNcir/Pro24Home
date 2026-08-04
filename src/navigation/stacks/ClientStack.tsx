import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { ClientStackParamList } from '../routes';
import { ClientRoutes } from '../routes';
import { ClientBottomTabs } from '../tabs';
import { PlaceholderScreen } from '../utils/PlaceholderScreen';

import {
  C30ClientCreateRequestCategory,
  C31ClientCreateRequestDescription,
  C32ClientCreateRequestPhotos,
  C33ClientCreateRequestAddress,
  C34ClientCreateRequestAvailability,
  C35ClientCreateRequestSummary,
  C36ClientCreateRequestConfirmation,
  C37ClientMatching,
  C38ClientTracking,
} from '../../features/client/request';

import {
  C50ClientHistory,
  C51ClientHistoryDetail,
} from '../../features/client/history';

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
      component={C30ClientCreateRequestCategory}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestDescription}
      component={C31ClientCreateRequestDescription}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestPhotos}
      component={C32ClientCreateRequestPhotos}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestAddress}
      component={C33ClientCreateRequestAddress}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestAvailability}
      component={C34ClientCreateRequestAvailability}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestSummary}
      component={C35ClientCreateRequestSummary}
    />

    <Stack.Screen
      name={ClientRoutes.CreateRequestConfirmation}
      component={C36ClientCreateRequestConfirmation}
    />

    <Stack.Screen
      name={ClientRoutes.Matching}
      component={C37ClientMatching}
    />

    <Stack.Screen
      name={ClientRoutes.Quote}
      component={PlaceholderScreen}
    />

    <Stack.Screen
      name={ClientRoutes.Tracking}
      component={C38ClientTracking}
    />

    <Stack.Screen
      name={ClientRoutes.History}
      component={C50ClientHistory}
    />

    <Stack.Screen
      name={ClientRoutes.HistoryDetail}
      component={C51ClientHistoryDetail}
    />

    <Stack.Screen
      name={ClientRoutes.Notifications}
      component={PlaceholderScreen}
    />

    <Stack.Screen
      name={ClientRoutes.Profile}
      component={PlaceholderScreen}
    />
  </Stack.Navigator>
);
