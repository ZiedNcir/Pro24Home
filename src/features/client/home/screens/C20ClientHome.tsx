import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppLoader, AppText, Button, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { useClientHomeData } from '../hooks/useClientHomeData';

type Props = NativeStackScreenProps<any>;

export const C20ClientHome: React.FC<Props> = ({ navigation }) => {
  const data = useClientHomeData();
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={0} paddingVertical={0}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => navigation.navigate(ClientRoutes.Notifications as never)}>
          <Icon name="bell" size="sm" color={c.text} />
        </Pressable>

        <AppText variant="title" color={c.text}>
          PRO<AppText variant="title" color={c.primary}>24</AppText>HOME
        </AppText>

        <Pressable style={styles.iconButton} onPress={() => navigation.navigate(ClientRoutes.Profile as never)}>
          <Icon name="user" size="sm" color={c.text} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={data.isFetching} onRefresh={data.refetch} />}
      >
        <View style={styles.hero}>
          <View style={styles.decorCircle} />
          <AppText variant="h1" color={c.text}>
            Bonjour\n{data.firstName} !
          </AppText>
          <AppText variant="body" color={c.textMuted}>
            Comment pouvons-nous vous aider aujourd’hui ?
          </AppText>

          <Pressable
            style={styles.searchCard}
            onPress={() => navigation.navigate(ClientRoutes.CreateRequest as never)}
          >
            <Icon name="search" size="md" color={c.primary} />
            <AppText variant="bodyMedium" color={c.text}>
              De quel service avez-vous besoin ?
            </AppText>
          </Pressable>
        </View>

        {data.isLoading ? (
          <View style={styles.loadingCard}>
            <AppLoader label="Chargement..." />
          </View>
        ) : data.isEmpty ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Icon name="receipt" size="lg" color={c.primary} />
            </View>
            <AppText variant="h2" color={c.text} align="center">
              Aucune demande pour le moment
            </AppText>
            <AppText variant="body" color={c.textMuted} align="center">
              Faites votre première demande en quelques étapes.
            </AppText>
            <Button
              title="Nouvelle demande"
              leftIcon="plus"
              onPress={() => navigation.navigate(ClientRoutes.CreateRequest as never)}
            />
          </View>
        ) : data.activeIntervention ? (
          <Pressable
            style={styles.activeCard}
            onPress={() =>
              navigation.navigate(ClientRoutes.Tracking, {
                interventionId: data.activeIntervention?.id,
              } as never)
            }
          >
            <View style={styles.iconCircle}>
              <Icon name="tools" size="md" color={c.primary} />
            </View>
            <View style={styles.cardText}>
              <AppText variant="bodyMedium" color={c.primary}>Intervention en cours</AppText>
              <AppText variant="caption" color={c.text}>
                {data.activeIntervention.title}
              </AppText>
            </View>
            <Icon name="chevronRight" size="sm" color={c.primary} />
          </Pressable>
        ) : null}

        <View style={styles.sectionHeader}>
          <AppText variant="bodyMedium" color={c.text}>Catégories populaires</AppText>
          <Pressable onPress={() => navigation.navigate(ClientRoutes.Categories as never)}>
            <AppText variant="caption" color={c.primary}>Voir tout</AppText>
          </Pressable>
        </View>

        <View style={styles.categories}>
          {data.categories.slice(0, 4).map((category) => (
            <Pressable
              key={category.id}
              style={styles.categoryCard}
              onPress={() =>
                navigation.navigate(ClientRoutes.CreateRequest, {
                  serviceId: category.id,
                } as never)
              }
            >
              <View style={styles.categoryIcon}>
                <Icon name={category.icon} size="md" color={c.primary} />
              </View>
              <AppText variant="caption" color={c.text} align="center" numberOfLines={1}>
                {category.label}
              </AppText>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.promoCard}>
          <Icon name="success" size="md" color={c.primary} />
          <View style={styles.cardText}>
            <AppText variant="bodyMedium" color={c.primary}>
              Des professionnels qualifiés à votre service
            </AppText>
            <AppText variant="caption" color={c.textMuted}>
              Intervention rapide et sécurisée
            </AppText>
          </View>
          <Icon name="chevronRight" size="sm" color={c.primary} />
        </Pressable>

        {data.recentRequests.length ? (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <AppText variant="bodyMedium" color={c.text}>Demandes récentes</AppText>
              <Pressable onPress={() => navigation.navigate(ClientRoutes.History as never)}>
                <AppText variant="caption" color={c.primary}>Voir tout</AppText>
              </Pressable>
            </View>
            <Pressable
              style={styles.activeCard}
              onPress={() =>
                navigation.navigate(ClientRoutes.HistoryDetail, {
                  interventionId: data.recentRequests[0].id,
                } as never)
              }
            >
              <View style={styles.iconCircle}>
                <Icon name="receipt" size="sm" color={c.primary} />
              </View>
              <View style={styles.cardText}>
                <AppText variant="bodyMedium" color={c.text}>{data.recentRequests[0].title}</AppText>
                <AppText variant="caption" color={c.textMuted}>{data.recentRequests[0].reference}</AppText>
              </View>
              <AppText variant="caption" color={c.primary}>{data.recentRequests[0].status}</AppText>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  header: {
    height: 58,
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: c.surface,
    borderBottomWidth: 1,
    borderBottomColor: c.strokeLight,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.full,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  content: {
    paddingBottom: vSpacing[10],
  },
  hero: {
    minHeight: 250,
    backgroundColor: c.primaryLighter,
    padding: spacing[5],
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  decorCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.38)',
    right: -50,
    top: -35,
  },
  searchCard: {
    minHeight: 72,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.sm,
  },
  loadingCard: {
    margin: sizes.screen.horizontalPadding,
    minHeight: 180,
    justifyContent: 'center',
    borderRadius: radius.xl,
    backgroundColor: c.surface,
  },
  emptyCard: {
    marginTop: -46,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 52,
    backgroundColor: c.background,
    paddingHorizontal: spacing[5],
    paddingTop: vSpacing[6],
    paddingBottom: vSpacing[3],
    alignItems: 'center',
    gap: vSpacing[3],
  },
  emptyIcon: {
    width: 62,
    height: 62,
    borderRadius: radius.full,
    backgroundColor: c.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  activeCard: {
    marginHorizontal: sizes.screen.horizontalPadding,
    marginTop: vSpacing[3],
    minHeight: 82,
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  sectionHeader: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingTop: vSpacing[4],
    paddingBottom: vSpacing[2],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categories: {
    paddingHorizontal: sizes.screen.horizontalPadding,
    flexDirection: 'row',
    gap: spacing[2],
  },
  categoryCard: {
    flex: 1,
    minHeight: 88,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[1],
    ...shadows.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoCard: {
    marginHorizontal: sizes.screen.horizontalPadding,
    marginTop: vSpacing[3],
    minHeight: 78,
    borderRadius: radius.xl,
    backgroundColor: c.primaryLighter,
    borderWidth: 1,
    borderColor: c.primaryLight,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  recentSection: {
    gap: vSpacing[1],
  },
});
