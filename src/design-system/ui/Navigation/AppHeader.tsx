import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { IconName } from '../../icons';
import { IconButton } from '../Button';
import { AppText } from '../Text';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}) => (
  <View style={styles.container}>
    <View style={styles.side}>
      {leftIcon ? <IconButton icon={leftIcon} variant="ghost" onPress={onLeftPress} /> : null}
    </View>
    <View style={styles.center}>
      {title ? <AppText variant="title" align="center">{title}</AppText> : null}
      {subtitle ? <AppText variant="caption" color={colors.textMuted} align="center">{subtitle}</AppText> : null}
    </View>
    <View style={styles.side}>
      {rightIcon ? <IconButton icon={rightIcon} variant="ghost" onPress={onRightPress} /> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  side: {
    width: 48,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
});
