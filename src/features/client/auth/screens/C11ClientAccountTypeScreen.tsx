import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  colors,
  sizes,
  spacing,
  vSpacing,
} from '../../../../design-system';

import ScreenContainer from '@components/ScreenContainer';
import { AccountTypeIllustrations } from '../../../../assets/illustrations/accountType';
import Pro24Logo from '../../../../assets/logo/logo-mediumPro24.svg';
import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES } from '../constants';
import { AccountTypeCard } from '../components/AccountTypeCard';

type Props = NativeStackScreenProps<any>;

export const C11ClientAccountTypeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScreenContainer paddingHorizontal={0}
      paddingVertical={0} withTopSafeArea={false}
      imageResizeMode="cover"
      useImageBackground
      backgroundImage={AccountTypeIllustrations.Background}>

      <View style={styles.container}>
        <Pro24Logo width={220} height={100} />
        <View style={styles.header}>
          <AppText variant="h1" align="center" color={colors.text}>
            {t('module1.accountType.title')}
          </AppText>

        </View>

        <View style={styles.cards}>
          <AccountTypeCard
            title={t('module1.accountType.client.title')}
            subtitle={t('module1.accountType.client.subtitle')}
            image={AccountTypeIllustrations.Client}
            accent="orange"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.register as never)}
          />

          <AccountTypeCard
            title={t('module1.accountType.professional.title')}
            subtitle={t('module1.accountType.professional.subtitle')}
            image={AccountTypeIllustrations.Professional}
            accent="green"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.professionalRegister as never)}
          />
        </View>

        <View style={styles.footer}>
          <AppText variant="bodyMedium" align="center" color={colors.text}>
            {t('module1.accountType.alreadyRegistered')}
          </AppText>

          <Button
            title={t('module1.accountType.login')}
            variant="outline"
            leftIcon="user"
            onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.login as never)}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: sizes.screen.horizontalPadding,
    paddingBottom: vSpacing[1],
    justifyContent: 'space-evenly',
  },
  header: {
    gap: vSpacing[1],
  },
  cards: {
    flexDirection: 'row',
    gap: spacing[2],
    height: '53%'
  },
  footer: {
    gap: vSpacing[2],
  },
});
