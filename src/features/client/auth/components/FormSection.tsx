import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, Icon, IconName, colors, radius, spacing, vSpacing } from '../../../../design-system';

export interface FormSectionProps {
  icon: IconName;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ icon, title, subtitle, children }) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <View style={styles.iconBox}>
        <Icon name={icon} size="sm" color={colors.primary[600]} />
      </View>
      <View style={styles.headerText}>
        <AppText variant="title" color={colors.text}>{title}</AppText>
        <AppText variant="body" color={colors.textMuted}>{subtitle}</AppText>
      </View>
    </View>
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  section: { gap: vSpacing[3] },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing[3] },
  iconBox: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  content: { gap: vSpacing[3] },
});
