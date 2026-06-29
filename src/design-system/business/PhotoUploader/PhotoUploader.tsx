import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../../foundations';
import { Icon } from '../../icons';
import { AppText } from '../../ui';

export interface PhotoUploaderProps {
  count: number;
  max?: number;
  onPress: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  count,
  max = 5,
  onPress,
}) => (
  <Pressable onPress={onPress} style={styles.container}>
    <View style={styles.iconBox}>
      <Icon name="camera" color={colors.primary[600]} />
    </View>
    <View style={styles.text}>
      <AppText variant="title">Ajouter des photos</AppText>
      <AppText variant="body" color={colors.textMuted}>{count}/{max} photos ajoutées</AppText>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary[500],
    borderRadius: radius.xl,
    padding: spacing[4],
    flexDirection: 'row',
    gap: spacing[3],
    alignItems: 'center',
    backgroundColor: colors.primary[50],
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});
