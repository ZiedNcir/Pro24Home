// src/components/ScreenContainer.tsx
import React from 'react';
import {
  View,
  ViewProps,
  StatusBar,
  ScrollView,
  ScrollViewProps,
  ImageSourcePropType,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { verticalScale, horizontalScale } from '@utils/normalizedCss';
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
  contentMaxWidth?: number;
  centered?: boolean;
  mode?: Mode;
  withTopSafeArea?: boolean;
  withBottomSafeArea?: boolean;
  statusBarStyle?: 'light-content' | 'dark-content' | 'default';
  statusBarBackgroundColor?: string;
  translucent?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
}

interface RootProps {
  backgroundColor: string;
}

interface InnerProps {
  paddingHorizontal: number;
  paddingVertical: number;
  contentMaxWidth?: number;
  centered?: boolean;
}

const getBackgroundByMode = (mode: Mode) => {
  if (mode === 'dark') {
    return colors?.black || '#0D0F12';
  }
  return colors?.background || '#F6F6F7';
};

const getStatusBarStyleByMode = (mode: Mode) => {
  return mode === 'dark' ? 'light-content' : 'dark-content';
};

const Root = styled(View) <RootProps>`
  flex: 1;
  background-color: ${({ backgroundColor }) => backgroundColor};
`;

const ForegroundSafeArea = styled(SafeAreaView)`
  flex: 1;
`;

const BaseInnerStyles = css<InnerProps>`
  flex: 1;
  width: 100%;
  align-self: center;
  padding-left: ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-right: ${({ paddingHorizontal }) => paddingHorizontal}px;
  padding-top: ${({ paddingVertical }) => paddingVertical}px;
  padding-bottom: ${({ paddingVertical }) => paddingVertical}px;

  ${({ contentMaxWidth }) =>
    contentMaxWidth &&
    css`
      max-width: ${contentMaxWidth}px;
    `}

  ${({ centered }) =>
    centered &&
    css`
      justify-content: center;
    `}
`;

const ContentView = styled(View) <InnerProps>`
  ${BaseInnerStyles}
`;

const StyledScrollView = styled(ScrollView)`
  flex: 1;
`;

const ScrollInner = styled(View) <InnerProps>`
  ${BaseInnerStyles}
`;

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
      contentMaxWidth,
      centered = false,
      mode = 'light',
      withTopSafeArea = true,
      withBottomSafeArea = true,
      statusBarStyle,
      statusBarBackgroundColor,
      translucent = true,
      contentContainerStyle,
      ...props
    },
    ref,
  ) => {
    const resolvedBackground = backgroundColor || getBackgroundByMode(mode);
    const resolvedStatusBarStyle = statusBarStyle || getStatusBarStyleByMode(mode);
    const safeAreaEdges: Edge[] = [];

    if (withTopSafeArea) safeAreaEdges.push('top');
    if (withBottomSafeArea) safeAreaEdges.push('bottom');

    safeAreaEdges.push('left', 'right');

    const content = scrollable ? (
      <StyledScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        {...(props as ScrollViewProps)}
      >
        <ScrollInner
          ref={ref}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          contentMaxWidth={contentMaxWidth}
          centered={centered}
        >
          {children}
        </ScrollInner>
      </StyledScrollView>
    ) : (
      <ContentView
        ref={ref}
        paddingHorizontal={paddingHorizontal}
        paddingVertical={paddingVertical}
        contentMaxWidth={contentMaxWidth}
        centered={centered}
        {...props}
      >
        {children}
      </ContentView>
    );

    return (
      <Root backgroundColor={resolvedBackground}>
        <StatusBar
          translucent={translucent}
          barStyle={resolvedStatusBarStyle}
          backgroundColor={statusBarBackgroundColor || 'transparent'}
        />

        {useImageBackground && backgroundImage ? (
          <ImageBackground
            source={backgroundImage}
            resizeMode={imageResizeMode}
            style={StyleSheet.absoluteFillObject}
            imageStyle={styles.backgroundImage}
          />
        ) : null}

        <ForegroundSafeArea
          edges={safeAreaEdges}
        >
          {content}
        </ForegroundSafeArea>
      </Root>
    );
  },
);

const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
});

ScreenContainer.displayName = 'ScreenContainer';

export default ScreenContainer;