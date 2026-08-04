import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppLoader, AppText, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { Intervention, InterventionStatus, useGetInterventionsQuery } from '../../../../store/api';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { Pressable } from 'react-native';

type Props = NativeStackScreenProps<any>;

const asArray = <T,>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (Array.isArray((value as any)?.data)) return (value as any).data as T[];
  return [];
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case InterventionStatus.COMPLETED:
      return 'Terminée';
    case InterventionStatus.IN_PROGRESS:
      return 'En cours';
    case InterventionStatus.ACCEPTED:
      return 'Acceptée';
    case InterventionStatus.PENDING:
      return 'En attente';
    case InterventionStatus.CANCELED:
      return 'Annulée';
    case InterventionStatus.REJECTED:
      return 'Refusée';
    default:
      return status;
  }
};

export const C50ClientHistory: React.FC<Props> = ({ navigation }) => {
  const { data, isLoading, isFetching, refetch } = useGetInterventionsQuery({
    page: 1,
    per_page: 20,
    type: 'client',
  });

  const interventions = asArray<Intervention>(data);
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={0} paddingVertical={0}>
      <View style={styles.header}>
        <AppText variant="h1" color={c.text}>Historique</AppText>
        <AppText variant="body" color={c.textMuted}>Toutes vos demandes d’intervention.</AppText>
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <AppLoader label="Chargement de l’historique..." />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} />}
        >
          {!interventions.length ? (
            <View style={styles.empty}>
              <Icon name="receipt" size="xl" color={c.primary} />
              <AppText variant="h2" color={c.text} align="center">Aucune demande</AppText>
              <AppText variant="body" color={c.textMuted} align="center">
                Vos demandes apparaîtront ici après création.
              </AppText>
            </View>
          ) : (
            interventions.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                onPress={() =>
                  navigation.navigate(ClientRoutes.HistoryDetail, {
                    interventionId: item.id,
                  } as never)
                }
              >
                <View style={styles.iconBox}>
                  <Icon name="receipt" size="sm" color={c.primary} />
                </View>

                <View style={styles.content}>
                  <AppText variant="bodyMedium" color={c.text}>{item.title}</AppText>
                  <AppText variant="caption" color={c.textMuted}>
                    #{String(item.id).padStart(6, '0')}
                  </AppText>
                  <AppText variant="caption" color={c.textMuted}>
                    {item.service?.name || 'Service'}
                  </AppText>
                </View>

                <View style={styles.status}>
                  <AppText variant="caption" color={c.primary}>
                    {getStatusLabel(item.status)}
                  </AppText>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  header: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[4],
    paddingBottom: vSpacing[3],
    backgroundColor: c.background,
    gap: vSpacing[1],
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingBottom: vSpacing[8],
    gap: vSpacing[3],
  },
  card: {
    minHeight: 96,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.sm,
  },
  pressed: { opacity: 0.82 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  status: {
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    paddingHorizontal: spacing[3],
    paddingVertical: vSpacing[1],
  },
  empty: {
    minHeight: 360,
    justifyContent: 'center',
    alignItems: 'center',
    gap: vSpacing[3],
  },
});
