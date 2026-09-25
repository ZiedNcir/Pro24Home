import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@theme';
import { fontPixel, horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import Text from '@shared/ui/typography/Text';
import { Spinner } from '@shared/ui/overlay/AppSpinner';
import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';

type RootStackParamList = {
  RegisterScreen: { role: 'client' | 'professional' };
  SignIn: { role: 'client' };
  AccountType: undefined;
};

type TutorialStep = {
  titleKey: 'describeTitle' | 'matchTitle' | 'completeTitle';
  descriptionKey: 'describeDescription' | 'matchDescription' | 'completeDescription';
  image: ReturnType<typeof require>;
  actionLabelKey: 'next' | 'start';
};

const tutorialSteps: TutorialStep[] = [
  {
    titleKey: 'describeTitle',
    descriptionKey: 'describeDescription',
    image: require('@assets/images/onboarding-hero-v2.png'),
    actionLabelKey: 'next',
  },
  {
    titleKey: 'matchTitle',
    descriptionKey: 'matchDescription',
    image: require('@assets/images/onboarding-match.png'),
    actionLabelKey: 'next',
  },
  {
    titleKey: 'completeTitle',
    descriptionKey: 'completeDescription',
    image: require('@assets/images/onboarding-complete.png'),
    actionLabelKey: 'start',
  },
];

const Welcome: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const activeStep = tutorialSteps[currentStep]!;
  const activeTitle = t(`auth.welcome.${activeStep.titleKey}`);
  const activeDescription = t(`auth.welcome.${activeStep.descriptionKey}`);
  const activeActionLabel = t(`auth.welcome.${activeStep.actionLabelKey}`);

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);

    const transition = Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]);

    transition.start();

    return () => transition.stop();
  }, [currentStep, fadeAnim, slideAnim]);

  const handleStart = async () => {
    navigation.navigate('SignIn', { role: 'client' });
  };

  const handlePrimaryAction = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(previousStep => previousStep + 1);
      return;
    }

    await handleStart();
  };

  return (
    <ScreenContainer
      scrollable
      paddingHorizontal={0}
      paddingVertical={0}
      withTopSafeArea={false}
    >
      <Page>
        <TopBar paddingTop={Math.max(insets.top, verticalScale(16))}>
          <BrandLogo />
          <SkipButton
            onPress={() => navigation.navigate('SignIn', { role: 'client' })}
            accessibilityRole="button"
            accessibilityLabel={t('auth.welcome.skip')}
          >
            <SkipLabel>{t('auth.welcome.skip')}</SkipLabel>
          </SkipButton>
        </TopBar>

        <MainContent>
          <AnimatedStepContent
            testID="tutorial-step-content"
            style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
          >
            <Eyebrow>{t('auth.welcome.step', { current: currentStep + 1, total: tutorialSteps.length })}</Eyebrow>
            <HeroFrame>
              <HeroImage
                testID="tutorial-hero-image"
                source={activeStep.image}
                resizeMode="cover"
                accessible
                accessibilityLabel={t('auth.welcome.illustration', { title: activeTitle })}
              />
            </HeroFrame>

            <BottomContent paddingBottom={Math.max(insets.bottom + verticalScale(8), verticalScale(18))}>
              <Title>{activeTitle}</Title>
              <Description>{activeDescription}</Description>

              <PrimaryAction
                testID="tutorial-primary-action"
                onPress={handlePrimaryAction}
                activeOpacity={0.88}
                accessibilityRole="button"
                accessibilityLabel={activeActionLabel}
              >
                <ActionLabel>{activeActionLabel}</ActionLabel>
              </PrimaryAction>

              <ProgressRow
                testID="tutorial-progress"
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel={t('auth.welcome.step', { current: currentStep + 1, total: tutorialSteps.length })}
                accessibilityValue={{
                  min: 1,
                  max: 3,
                  now: currentStep + 1,
                  text: t('auth.welcome.step', { current: currentStep + 1, total: tutorialSteps.length }),
                }}
              >
                {tutorialSteps.map((step, index) => (
                  <ProgressDot
                    key={step.titleKey}
                    testID={`tutorial-progress-dot-${index + 1}`}
                    active={index === currentStep}
                    accessible
                    accessibilityState={{ selected: index === currentStep }}
                  />
                ))}
              </ProgressRow>

              <LoginButton
                onPress={() => navigation.navigate('SignIn', { role: 'client' })}
                accessibilityRole="button"
                accessibilityLabel={t('auth.welcome.login')}
                hitSlop={8}
              >
                <LoginHint>{t('auth.welcome.loginPrompt')} <LoginLink>{t('auth.welcome.login')}</LoginLink></LoginHint>
              </LoginButton>
            </BottomContent>
          </AnimatedStepContent>
        </MainContent>

        <Spinner
          visible={loading}
          onRequestClose={() => setLoading(false)}
          animationType="rotate"
          color={colors.primary}
          message={t('common.status.loading')}
        />
      </Page>
    </ScreenContainer>
  );
};

