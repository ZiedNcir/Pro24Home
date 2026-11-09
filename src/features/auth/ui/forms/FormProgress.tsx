import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@shared/ui/typography/Text';
import { useTheme } from '@theme';

interface Props { labels: string[]; step: number; testID: string; counter: string }
export default function FormProgress({ labels, step, testID, counter }: Props) {
    const { theme: { colors } } = useTheme();
    const percent = Math.round((step + 1) / labels.length * 100);
    return <View style={styles.section}>
        <View style={styles.labels}>
            {labels.map((label, index) => <React.Fragment key={label}>
                {index > 0 ? <View style={[styles.separator, { backgroundColor: colors.borderDark }]} /> : null}
                <Text variant={index === step ? 'bold' : 'regular'} fontSize={14} lineHeight={20} style={styles.label} color={index === step ? colors.primary : colors.textSecondary}>{label}</Text>
            </React.Fragment>)}
        </View>
        <View testID={`${testID}-step`} accessible accessibilityRole="progressbar" accessibilityLabel={counter}
            accessibilityValue={{ min: 1, max: labels.length, now: step + 1, text: counter }} style={styles.progressRow}>
            <View testID={`${testID}-progress`} style={[styles.track, { backgroundColor: colors.border }]}>
                <View style={[styles.fill, { width: `${percent}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text variant="regularSmall" fontSize={14} color={colors.textSecondary}>{percent} %</Text>
        </View>
    </View>;
}
const styles = StyleSheet.create({
    section: { width: '100%', marginBottom: 28 },
    labels: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginBottom: 14 },
    label: { flexShrink: 1 },
    separator: { width: 12, height: 1 },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    track: { flex: 1, height: 8, borderRadius: 5, overflow: 'hidden' },
    fill: { height: '100%', borderRadius: 5 },
});
