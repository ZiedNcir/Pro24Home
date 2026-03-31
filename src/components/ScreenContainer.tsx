// src/components/ScreenContainer.tsx
import React from 'react';
import { View, ViewProps, StatusBar } from 'react-native';
import styled from 'styled-components/native';
import { verticalScale, horizontalScale } from '@utils/normalizedCss';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@theme/index';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  padding?: number;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarBackgroundColor?: string;
  translucent?: boolean;
}

interface SafeContainerProps {
  backgroundColor?: string;
}

const SafeContainer = styled(SafeAreaView) <SafeContainerProps>`
  flex: 1;
  background-color: ${props => props.backgroundColor || colors.background};
`;

interface ContentViewProps extends ViewProps {
  padding?: number;
}

const ContentView = styled(View) <ContentViewProps>`
  flex: 1;
  padding-horizontal: ${props => props.padding || horizontalScale(4)}px;
  padding-vertical: ${props => props.padding || verticalScale(4)}px;
`;

/**
 * ScreenContainer - Reusable screen wrapper with safe area and consistent padding
 * 
 * Usage:
 * <ScreenContainer>
 *   <Text>Content here</Text>
 * </ScreenContainer>
 */
const ScreenContainer = React.forwardRef<View, ScreenContainerProps>(
  ({
    children,
    padding,
    backgroundColor,
    statusBarStyle = 'dark-content',
    statusBarBackgroundColor,
    translucent = false,
    ...props
  }, ref) => {
    return (
      <>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={statusBarBackgroundColor || backgroundColor || colors.background}
          translucent={translucent}
        />
        <SafeContainer backgroundColor={backgroundColor}>
          <ContentView ref={ref} padding={padding} {...props}>
            {children}
          </ContentView>
        </SafeContainer>
      </>
    );
  }
);

ScreenContainer.displayName = 'ScreenContainer';

export default ScreenContainer;
