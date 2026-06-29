import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { AppText, Button, ProgressDots } from '../../ui';

export interface FormStepBlockProps {
  title: string;
  description?: string;
  current: number;
  total: number;
  children: React.ReactNode;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

export const FormStepBlock: React.FC<FormStepBlockProps> = ({
  title,
  description,
  current,
  total,
  children,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <ProgressDots total={total} current={current} />
      <AppText variant="h2">{title}</AppText>
      {description ? <AppText variant="body" color={colors.textMuted}>{description}</AppText> : null}
    </View>

    <View style={styles.body}>
      {children}
    </View>

    <View style={styles.actions}>
      <Button title={primaryLabel} onPress={onPrimaryPress} />
      {secondaryLabel ? <Button title={secondaryLabel} variant="ghost" onPress={onSecondaryPress} /> : null}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[5],
    gap: spacing[6],
    backgroundColor: colors.background,
  },
  header: { gap: spacing[3] },
  body: { flex: 1, gap: spacing[4] },
  actions: { gap: spacing[2] },
});
