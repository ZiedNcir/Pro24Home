import React, { useRef } from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  AppText,
  Icon,
  colors,
  radius,
  shadows,
  spacing,
  vSpacing,
} from '../../../../design-system';

export interface AccountTypeCardProps {
  title: string;
  subtitle: string;
  image: ImageSourcePropType;
  accent?: 'orange' | 'green';
  onPress: () => void;
}

export const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
  title,
  subtitle,
  image,
  accent = 'orange',
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const accentColor = accent === 'green' ? colors.success : colors.primary[600];

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.975,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }], width: '49%' }}>
      <TouchableOpacity onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} style={{ flex: 1 }}>
        <View style={[styles.card, { borderColor: accentColor }]}>
          <Image source={image} resizeMode="contain" style={styles.image} />

          <View style={styles.content}>
            <AppText variant="h3" align="center" color={colors.text}>
              {title}
            </AppText>

            <AppText variant="body" align="center" color={colors.textMuted}>
              {subtitle}
            </AppText>

            <View style={[styles.action, { backgroundColor: accentColor }]}>
              <Icon name="arrowRight" size="sm" color={colors.white} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius['2xl'],
    backgroundColor: colors.white,
    overflow: 'hidden',
    ...shadows.sm,
  },
  image: {
    width: '100%',
    height: 185,
  },
  content: {
    paddingHorizontal: spacing[4],
    paddingBottom: vSpacing[4],
    gap: vSpacing[2],
    alignItems: 'center',
  },
  action: {
    width: spacing[10],
    height: spacing[10],
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vSpacing[1],
  },
});
