// src/components/ScreenContainer.tsx
import React, { useEffect } from 'react';
import {
  View,
  ViewProps,
  StatusBar,
  ScrollView,
  ScrollViewProps,
  ImageBackground,
  ImageSourcePropType,
  StyleSheet,
  Platform,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import {
  SafeAreaView,
  Edge,
} from 'react-native-safe-area-context';

import SystemNavigationBar from 'react-native-system-navigation-bar';

import {
  horizontalScale,
  verticalScale,
} from '@utils/normalizedCss';

import { colors } from '@theme/index';

type Mode = 'light' | 'dark';

interface ScreenContainerProps extends ViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
  paddingHorizontal?: number;
  paddingVertical?: number;
  backgroundColor?: string;
  backgroundImage?: ImageSourcePropType;
  useImageBackground?: boolean;
  imageResizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  mode?: Mode;
  centered?: boolean;
  withTopSafeArea?: boolean;
  withBottomSafeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  translucent?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

const getBackgroundByMode = (mode: Mode) => {
  return mode === 'dark'
    ? colors?.black || '#0D0F12'
    : colors?.background || '#F6F6F7';
};

const getStatusBarStyleByMode = (mode: Mode) => {
  return mode === 'dark' ? 'light-content' : 'dark-content';
};

const ScreenContainer = React.forwardRef<View, ScreenContainerProps>(
  (
    {
      children,
      scrollable = false,
      paddingHorizontal = horizontalScale(20),
      paddingVertical = verticalScale(16),
      backgroundColor,
      backgroundImage,
      useImageBackground = false,
      imageResizeMode = 'cover',
      mode = 'light',
      centered = false,
      withTopSafeArea = true,
      withBottomSafeArea = false,
      statusBarStyle,
      translucent = true,
      contentContainerStyle,
      ...props
    },
    ref,
  ) => {
    const resolvedBackground = backgroundColor || getBackgroundByMode(mode);
    const resolvedStatusBarStyle =
      statusBarStyle || getStatusBarStyleByMode(mode);

    const safeAreaEdges: Edge[] = [];

    if (withTopSafeArea) safeAreaEdges.push('top');
    if (withBottomSafeArea) safeAreaEdges.push('bottom');

    safeAreaEdges.push('left', 'right');

    useEffect(() => {
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(translucent);
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setBarStyle(resolvedStatusBarStyle);
        SystemNavigationBar.navigationHide();
      }
    }, [resolvedStatusBarStyle, translucent]);

    const content = scrollable ? (
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        {...(props as ScrollViewProps)}
      >
        <ContentInner
          ref={ref}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          centered={centered}
        >
          {children}
        </ContentInner>
      </StyledScrollView>
    ) : (
      <ContentInner
        ref={ref}
        paddingHorizontal={paddingHorizontal}
        paddingVertical={paddingVertical}
        centered={centered}
        {...props}
      >
        {children}
      </ContentInner>
    );

    return (
      <Root backgroundColor={resolvedBackground}>
        <StatusBar
          translucent={translucent}
          barStyle={resolvedStatusBarStyle}
          backgroundColor="transparent"
        />

        {useImageBackground && backgroundImage ? (
          <ImageBackground
            source={backgroundImage}
            resizeMode={imageResizeMode}
            style={StyleSheet.absoluteFillObject}
            imageStyle={styles.backgroundImage}
          />
        ) : null}

        <SafeContent edges={safeAreaEdges}>{content}</SafeContent>
      </Root>
    );
  },
);

ScreenContainer.displayName = 'ScreenContainer';

export default ScreenContainer;

const Root = styled.View<{ backgroundColor: string }>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const SafeContent = styled(SafeAreaView)`
  flex: 1;
`;

const StyledScrollView = styled(ScrollView)`
  flex: 1;
`;

const ContentInner = styled(View) <{
  paddingHorizontal: number;
  paddingVertical: number;
  centered?: boolean;
}>`
  flex: 1;
  width: 100%;
  padding-left: ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-right: ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-top: ${({ paddingVertical }) => paddingVertical}px;
  padding-bottom: ${({ paddingVertical }) => paddingVertical}px;

  ${({ centered }) =>
    centered &&
    css`
      justify-content: center;
    `}
`;

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});