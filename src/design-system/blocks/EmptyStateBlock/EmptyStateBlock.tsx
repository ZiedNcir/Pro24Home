import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { Icon, IconName } from '../../icons';
import { AppText, Button } from '../../ui';

export interface EmptyStateBlockProps {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export const EmptyStateBlock: React.FC<EmptyStateBlockProps> = ({
  icon = 'tools',
  title,
  description,
  actionLabel,
  onActionPress,
}) => (
  <View style={styles.container}>
    <Icon name={icon} size={72} color={colors.primary[600]} />
    <View style={styles.text}>
      <AppText variant="h2" align="center">{title}</AppText>
      {description ? <AppText variant="body" color={colors.textMuted} align="center">{description}</AppText> : null}
    </View>
    {actionLabel && onActionPress ? <Button title={actionLabel} onPress={onActionPress} /> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[5],
  },
  text: { gap: spacing[2] },
});
