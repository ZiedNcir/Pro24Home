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
  radius,
  sizes,
  vSpacing,
} from '../../../../design-system';

import { WelcomeIllustrations } from '../../../../assets/illustrations/welcome';
import { t } from '../../../../translations/i18n';
import { CLIENT_AUTH_ROUTES } from '../constants';
import ScreenContainer from '@components/ScreenContainer';


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
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [current, setCurrent] = useState(0);

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.[0]?.index !== undefined) {
      setCurrent(viewableItems[0].index);
    }
  }).current;

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
        ))
        }

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
          onPress={() => navigation.navigate(CLIENT_AUTH_ROUTES.accountType as never)}
        />
        <Button
          title={t('module1.welcome.login')}
          variant="outline"
          leftIcon="user"
          onPress={() =>
            navigation.navigate(CLIENT_AUTH_ROUTES.login as never)
          }
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: vSpacing[10],
    marginTop: vSpacing[12]
  },
  c: {
    alignItems: 'center',
    marginTop: vSpacing[2],
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vSpacing[10],
  },
  illustration: {
    width: '90%',
    height: '100%',
    borderRadius: radius['2xl'],
    marginBottom: vSpacing[4],
    borderWidth: 2,
    borderColor: colors.primary['400'],
  },
  text: {
  },
  bottom: {
    gap: vSpacing[2],
    paddingBottom: vSpacing[4],
    paddingHorizontal: sizes.screen.horizontalPadding,
  },
});
