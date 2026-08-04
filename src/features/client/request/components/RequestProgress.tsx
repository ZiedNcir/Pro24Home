import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { radius, spacing } from '../../../../design-system';
import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

export interface RequestProgressProps {
  current: number;
  total: number;
}

export const RequestProgress: React.FC<RequestProgressProps> = ({ current, total }) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index < current && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing[2],
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    flex: 1,
    height: 5,
    borderRadius: radius.full,
    backgroundColor: c.strokeLight,
  },
  activeDot: {
    backgroundColor: c.primary,
  },
});
