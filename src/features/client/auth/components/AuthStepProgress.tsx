import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  AppText,
  radius,
  spacing,
  vSpacing,
} from '../../../../design-system';

import { useTheme } from '../../../../theme/ThemeProvider';
import { getThemeTokens } from '../../../../theme/themeTokens';

export interface AuthStepProgressProps {
  current: 1 | 2 | 3;
  labels: [string, string, string];
}

export const AuthStepProgress: React.FC<AuthStepProgressProps> = ({
  current,
  labels,
}) => {
  const { theme } = useTheme();
  const c = getThemeTokens(theme);
  const styles = useMemo(() => createStyles(c), [c]);

  return (
    <View style={styles.container}>
      {[1, 2, 3].map((step, index) => {
        const active = step <= current;
        const done = step < current;

        return (
          <React.Fragment key={step}>
            <View style={styles.step}>
              <View style={[styles.circle, active && styles.circleActive]}>
                <AppText
                  variant="label"
                  color={active ? c.textInverse : c.textMuted}
                  align="center"
                >
                  {done ? '✓' : String(step)}
                </AppText>
              </View>

              <AppText
                variant="caption"
                color={active ? c.text : c.textMuted}
                align="center"
              >
                {labels[index]}
              </AppText>
            </View>

            {step < 3 ? (
              <View style={[styles.line, active && styles.lineActive]} />
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
};

const createStyles = (c: ReturnType<typeof getThemeTokens>) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: vSpacing[4],
  },
  step: {
    alignItems: 'center',
    gap: vSpacing[1],
    minWidth: spacing[16],
  },
  circle: {
    width: spacing[8],
    height: spacing[8],
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: c.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.surface,
  },
  circleActive: {
    borderColor: c.primary,
    backgroundColor: c.primary,
  },
  line: {
    height: 2,
    width: spacing[12],
    backgroundColor: c.stroke,
    marginTop: spacing[4],
  },
  lineActive: {
    backgroundColor: c.primary,
  },
});
