import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Icon,
  radius,
  shadows,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';
import type { Service } from '../../../../store/api/api.types';

export interface ServicePickerProps {
  services: Service[];
  selectedIds: number[];
  error?: string;
  onToggle: (serviceId: number) => void;
}

export const ServicePicker: React.FC<ServicePickerProps> = ({
  services,
  selectedIds,
  error,
  onToggle,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {services.map((service) => {
          const selected = selectedIds.includes(service.id);

          return (
            <Pressable
              key={service.id}
              onPress={() => onToggle(service.id)}
              style={[styles.card, selected && styles.cardSelected]}
            >
              <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
                <Icon
                  name="tools"
                  size="sm"
                  color={selected ? c.textInverse : c.primary}
                />
              </View>

              <AppText variant="bodyMedium" color={c.text} align="center">
                {service.name}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {error ? (
        <AppText variant="caption" color={c.error} align="center">
          {error}
        </AppText>
      ) : null}
    </View>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    gap: vSpacing[2],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  card: {
    width: '47%',
    minHeight: 112,
    borderRadius: radius.xl,
    backgroundColor: c.surface,
    borderWidth: 1,
    borderColor: c.stroke,
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[2],
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: c.primary,
    backgroundColor: c.primaryLighter,
  },
  iconBox: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    backgroundColor: c.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: c.primary,
  },
});
