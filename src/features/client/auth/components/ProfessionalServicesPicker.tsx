import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  AppText,
  Icon,
  colors,
  radius,
  shadows,
  spacing,
  vSpacing,
} from '../../../../design-system';

import type { Service } from '../../../../store/api/api.types';

export interface ProfessionalServicesPickerProps {
  services: Service[];
  selectedIds: number[];
  error?: string;
  onToggle: (serviceId: number) => void;
}

export const ProfessionalServicesPicker: React.FC<ProfessionalServicesPickerProps> = ({
  services,
  selectedIds,
  error,
  onToggle,
}) => (
  <View style={styles.container}>
    <View style={styles.grid}>
      {services.map((service) => {
        const selected = selectedIds.includes(service.id);

        return (
          <Pressable
            key={service.id}
            onPress={() => onToggle(service.id)}
            style={({ pressed }) => [
              styles.card,
              selected && styles.cardSelected,
              pressed && styles.cardPressed,
            ]}
          >
            <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
              <Icon name="tools" size="sm" color={selected ? colors.white : colors.primary[600]} />
            </View>

            <AppText variant="bodyMedium" align="center" color={colors.text}>
              {service.name}
            </AppText>
          </Pressable>
        );
      })}
    </View>

    {error ? (
      <AppText variant="caption" color={colors.error} align="center">
        {error}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
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
    minHeight: 104,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.stroke,
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    gap: vSpacing[2],
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  cardPressed: {
    opacity: 0.86,
  },
  iconBox: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxSelected: {
    backgroundColor: colors.primary[600],
  },
});
