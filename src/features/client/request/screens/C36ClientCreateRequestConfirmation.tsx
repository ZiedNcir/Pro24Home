import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import ScreenContainer from '@components/ScreenContainer';
import { AppText, Button, Icon, radius, shadows, sizes, spacing, vSpacing } from '../../../../design-system';
import { ClientRoutes } from '../../../../navigation/routes';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import { RequestProgress } from '../components';

type Props = NativeStackScreenProps<any>;

export const C36ClientCreateRequestConfirmation: React.FC<Props> = ({ navigation, route }) => {
  const interventionId = (route.params as any)?.interventionId;
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <ScreenContainer withTopSafeArea paddingHorizontal={sizes.screen.horizontalPadding}>
      <View style={styles.container}>
        <View style={styles.successCircle}>
          <Icon name="check" size="xl" color={c.textInverse} />
        </View>

        <View style={styles.textBlock}>
          <AppText variant="h1" color={c.text} align="center">
            Demande envoyée
          </AppText>

          <AppText variant="bodyLarge" color={c.textMuted} align="center">
            Nous recherchons un professionnel disponible autour de vous.
          </AppText>
        </View>

        <View style={styles.card}>
          <RequestProgress current={7} total={7} />
          <AppText variant="bodyMedium" color={c.text} align="center">
            Votre demande est maintenant en attente de prise en charge.
          </AppText>
        </View>

        <View style={styles.footer}>
          <Button
            title="Rechercher un professionnel"
            rightIcon="search"
            onPress={() =>
              navigation.replace(ClientRoutes.Matching as never, {
                interventionId: interventionId || 0,
              } as never)
            }
          />

          <Button
            title="Retour à l’accueil"
            variant="outline"
            onPress={() => navigation.navigate(ClientRoutes.Home as never)}
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
  successCircle: {
    alignSelf: 'center',
    width: 104,
    height: 104,
    borderRadius: radius.full,
    backgroundColor: c.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  textBlock: {
    gap: vSpacing[2],
  },
  card: {
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[5],
    gap: vSpacing[3],
    ...shadows.sm,
  },
  footer: {
    gap: vSpacing[2],
  },
});
