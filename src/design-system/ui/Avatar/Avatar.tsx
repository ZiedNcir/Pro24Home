import React, { useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { radius } from '../../foundations';
import { useTheme } from '../../../theme/ThemeProvider';
import { AppText } from '../Text/AppText';

export interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '?',
  size = 48,
}) => {
  const { theme } = useTheme();
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  const styles = useMemo(
    () => StyleSheet.create({
      base: {
        backgroundColor: theme.colors.primaryLighter,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
    }),
    [theme],
  );

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: radius.full }]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: radius.full }} />
      ) : (
        <AppText variant="title" color={theme.colors.primaryDark}>{initial}</AppText>
      )}
    </View>
  );
};
