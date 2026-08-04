import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ScreenContainer from '@components/ScreenContainer';
import { AppText, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

export interface ClientRequestLayoutProps {
  title: string;
  subtitle?: string;
  step?: string;
  navigation: any;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scroll?: boolean;
}

export const ClientRequestLayout: React.FC<ClientRequestLayoutProps> = ({
  title,
  subtitle,
  step,
  navigation,
  children,
  footer,
  scroll = true,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  const content = (
    <>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrowLeft" size="sm" color={c.primary} />
        </Pressable>

        <View style={styles.headerText}>
          {step ? (
            <AppText variant="caption" color={c.primary} align="center">
              {step}
            </AppText>
          ) : null}

          <AppText variant="h2" color={c.text} align="center">
            {title}
          </AppText>

          {subtitle ? (
            <AppText variant="body" color={c.textMuted} align="center">
              {subtitle}
            </AppText>
          ) : null}
        </View>

        <View style={styles.placeholder} />
      </View>

      <View style={styles.body}>{children}</View>
    </>
  );

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0} withTopSafeArea>
      <View style={styles.root}>
        {scroll ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {content}
          </ScrollView>
        ) : content}

        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.background,
  },
  scrollContent: {
    paddingBottom: vSpacing[8],
  },
  header: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[3],
    paddingBottom: vSpacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  placeholder: {
    width: 42,
  },
  headerText: {
    flex: 1,
    gap: vSpacing[1],
  },
  body: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    gap: vSpacing[4],
  },
  footer: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[2],
    paddingBottom: vSpacing[4],
    backgroundColor: c.background,
    borderTopWidth: 1,
    borderTopColor: c.strokeLight,
  },
});
