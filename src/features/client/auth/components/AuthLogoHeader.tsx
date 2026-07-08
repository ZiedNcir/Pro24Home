import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Icon,
  radius,
  shadows,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import Pro24Logo from '../../../../assets/logo/logo-mediumPro24.svg';

export interface AuthLogoHeaderProps {
  navigation: any;
  logoWidth?: number;
  logoHeight?: number;
  canGoBack?: boolean;
}

export const AuthLogoHeader: React.FC<AuthLogoHeaderProps> = ({
  navigation,
  logoWidth = 150,
  logoHeight = 64,
  canGoBack = true,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);
  const showBack = canGoBack && navigation.canGoBack();

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        disabled={!showBack}
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [
          styles.backButton,
          !showBack && styles.backButtonHidden,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Icon name="arrowLeft" size="md" color={c.primary} />
      </Pressable>

      <View style={styles.logoWrapper}>
        <Pro24Logo width={logoWidth} height={logoHeight} />
      </View>

      <View style={styles.placeholder} />
    </View>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    width: '100%',
    minHeight: vSpacing[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.lg,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  backButtonPressed: {
    opacity: 0.78,
    transform: [{ scale: 0.97 }],
  },
  backButtonHidden: {
    opacity: 0,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: spacing[10],
    height: spacing[10],
  },
});
