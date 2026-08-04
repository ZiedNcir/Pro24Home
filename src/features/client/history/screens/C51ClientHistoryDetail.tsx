import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppLoader, AppText, Button, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { InterventionStatus, useGetInterventionQuery } from '../../../../store/api';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

type Props = NativeStackScreenProps<any>;

const statusLabel = (status?: string) => {
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
      return status || '-';
  }
};

export const C51ClientHistoryDetail: React.FC<Props> = ({ navigation, route }) => {
  const interventionId = (route.params as any)?.interventionId || 0;
  const { data, isLoading } = useGetInterventionQuery(interventionId, { skip: !interventionId });
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={0} paddingVertical={0}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrowLeft" size="sm" color={c.primary} />
        </Pressable>
        <View style={styles.headerText}>
          <AppText variant="h2" color={c.text}>Détail intervention</AppText>
          <AppText variant="caption" color={c.textMuted}>
            #{String(interventionId).padStart(6, '0')}
          </AppText>
        </View>
        <View style={styles.placeholder} />
      </View>

      {isLoading ? (
        <View style={styles.loader}>
          <AppLoader label="Chargement du détail..." />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusCard}>
            <View style={styles.iconBox}>
              <Icon name="receipt" size="md" color={c.primary} />
            </View>
            <View style={styles.statusText}>
              <AppText variant="bodyMedium" color={c.text}>{data?.title || 'Intervention'}</AppText>
              <AppText variant="caption" color={c.textMuted}>
                {data?.service?.name || 'Service'}
              </AppText>
            </View>
            <View style={styles.statusPill}>
              <AppText variant="caption" color={c.primary}>{statusLabel(data?.status)}</AppText>
            </View>
          </View>

          <View style={styles.card}>
            <AppText variant="bodyMedium" color={c.text}>Description</AppText>
            <AppText variant="body" color={c.textMuted}>
              {data?.description || 'Aucune description disponible.'}
            </AppText>
          </View>

          <View style={styles.card}>
            <AppText variant="bodyMedium" color={c.text}>Adresse</AppText>
            <AppText variant="body" color={c.textMuted}>
              {data?.address?.address || 'Adresse non disponible'}
            </AppText>
          </View>

          {data?.professional ? (
            <View style={styles.card}>
              <AppText variant="bodyMedium" color={c.text}>Professionnel</AppText>
              <View style={styles.proRow}>
                <View style={styles.avatar}>
                  <Icon name="user" size="md" color={c.primary} />
                </View>
                <View style={styles.proText}>
                  <AppText variant="bodyMedium" color={c.text}>
                    {data.professional.first_name} {data.professional.last_name}
                  </AppText>
                  <AppText variant="caption" color={c.textMuted}>
                    {data.professional.phone_number}
                  </AppText>
                </View>
              </View>
            </View>
          ) : null}

          {data?.status === InterventionStatus.IN_PROGRESS || data?.status === InterventionStatus.ACCEPTED ? (
            <Button
              title="Suivre l’intervention"
              rightIcon="map"
              onPress={() =>
                navigation.navigate(ClientRoutes.Tracking as never, { interventionId } as never)
              }
            />
          ) : null}
        </ScrollView>
      )}
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  header: {
    minHeight: 66,
    paddingHorizontal: sizes.screen.horizontalPadding,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: c.surface,
    borderBottomWidth: 1,
    borderBottomColor: c.strokeLight,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1, alignItems: 'center' },
  placeholder: { width: 42 },
  loader: { flex: 1, justifyContent: 'center' },
  content: {
    padding: sizes.screen.horizontalPadding,
    gap: vSpacing[3],
    paddingBottom: vSpacing[8],
  },
  statusCard: {
    minHeight: 100,
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
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: { flex: 1, gap: 2 },
  statusPill: {
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    paddingHorizontal: spacing[3],
    paddingVertical: vSpacing[1],
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    gap: vSpacing[2],
    ...shadows.sm,
  },
  proRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  proText: { flex: 1 },
});