const Page = styled.View`
  flex: 1;
  min-height: 100%;
  background-color: #fbfcfe;
`;

const TopBar = styled.View<{ paddingTop: number }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ paddingTop }) => paddingTop}px;
  padding-horizontal: ${horizontalScale(24)}px;
  padding-bottom: ${verticalScale(12)}px;
`;

const BrandLogo = styled(LogoMediumPro24Icon)`
  width: ${horizontalScale(170)}px;
  height: ${verticalScale(42)}px;
`;

const SkipButton = styled.TouchableOpacity`
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding-vertical: ${verticalScale(8)}px;
  padding-horizontal: ${horizontalScale(6)}px;
`;

const SkipLabel = styled(Text)`
  color: #60738f;
  font-family: 'Inter-Medium';
  font-size: ${fontPixel(13)}px;
`;

const MainContent = styled.View`
  flex: 1;
  padding-horizontal: ${horizontalScale(20)}px;
`;

const AnimatedStepContent = styled(Animated.View)`
  flex: 1;
`;

const Eyebrow = styled(Text)`
  color: #60738f;
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(10)}px;
  letter-spacing: 1.1px;
  margin-top: ${verticalScale(4)}px;
  margin-bottom: ${verticalScale(10)}px;
  text-align: center;
`;

const HeroFrame = styled.View`
  width: 100%;
  height: ${verticalScale(320)}px;
  overflow: hidden;
  border-radius: ${moderateScale(28)}px;
  background-color: #eaf3fb;
  shadow-color: #163e70;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.12;
  shadow-radius: 18px;
  elevation: 5;
`;

const HeroImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const BottomContent = styled.View<{ paddingBottom: number }>`
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: ${({ paddingBottom }) => paddingBottom}px;
  padding-top: ${verticalScale(16)}px;
`;

const Title = styled(Text)`
  color: #123d79;
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(28)}px;
  line-height: ${fontPixel(34)}px;
  text-align: center;
`;

const Description = styled(Text)`
  max-width: ${horizontalScale(330)}px;
  color: #60738f;
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(15)}px;
  line-height: ${fontPixel(21)}px;
  text-align: center;
  margin-top: ${verticalScale(10)}px;
  margin-bottom: ${verticalScale(18)}px;
`;

const PrimaryAction = styled.TouchableOpacity`
  width: 100%;
  min-height: ${verticalScale(56)}px;
  align-items: center;
  justify-content: center;
  background-color: #c75100;
  border-radius: ${moderateScale(16)}px;
  shadow-color: #c75100;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.22;
  shadow-radius: 12px;
  elevation: 4;
`;

const ActionLabel = styled(Text)`
  color: #ffffff;
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(16)}px;
`;

const ProgressRow = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(8)}px;
  margin-top: ${verticalScale(16)}px;
  margin-bottom: ${verticalScale(12)}px;
`;

const ProgressDot = styled.View<{ active?: boolean }>`
  width: ${({ active }) => horizontalScale(active ? 20 : 7)}px;
  height: ${verticalScale(7)}px;
  border-radius: ${moderateScale(8)}px;
  background-color: ${({ active }) => (active ? '#f47b20' : '#c6d8ed')};
`;

const LoginHint = styled(Text)`
  color: #60738f;
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(12)}px;
  text-align: center;
`;

const LoginButton = styled(Pressable)`
  min-height: 44px;
  align-items: center;
  justify-content: center;
`;

const LoginLink = styled(Text)`
  color: #123d79;
  font-family: 'Inter-Bold';
`;

export default Welcome;
