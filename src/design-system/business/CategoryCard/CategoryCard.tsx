import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../foundations';
import { Icon, IconName } from '../../icons';
import { AppText, BaseCard } from '../../ui';

export interface CategoryCardProps {
  title: string;
  subtitle?: string;
  icon: IconName;
  selected?: boolean;
  onPress?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  subtitle,
  icon,
  selected = false,
  onPress,
}) => (
  <Pressable onPress={onPress}>
    <BaseCard style={[styles.card, selected && styles.selected]}>
      <View style={styles.iconBox}>
        <Icon name={icon} color={colors.primary[600]} />
      </View>
      <AppText variant="title">{title}</AppText>
      {subtitle ? <AppText variant="caption" color={colors.textMuted}>{subtitle}</AppText> : null}
    </BaseCard>
  </Pressable>
);

const styles = StyleSheet.create({
  card: { gap: spacing[2] },
  selected: { borderColor: colors.primary[600], backgroundColor: colors.primary[50] },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
