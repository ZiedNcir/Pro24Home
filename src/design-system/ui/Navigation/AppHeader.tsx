import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { DefaultTheme } from 'styled-components/native';

import { spacing } from '../../foundations';
import { IconName } from '../../icons';
import { useTheme } from '../../../theme/ThemeProvider';
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
}) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.side}>
        {leftIcon ? <IconButton icon={leftIcon} variant="ghost" onPress={onLeftPress} /> : null}
      </View>

      <View style={styles.center}>
        {title ? <AppText variant="title" align="center">{title}</AppText> : null}
        {subtitle ? (
          <AppText variant="caption" color={theme.colors.textSecondary} align="center">
            {subtitle}
          </AppText>
        ) : null}
      </View>

      <View style={styles.side}>
        {rightIcon ? <IconButton icon={rightIcon} variant="ghost" onPress={onRightPress} /> : null}
      </View>
    </View>
  );
};

const createStyles = (theme: DefaultTheme) => StyleSheet.create({
  container: {
    minHeight: 56,
    paddingHorizontal: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
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
