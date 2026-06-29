import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Pressable } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';

import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@utils/normalizedCss';

import Text from '@components/Text';
import { Spinner } from '@components/Modal/AppSpinner';
import { colors } from '@theme/index';
import { ScreenContainer, SvgIcon } from '@components/index';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const Welcome: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(26)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleClientPress = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 350));
    setLoading(false);
    navigation.navigate('ClientRegister' as never, { role: 'client' } as never);
  };

  const handleProfessionalPress = () => {
    navigation.navigate('ClientRegister' as never, { role: 'professional' } as never);
  };

  const handleCreateAccount = () => {
    navigation.navigate('ClientRegister' as never);
  };

  return (
    <ScreenContainer
      mode="light"
      scrollable={false}
      paddingHorizontal={0}
      paddingVertical={0}
      withTopSafeArea={false}
    >
      <Container>
        <HeroImage
          source={require('@assets/images/background2.png')}
          resizeMode="cover"
        />


        <Content
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <Header>
            <LogoBox>
              <LogoRow>
                <LogoImage
                  source={require('@assets/images/logo-Pro24.png')}
                  resizeMode="cover"
                />
              </LogoRow>
            </LogoBox>
            <Title>

              <Text
                variant="title"
                color={colors.white}
                fontSize={36}
                lineHeight={44}
                fontWeight="900"
              >
                Bienvenue !
              </Text>

              <Text
                variant="medium"
                color={colors.gray50}
                fontSize={19}
                lineHeight={26}
              >
                Connectez-vous pour continuer
              </Text>
            </Title>
          </Header>

          <BottomSheet>
            <RoleCard active onPress={handleClientPress}>
              <IconCircle active>
                <SvgIcon name="fa-user" size={moderateScale(24)} color="#FFFFFF" />
              </IconCircle>

              <RoleContent>
                <Text
                  variant="bold"
                  color={colors.black}
                  fontSize={20}
                  lineHeight={26}
                  fontWeight="900"
                >
                  Je suis un client
                </Text>

                <Text
                  variant="medium"
                  color={colors.gray600}
                  fontSize={16}
                  lineHeight={23}
                >
                  Je cherche un professionnel
                </Text>
              </RoleContent>

              <SvgIcon
                name="fa-chevron-right"
                size={moderateScale(20)}
                color={colors.primary}
              />
            </RoleCard>

            <RoleCard onPress={handleProfessionalPress}>
              <IconCircle>
                <SvgIcon
                  name="fa-chevron-right"
                  size={moderateScale(23)}
                  color={colors.gray800}
                />
              </IconCircle>

              <RoleContent>
                <Text
                  variant="bold"
                  color={colors.black}
                  fontSize={20}
                  lineHeight={26}
                  fontWeight="900"
                >
                  Je suis un professionnel
                </Text>

                <Text
                  variant="medium"
                  color={colors.gray600}
                  fontSize={16}
                  lineHeight={23}
                >
                  Je propose mes services
                </Text>
              </RoleContent>

              <SvgIcon
                name="fa-chevron-right"
                size={moderateScale(20)}
                color={colors.gray700}
              />
            </RoleCard>

            <RegisterRow>
              <Text variant="medium" color="gray700" fontSize={16}>
                Pas encore de compte ?{' '}
              </Text>

              <Pressable onPress={handleCreateAccount}>
                <Text
                  variant="bold"
                  color={colors.primary}
                  fontSize={16}
                  fontWeight="700"
                >
                  Créer un compte
                </Text>
              </Pressable>
            </RegisterRow>

            <Divider />

            <BenefitsRow>
              <BenefitItem>
                <SvgIcon
                  name="fa-shield-alt"
                  size={moderateScale(25)}
                  color={colors.primary}
                />
                <BenefitTextBox>
                  <Text
                    variant="bold"
                    color={colors.black}
                    fontSize={13}
                    lineHeight={18}
                    fontWeight="900"
                  >
                    Sécurité
                  </Text>
                  <Text
                    variant="regularSmall"
                    color={colors.gray700}
                    fontSize={12}
                    lineHeight={17}
                  >
                    Paiement sécurisé et garanti
                  </Text>
                </BenefitTextBox>
              </BenefitItem>

              <BenefitSeparator />

              <BenefitItem>
                <SvgIcon
                  name="fa-clock"
                  size={moderateScale(25)}
                  color={colors.primary}
                />
                <BenefitTextBox>
                  <Text
                    variant="bold"
                    color={colors.black}
                    fontSize={13}
                    lineHeight={18}
                    fontWeight="900"
                  >
                    Rapidité
                  </Text>
                  <Text
                    variant="regularSmall"
                    color={colors.gray700}
                    fontSize={12}
                    lineHeight={17}
                  >
                    Intervention rapide en 15 min
                  </Text>
                </BenefitTextBox>
              </BenefitItem>

              <BenefitSeparator />

              <BenefitItem>
                <SvgIcon
                  name="fa-award"
                  size={moderateScale(25)}
                  color={colors.primary}
                />
                <BenefitTextBox>
                  <Text
                    variant="bold"
                    color={colors.black}
                    fontSize={13}
                    lineHeight={18}
                    fontWeight="900"
                  >
                    Qualité
                  </Text>
                  <Text
                    variant="regularSmall"
                    color={colors.gray700}
                    fontSize={12}
                    lineHeight={17}
                  >
                    Professionnels vérifiés et notés
                  </Text>
                </BenefitTextBox>
              </BenefitItem>
            </BenefitsRow>
          </BottomSheet>
        </Content>

        <Spinner
          visible={loading}
          onRequestClose={() => setLoading(false)}
          animationType="rotate"
          color={colors.primary}
          message="Chargement..."
        />
      </Container>
    </ScreenContainer>
  );
};

