import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@theme/index';
import { fontPixel, horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import Text from '@components/Text';
import { Spinner } from '@components/Modal/AppSpinner';
import { ScreenContainer } from '@components/index';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';

type RootStackParamList = {
  RegisterScreen: { role: 'client' | 'professional' };
  SignIn: { role: 'client' };
};

type TutorialStep = {
  title: string;
  description: string;
  image: ReturnType<typeof require>;
  actionLabel: string;
};

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Décrivez votre besoin',
    description: "Expliquez-nous ce qu'il faut réparer ou améliorer chez vous.",
    image: require('@assets/images/onboarding-hero-v2.png'),
    actionLabel: 'Suivant',
  },
  {
    title: 'PRO24HOME choisit votre expert',
    description: 'Nous vous attribuons automatiquement le professionnel le plus adapté à votre besoin et à votre localisation.',
    image: require('@assets/images/onboarding-match.png'),
    actionLabel: 'Suivant',
  },
  {
    title: 'Votre intervention est prise en charge',
    description: "Recevez la confirmation et avancez sereinement jusqu'à la fin de l'intervention.",
    image: require('@assets/images/onboarding-complete.png'),
    actionLabel: 'Commencer',
  },
];

const Welcome: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const activeStep = tutorialSteps[currentStep];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 650, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleStart = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 350));
    setLoading(false);
    navigation.navigate('RegisterScreen', { role: 'client' });
  };

  const handlePrimaryAction = async () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(previousStep => previousStep + 1);
      return;
    }

    await handleStart();
  };

  return (
    <ScreenContainer mode="light" scrollable paddingHorizontal={0} paddingVertical={0}>
      <Page>
        <TopBar paddingTop={Math.max(insets.top, verticalScale(16))}>
          <BrandLogo />
          <SkipButton
            onPress={() => navigation.navigate('RegisterScreen', { role: 'client' })}
            accessibilityRole="button"
          >
            <SkipLabel>Passer</SkipLabel>
          </SkipButton>
        </TopBar>

        <MainContent>
          <Eyebrow>{`ÉTAPE ${currentStep + 1} SUR 3`}</Eyebrow>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <HeroFrame>
              <HeroImage source={activeStep.image} resizeMode="cover" />
            </HeroFrame>
          </Animated.View>

          <BottomContent paddingBottom={Math.max(insets.bottom + verticalScale(8), verticalScale(18))}>
            <Title>{activeStep.title}</Title>
            <Description>{activeStep.description}</Description>

            <PrimaryAction onPress={handlePrimaryAction} activeOpacity={0.88}>
              <ActionLabel>{activeStep.actionLabel}</ActionLabel>
            </PrimaryAction>

            <ProgressRow accessibilityLabel={`Étape ${currentStep + 1} sur 3`}>
              {tutorialSteps.map((step, index) => (
                <ProgressDot key={step.title} active={index === currentStep} />
              ))}
            </ProgressRow>

            <Pressable
              onPress={() => navigation.navigate('SignIn', { role: 'client' })}
              accessibilityRole="button"
              accessibilityLabel="Se connecter"
              hitSlop={8}
            >
              <LoginHint>Vous avez déjà un compte ? <LoginLink>Se connecter</LoginLink></LoginHint>
            </Pressable>
          </BottomContent>
        </MainContent>

        <Spinner
          visible={loading}
          onRequestClose={() => setLoading(false)}
          animationType="rotate"
          color={colors.primary}
          message="Chargement..."
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

const Eyebrow = styled(Text)`
  color: #7890ac;
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
  background-color: #f47b20;
  border-radius: ${moderateScale(16)}px;
  shadow-color: #f47b20;
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
  color: #8291a5;
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(12)}px;
  text-align: center;
`;

const LoginLink = styled(Text)`
  color: #123d79;
  font-family: 'Inter-Bold';
`;

export default Welcome;
