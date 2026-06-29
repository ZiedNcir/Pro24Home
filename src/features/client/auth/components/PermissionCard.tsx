import React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Button,
  Icon,
  IconName,
  colors,
  radius,
  shadows,
  spacing,
  vSpacing,
} from '../../../../design-system';

export interface PermissionCardProps {
  icon: IconName;
  title: string;
  description: string;
  allowLabel: string;
  laterLabel: string;
  onAllow: () => void;
  onLater: () => void;
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  icon,
  title,
  description,
  allowLabel,
  laterLabel,
  onAllow,
  onLater,
}) => (
  <View style={styles.card}>
    <View style={styles.iconBox}>
      <Icon name={icon} size="xl" color={colors.primary[600]} />
    </View>

    <View style={styles.text}>
      <AppText variant="h1" align="center">
        {title}
      </AppText>
      <AppText variant="bodyLarge" color={colors.textMuted} align="center">
        {description}
      </AppText>
    </View>

    <View style={styles.actions}>
      <Button title={allowLabel} onPress={onAllow} />
      <Button title={laterLabel} variant="ghost" onPress={onLater} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[6],
    padding: spacing[5],
  },
  iconBox: {
    width: vSpacing[16],
    height: vSpacing[16],
    borderRadius: radius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  text: {
    gap: vSpacing[3],
  },
  actions: {
    alignSelf: 'stretch',
    gap: vSpacing[2],
  },
});
