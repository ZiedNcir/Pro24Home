import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export const createTabBarRenderer = (
  TabBar: React.ComponentType<BottomTabBarProps>,
) => {
  return (props: BottomTabBarProps): React.JSX.Element => (
    <TabBar {...props} />
  );
};
