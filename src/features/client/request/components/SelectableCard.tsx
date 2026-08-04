import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Icon, IconName, radius, shadows, spacing, vSpacing } from '../../../../design-system';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

export interface SelectableCardProps {
  title: string;
  subtitle?: string;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
  right?: React.ReactNode;
}

export const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  icon = 'tools',
  selected = false,
  onPress,
  right,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Icon name={icon} size="md" color={selected ? c.textInverse : c.primary} />
      </View>

      <View style={styles.content}>
        <AppText variant="bodyMedium" color={c.text}>
          {title}
        </AppText>

        {subtitle ? (
          <AppText variant="caption" color={c.textMuted}>
            {subtitle}
          </AppText>
        ) : null}
      </View>

      {right || (
        <Icon
          name={selected ? 'check' : 'chevronRight'}
          size="sm"
          color={selected ? c.primary : c.textMuted}
        />
      )}
    </Pressable>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  card: {
    minHeight: 82,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    ...shadows.sm,
  },
  selected: {
    borderColor: c.primary,
    backgroundColor: c.primaryLighter,
  },
  pressed: {
    opacity: 0.82,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: c.primary,
  },
  content: {
    flex: 1,
    gap: vSpacing[1],
  },
});
