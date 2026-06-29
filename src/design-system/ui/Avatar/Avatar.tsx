import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { colors, radius } from '../../foundations';
import { AppText } from '../Text';

export interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ source, name = '?', size = 48 }) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.base, { width: size, height: size, borderRadius: radius.full }]}>
      {source ? (
        <Image source={source} style={{ width: size, height: size, borderRadius: radius.full }} />
      ) : (
        <AppText variant="title" color={colors.primary[700]}>{initial}</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
