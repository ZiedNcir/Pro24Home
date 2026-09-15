import React from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { createTabBarRenderer } from '../src/app/navigation/createTabBarRenderer';

describe('createTabBarRenderer', () => {
  it('creates a hook-using tab bar as an element instead of invoking it directly', () => {
    const HookUsingTabBar = (): React.JSX.Element => {
      React.useState(false);
      return <></>;
    };

    const renderTabBar = createTabBarRenderer(HookUsingTabBar);

    expect(() => renderTabBar({} as BottomTabBarProps)).not.toThrow();
    expect(React.isValidElement(renderTabBar({} as BottomTabBarProps))).toBe(true);
  });
});