const Container = styled.View`
  flex: 1;
  background-color: ${colors.white};
`;

const HeroImage = styled.Image`
  position: absolute;
  top: 0;
  left: 0;
  width: ${SCREEN_WIDTH}px;
  height: ${SCREEN_HEIGHT * 0.68}px;
  margin-bottom: ${verticalScale(30)}px;
`;
const LogoImage = styled.Image`
  position: absolute;
  top:0;
  width: ${SCREEN_WIDTH * 0.3}px;
 height: ${verticalScale(180)}px;

`;
const Title = styled.View`
  padding-top: ${verticalScale(110)}px;
`;

const Content = styled(Animated.View)`
  flex: 1;
`;

const Header = styled.View`
  padding-top: ${verticalScale(20)}px;
  padding-horizontal: ${horizontalScale(24)}px;
`;

const LogoBox = styled.View`
  margin-bottom: ${verticalScale(30)}px;
`;

const LogoRow = styled.View`
  flex-direction: row;
  align-items: center;
`;



const BottomSheet = styled.View`
  position: absolute;
  left: ${horizontalScale(22)}px;
  right: ${horizontalScale(22)}px;
  bottom: ${verticalScale(26)}px;
`;

const RoleCard = styled.Pressable<{ active?: boolean }>`
  width: 100%;
  min-height: ${verticalScale(108)}px;
  border-radius: ${moderateScale(24)}px;
  padding-horizontal: ${horizontalScale(18)}px;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.97);
  border-width: ${({ active }) => (active ? 1.8 : 1)}px;
  border-color: ${({ active }) => (active ? colors.primary : colors.gray300)};
  margin-bottom: ${verticalScale(15)}px;
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(7)}px;
  shadow-opacity: 0.08;
  shadow-radius: ${moderateScale(16)}px;
  elevation: 5;
`;

const IconCircle = styled.View<{ active?: boolean }>`
  width: ${moderateScale(64)}px;
  height: ${moderateScale(64)}px;
  border-radius: ${moderateScale(32)}px;
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(17)}px;
  background-color: ${({ active }) =>
    active ? colors.primary : colors.gray200};
`;

const RoleContent = styled.View`
  flex: 1;
`;

const RegisterRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: ${verticalScale(14)}px;
  margin-bottom: ${verticalScale(38)}px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: ${colors.gray300};
  margin-bottom: ${verticalScale(22)}px;
`;

const BenefitsRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  padding-bottom: ${verticalScale(4)}px;
`;

const BenefitItem = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: flex-start;
`;

const BenefitTextBox = styled.View`
  flex: 1;
  margin-left: ${horizontalScale(8)}px;
`;

const BenefitSeparator = styled.View`
  width: 1px;
  height: ${verticalScale(58)}px;
  background-color: ${colors.gray300};
  margin-horizontal: ${horizontalScale(7)}px;
`;

export default Welcome;