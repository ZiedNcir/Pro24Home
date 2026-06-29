import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon, colors } from '../../design-system';
import { t } from '../../translations/i18n';
import { professionalTabs } from './tabs.config';
import { PlaceholderScreen } from '../utils/PlaceholderScreen';

const Tab = createBottomTabNavigator();

export const ProfessionalBottomTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => {
      const config = professionalTabs.find((tab) => tab.routeName === route.name);

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
    {professionalTabs.map((tab) => (
      <Tab.Screen
        key={tab.key}
        name={tab.routeName}
        component={PlaceholderScreen}
        options={{
          tabBarLabel: t(tab.labelKey),
        }}
      />
    ))}
  </Tab.Navigator>
);
