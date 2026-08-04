import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppText, Button, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

type Props = NativeStackScreenProps<any>;

export const C37ClientMatching: React.FC<Props> = ({ navigation, route }) => {
  const interventionId = (route.params as any)?.interventionId || 0;
  const rotate = useRef(new Animated.Value(0)).current;
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [rotate]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={sizes.screen.horizontalPadding}>
      <View style={styles.container}>
        <View style={styles.mapMock}>
          <Animated.View style={[styles.radar, { transform: [{ rotate: spin }] }]} />
          <View style={styles.centerPin}>
            <Icon name="home" size="md" color={c.textInverse} />
          </View>
          <View style={[styles.workerPin, styles.workerOne]}>
            <Icon name="tools" size="sm" color={c.primary} />
          </View>
          <View style={[styles.workerPin, styles.workerTwo]}>
            <Icon name="tools" size="sm" color={c.primary} />
          </View>
        </View>

        <View style={styles.textBlock}>
          <AppText variant="h1" color={c.text} align="center">
            Recherche en cours
          </AppText>

          <AppText variant="bodyLarge" color={c.textMuted} align="center">
            Nous contactons les professionnels disponibles autour de vous.
          </AppText>
        </View>

        <View style={styles.card}>
          <AppText variant="bodyMedium" color={c.text} align="center">
            Temps moyen de réponse : moins de 5 minutes
          </AppText>
        </View>

        <View style={styles.footer}>
          <Button
            title="Simuler professionnel trouvé"
            rightIcon="arrowRight"
            onPress={() =>
              navigation.replace(ClientRoutes.Tracking as never, {
                interventionId,
              } as never)
            }
          />

          <Button
            title="Voir mon historique"
            variant="outline"
            onPress={() => navigation.navigate(ClientRoutes.History as never)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: vSpacing[5],
  },
  mapMock: {
    alignSelf: 'center',
    width: 260,
    height: 260,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...shadows.md,
  },
  radar: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 105,
    borderWidth: 2,
    borderColor: c.primary,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  centerPin: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerPin: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerOne: {
    top: 52,
    right: 58,
  },
  workerTwo: {
    bottom: 50,
    left: 56,
  },
  textBlock: {
    gap: vSpacing[2],
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    ...shadows.sm,
  },
  footer: {
    gap: vSpacing[2],
  },
});
