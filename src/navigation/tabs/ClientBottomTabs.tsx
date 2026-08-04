import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, colors } from '../../design-system';
import { t } from '../../translations/i18n';
import { ClientRoutes } from '../routes';
import { clientTabs } from './tabs.config';

import { PlaceholderScreen } from '../utils/PlaceholderScreen';
import { C50ClientHistory } from '../../features/client/history/screens/C50ClientHistory';
import { C20ClientHome } from '../../features/client/home';

const Tab = createBottomTabNavigator();

const getComponent = (routeName: string) => {
  switch (routeName) {
    case ClientRoutes.Home:
      return C20ClientHome;
    case ClientRoutes.History:
      return C50ClientHistory;
    default:
      return PlaceholderScreen;
  }
};

export const ClientBottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const config = clientTabs.find((tab) => tab.routeName === route.name);

      return {
        headerShown: false,
        tabBarActiveTintColor: colors.primary[600],
        tabBarInactiveTintColor: colors.gray[500],
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 8,
        },
        tabBarIcon: ({ color, size }) =>
          config ? <Icon name={config.icon} size={size} color={color} /> : null,
      };
    }}
  >
    {clientTabs.map((tab) => (
      <Tab.Screen
        key={tab.key}
        name={tab.routeName}
        component={getComponent(tab.routeName)}
        options={{
          tabBarLabel: t(tab.labelKey),
        }}
      />
    ))}
  </Tab.Navigator>
);
