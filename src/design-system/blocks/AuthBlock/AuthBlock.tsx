import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../foundations';
import { AppText, Button } from '../../ui';

export interface AuthBlockProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  primaryLabel: string;
  secondaryLabel?: string;
  footerText?: string;
  onPrimaryPress: () => void;
  onSecondaryPress?: () => void;
}

export const AuthBlock: React.FC<AuthBlockProps> = ({
  title,
  subtitle,
  children,
  primaryLabel,
  secondaryLabel,
  footerText,
  onPrimaryPress,
  onSecondaryPress,
}) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <AppText variant="h1">{title}</AppText>
      {subtitle ? <AppText variant="bodyLarge" color={colors.textMuted}>{subtitle}</AppText> : null}
    </View>

    <View style={styles.form}>
      {children}
    </View>

    <View style={styles.actions}>
      <Button title={primaryLabel} onPress={onPrimaryPress} />
      {secondaryLabel ? <Button title={secondaryLabel} variant="ghost" onPress={onSecondaryPress} /> : null}
    </View>

    {footerText ? <AppText variant="caption" color={colors.textMuted} align="center">{footerText}</AppText> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing[6],
    justifyContent: 'center',
    gap: spacing[6],
    backgroundColor: colors.background,
  },
  header: { gap: spacing[2] },
  form: { gap: spacing[4] },
  actions: { gap: spacing[2] },
});
