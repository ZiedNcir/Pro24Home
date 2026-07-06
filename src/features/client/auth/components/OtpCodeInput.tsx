import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText, colors, radius, spacing, typography, vSpacing } from '../../../../design-system';

export interface OtpCodeInputProps {
  value: string;
  length?: number;
  error?: string;
  onChangeText: (value: string) => void;
}

export const OtpCodeInput: React.FC<OtpCodeInputProps> = ({ value, length = 6, error, onChangeText }) => {
  const cells = Array.from({ length }, (_, index) => value[index] ?? '');

  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        style={styles.hiddenInput}
      />
      <View style={styles.cells}>
        {cells.map((cell, index) => (
          <View key={index} style={[styles.cell, cell ? styles.cellActive : null]}>
            <AppText variant="h2" align="center" color={colors.text}>{cell}</AppText>
          </View>
        ))}
      </View>
      {error ? <AppText variant="caption" color={colors.error} align="center">{error}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: vSpacing[2] },
  hiddenInput: { position: 'absolute', opacity: 0, ...typography.body },
  cells: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing[2] },
  cell: {
    flex: 1,
    minHeight: vSpacing[10],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.stroke,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellActive: { borderColor: colors.primary[600] },
});
