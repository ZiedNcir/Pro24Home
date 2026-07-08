import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  Icon,
  IconName,
  radius,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

export interface FormSectionProps {
  icon: IconName;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  icon,
  title,
  subtitle,
  children,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <Icon name={icon} size="sm" color={c.primary} />
        </View>

        <View style={styles.headerText}>
          <AppText variant="title" color={c.text}>
            {title}
          </AppText>

          <AppText variant="body" color={c.textMuted}>
            {subtitle}
          </AppText>
        </View>
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  section: {
    gap: vSpacing[3],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  iconBox: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  content: {
    gap: vSpacing[3],
  },
});
