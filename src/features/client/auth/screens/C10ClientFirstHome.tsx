import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  CategoryCard,
  colors,
  sizes,
  vSpacing,
} from '../../../../design-system';

import { t } from '../../../../translations/i18n';
import ScreenContainer from '@components/ScreenContainer';

type Props = NativeStackScreenProps<any>;

export const C10ClientFirstHome: React.FC<Props> = () => (
  <ScreenContainer style={styles.safeArea}>
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="body" color={colors.textMuted}>
          {t('module1.firstHome.greeting')}
        </AppText>
        <AppText variant="h1">
          {t('module1.firstHome.title')}
        </AppText>
        <AppText variant="bodyLarge" color={colors.textMuted}>
          {t('module1.firstHome.subtitle')}
        </AppText>
      </View>

      <View style={styles.categories}>
        <CategoryCard title="Plomberie" subtitle="Fuite, WC bouchés" icon="plumbing" />
        <CategoryCard title="Serrurerie" subtitle="Porte claquée, clé cassée" icon="locksmith" />
        <CategoryCard title="Électricité" subtitle="Panne, court-circuit" icon="electricity" />
        <CategoryCard title="Climatisation" subtitle="Fuite, entretien" icon="airConditioning" />
      </View>

      <Button title={t('module1.firstHome.primaryAction')} onPress={() => { }} />
    </View>
  </ScreenContainer>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingVertical: sizes.screen.verticalPadding,
    gap: vSpacing[6],
  },
  header: {
    gap: vSpacing[2],
  },
  categories: {
    flex: 1,
    gap: vSpacing[3],
  },
});
