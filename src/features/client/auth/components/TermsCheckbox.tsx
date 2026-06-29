import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Icon,
  colors,
  radius,
  spacing,
  vSpacing,
} from '../../../../design-system';

export interface TermsCheckboxProps {
  checked: boolean;
  label: string;
  error?: string;
  onPress: () => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  checked,
  label,
  error,
  onPress,
}) => (
  <View style={styles.container}>
    <Pressable style={styles.row} onPress={onPress}>
      <View style={[styles.box, checked && styles.boxChecked]}>
        {checked ? <Icon name="check" size="xs" color={colors.white} /> : null}
      </View>

      <AppText variant="body" color={colors.text}>
        {label}
      </AppText>
    </Pressable>

    {error ? (
      <AppText variant="caption" color={colors.error}>
        {error}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: vSpacing[1],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  box: {
    width: spacing[6],
    height: spacing[6],
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  boxChecked: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
});
