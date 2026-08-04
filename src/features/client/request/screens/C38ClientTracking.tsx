import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppText, Button, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useGetInterventionQuery } from '../../../../store/api';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

type Props = NativeStackScreenProps<any>;

export const C38ClientTracking: React.FC<Props> = ({ navigation, route }) => {
  const interventionId = (route.params as any)?.interventionId || 0;
  const { data } = useGetInterventionQuery(interventionId, { skip: !interventionId });
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={0} paddingVertical={0}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrowLeft" size="sm" color={c.primary} />
          </Pressable>
          <AppText variant="h2" color={c.text}>Suivi intervention</AppText>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.map}>
          <View style={styles.routeLine} />
          <View style={styles.homePin}>
            <Icon name="home" size="sm" color={c.textInverse} />
          </View>
          <View style={styles.proPin}>
            <Icon name="car" size="sm" color={c.textInverse} />
          </View>
        </View>

        <View style={styles.sheet}>
          <View style={styles.statusCard}>
            <View style={styles.statusDot} />
            <View style={styles.statusContent}>
              <AppText variant="bodyMedium" color={c.primary}>
                Professionnel en route
              </AppText>
              <AppText variant="caption" color={c.textMuted}>
                Arrivée estimée : 18 minutes
              </AppText>
            </View>
          </View>

          <View style={styles.proCard}>
            <View style={styles.avatar}>
              <Icon name="user" size="lg" color={c.primary} />
            </View>
            <View style={styles.proText}>
              <AppText variant="bodyMedium" color={c.text}>
                {data?.professional?.first_name || 'Professionnel'} {data?.professional?.last_name?.[0] || ''}
              </AppText>
              <AppText variant="caption" color={c.textMuted}>
                {data?.service?.name || 'Service'}
              </AppText>
              <AppText variant="caption" color={c.primary}>4.9 ★</AppText>
            </View>
            <Pressable style={styles.iconButton}>
              <Icon name="phone" size="sm" color={c.primary} />
            </Pressable>
          </View>

          <Button
            title="Voir le détail"
            variant="outline"
            onPress={() => navigation.navigate(ClientRoutes.HistoryDetail as never, { interventionId } as never)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  root: { flex: 1, backgroundColor: c.background },
  header: {
    height: 62,
    paddingHorizontal: sizes.screen.horizontalPadding,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.surface,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: { width: 42 },
  map: {
    flex: 1,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeLine: {
    width: '70%',
    borderTopWidth: 3,
    borderStyle: 'dashed',
    borderColor: c.primary,
    transform: [{ rotate: '-22deg' }],
  },
  homePin: {
    position: 'absolute',
    left: '20%',
    bottom: '32%',
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proPin: {
    position: 'absolute',
    right: '22%',
    top: '30%',
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    backgroundColor: c.background,
    padding: spacing[5],
    gap: vSpacing[3],
    ...shadows.md,
  },
  statusCard: {
    minHeight: 72,
    borderRadius: radius.xl,
    backgroundColor: c.primaryLighter,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: c.primary },
  statusContent: { flex: 1, gap: 2 },
  proCard: {
    minHeight: 90,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proText: { flex: 1, gap: 2 },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: c.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
