import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText, colors, radius, spacing, vSpacing } from '../../../../design-system';

export interface AuthStepProgressProps {
  current: 1 | 2 | 3;
  labels: [string, string, string];
}

export const AuthStepProgress: React.FC<AuthStepProgressProps> = ({ current, labels }) => (
  <View style={styles.container}>
    {[1, 2, 3].map((step, index) => {
      const active = step <= current;
      const done = step < current;

      return (
        <React.Fragment key={step}>
          <View style={styles.step}>
            <View style={[styles.circle, active && styles.circleActive]}>
              <AppText variant="label" color={active ? colors.white : colors.textMuted} align="center">
                {done ? '✓' : String(step)}
              </AppText>
            </View>
            <AppText variant="caption" color={active ? colors.text : colors.textMuted} align="center">
              {labels[index]}
            </AppText>
          </View>
          {step < 3 ? <View style={[styles.line, active && styles.lineActive]} /> : null}
        </React.Fragment>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
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
    borderColor: colors.stroke,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  circleActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[600],
  },
  line: {
    height: 2,
    width: spacing[12],
    backgroundColor: colors.stroke,
    marginTop: spacing[4],
  },
  lineActive: {
    backgroundColor: colors.primary[600],
  },
});
