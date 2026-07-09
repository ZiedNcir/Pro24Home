import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  AppText,
  Button,
  SlidePagination,
  colors,
  sizes,
  vSpacing,
} from '../../../../design-system';

import ScreenContainer from '@components/ScreenContainer';
import { WelcomeIllustrations } from '../../../../assets/illustrations/welcome';
import { t } from '../../../../translations/i18n';
import { useAppDispatch } from '../../../../store/hooks';
import { completeOnboarding } from '../../../../store/slices/authSlice';
import { CLIENT_AUTH_ROUTES } from '../constants';

type Props = NativeStackScreenProps<any>;

const slides = [
  {
    key: 'familyHome',
    image: WelcomeIllustrations.SlideFamilyHome,
    titleKey: 'module1.welcome.slide1Title',
    subtitleKey: 'module1.welcome.slide1Subtitle',
  },
  {
    key: 'services',
    image: WelcomeIllustrations.SlideServices,
    titleKey: 'module1.welcome.slide2Title',
    subtitleKey: 'module1.welcome.slide2Subtitle',
  },
  {
    key: 'nearbyProfessional',
    image: WelcomeIllustrations.SlideNearbyProfessional,
    titleKey: 'module1.welcome.slide3Title',
    subtitleKey: 'module1.welcome.slide3Subtitle',
  },
];

export const C01ClientWelcome: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [current, setCurrent] = useState(0);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.[0]?.index !== undefined) {
      setCurrent(viewableItems[0].index);
    }
  }).current;

  const completeAndNavigate = (routeName: string) => {
    dispatch(completeOnboarding());
    navigation.navigate(routeName as never);
  };

  return (
    <ScreenContainer
      paddingHorizontal={0}
      paddingVertical={0}
      withTopSafeArea={false}
      imageResizeMode="cover"
      useImageBackground
      backgroundImage={WelcomeIllustrations.Background}
    >
      <View style={styles.container}>
        {slides.map((item, index) => (
          <View key={item.key} style={{ display: index === current ? 'flex' : 'none' }}>
            <AppText variant="h1" align="center" color={colors.text}>
              {t(item.titleKey)}
            </AppText>

            <AppText variant="bodyLarge" align="center" color={colors.textMuted}>
              {t(item.subtitleKey)}
            </AppText>
          </View>
        ))}
      </View>

      <FlatList
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} resizeMode="cover" style={styles.illustration} />
          </View>
        )}
      />

      <View style={styles.bottom}>
        <SlidePagination total={slides.length} current={current} />

        <Button
          title={t('module1.welcome.createAccount')}
          variant="primary"
          leftIcon="plus"
          onPress={() => completeAndNavigate(CLIENT_AUTH_ROUTES.accountType)}
        />

        <Button
          title={t('module1.welcome.login')}
          variant="outline"
          leftIcon="user"
          onPress={() => completeAndNavigate(CLIENT_AUTH_ROUTES.login)}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: vSpacing[10],
    marginTop: vSpacing[12],
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vSpacing[10],
  },
  illustration: {
    width: '100%',
    height: '100%',
  },
  bottom: {
    gap: vSpacing[2],
    paddingBottom: vSpacing[4],
    paddingHorizontal: sizes.screen.horizontalPadding,
  },
});
