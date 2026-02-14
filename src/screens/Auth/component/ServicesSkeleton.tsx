import { colors } from '@theme/index';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import React from 'react';
import { Animated, View } from 'react-native';

// --- Simple skeleton blocks (no deps) ---
const SkeletonBlock = ({
    width = '100%',
    height = 16,
    radius = 10,
    style,
}: {
    width?: number | string;
    height?: number;
    radius?: number;
    style?: any;
}) => {
    const shimmer = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmer, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmer, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, [shimmer]);

    const opacity = shimmer.interpolate({
        inputRange: [0, 1],
        outputRange: [0.35, 0.85],
    });

    return (
        <Animated.View
            style={[
                {
                    width,
                    height,
                    borderRadius: radius,
                    opacity,
                    // use your palette
                    backgroundColor: colors.gray100,
                },
                style,
            ]}
        />
    );
};

const ServicesSkeleton = ({ rows = 6 }: { rows?: number }) => {
    return (
        <View style={{ paddingHorizontal: horizontalScale(12), paddingTop: verticalScale(10) }}>
            <SkeletonBlock width={'65%'} height={18} style={{ marginBottom: verticalScale(12) }} />
            {Array.from({ length: rows }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: verticalScale(12),
                    }}
                >
                    <SkeletonBlock width={22} height={22} radius={6} />
                    <SkeletonBlock
                        width={'78%'}
                        height={16}
                        style={{ marginLeft: horizontalScale(10) }}
                    />
                </View>
            ))}
        </View>
    );
};
export default ServicesSkeleton;