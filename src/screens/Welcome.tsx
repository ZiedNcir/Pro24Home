import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions } from 'react-native';
import styled from 'styled-components/native';
import {
  fontPixel,
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@utils/normalizedCss';
import Text from '@components/Text';
import { PrimaryButton, OutlineButton, GhostButton } from '@components/Button/Button';
import { Spinner } from '@components/Modal/AppSpinner';
import { colors } from '@theme/index';
import { useNavigation, NavigationProp } from '@react-navigation/core';
import { ScreenContainer } from '@components/index';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  VerifyScreen: { role: 'client' };
  RegisterScreen: { role: 'client' | 'professional' };
  SignIn: { role: 'client' };
};

interface WelcomeProps {
  showAnimation?: boolean;
}

const Welcome: React.FC<WelcomeProps> = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(false);

  const handleClientPress = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setLoading(false);
    navigation.navigate('RegisterScreen', { role: 'client' });
  };

  const handleProfessionalSignUp = () => {
    navigation.navigate('RegisterScreen', { role: 'professional' });
  };

  const handleProfessionalSignIn = () => {
    navigation.navigate('SignIn', { role: 'client' });
  };

  return (
    <ScreenContainer
      mode="light"
      scrollable
      paddingHorizontal={0}
      paddingVertical={0}
      backgroundImage={require('@assets/images/background_ligth.png')}
      useImageBackground
      imageResizeMode="cover"
    >
      <Container>
        <ContentWrapper>
          <CardContainer>
            <Card>
              <WelcomeImage
                source={require('@assets/images/welcome_img.png')}
                resizeMode="contain"
              />

              <TitleContainer>
                <Title color={colors.primary}>
                  {t('terms.welcome') || 'Welcome To Pro24Home'}
                </Title>
              </TitleContainer>

              <Description color={colors.black}>
                Trouvez votre dépanneur près de chez vous{' '}
                <Text variant="medium" color={colors.primary}>
                  en quelques minutes
                </Text>
              </Description>

              <Section>
                <SectionTitle color={colors.black}>
                  Je suis un Client
                </SectionTitle>

                <PrimaryButton
                  title="Dépanner moi"
                  onPress={handleClientPress}
                  fullWidth
                  rounded
                  size="large"
                  leftIcon="fa-user"
                  loading={loading}
                  loadingText="Chargement..."
                />
              </Section>

              <Divider>
                <DividerLine />
                <DividerText variant="notification" color={colors.gray600}>
                  Professionnels
                </DividerText>
                <DividerLine />
              </Divider>

              <Section>
                <HelperText color={colors.black}>
                  Vous êtes un professionnel ?{'\n'}Rejoignez-nous !
                </HelperText>

                <ButtonGroup>
                  <OutlineButton
                    title="Devenir Pro24"
                    onPress={handleProfessionalSignUp}
                    fullWidth
                    rounded
                    size="large"
                    style={styles.proButton}
                  />

                  <GhostButton
                    title="Se Connecter"
                    onPress={handleProfessionalSignIn}
                    fullWidth
                    rounded
                    size="large"
                  />
                </ButtonGroup>
              </Section>
            </Card>
          </CardContainer>
        </ContentWrapper>

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
`;

const ContentWrapper = styled.View`
  flex: 1;
  justify-content: center;
  padding-top: ${verticalScale(24)}px;
`;

const CardContainer = styled.View`
  padding-horizontal: ${horizontalScale(18)}px;
`;

const Card = styled.View`
  width: 100%;
  max-width: ${SCREEN_WIDTH - horizontalScale(36)}px;
  align-self: center;
  border-radius: ${moderateScale(30)}px;
  padding-horizontal: ${horizontalScale(24)}px;
  padding-top: ${verticalScale(24)}px;
  background-color: rgba(255, 255, 255, 0.96);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.72);
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(8)}px;
  shadow-opacity: 0.08;
  shadow-radius: ${moderateScale(18)}px;
  elevation: 6;
`;

const WelcomeImage = styled.Image`
  width: ${SCREEN_WIDTH * 0.52}px;
  height: ${verticalScale(180)}px;
  align-self: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: ${verticalScale(14)}px;
`;

const Title = styled(Text)`
  text-align: center;
  font-size: ${fontPixel(30)}px;
  line-height: ${fontPixel(38)}px;
  font-weight: 800;
`;

const Description = styled(Text)`
  text-align: center;
  margin-bottom: ${verticalScale(24)}px;
  line-height: ${fontPixel(22)}px;
  font-size: ${fontPixel(16)}px;
  padding-horizontal: ${horizontalScale(8)}px;
`;

const Section = styled.View`
  margin-bottom: ${verticalScale(18)}px;
`;

const SectionTitle = styled(Text)`
  text-align: center;
  margin-bottom: ${verticalScale(14)}px;
  font-size: ${fontPixel(18)}px;
  font-weight: 700;
`;

const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(18)}px;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${colors.gray300};
  opacity: 0.4;
`;

const DividerText = styled(Text)`
  margin-horizontal: ${horizontalScale(12)}px;
  font-size: ${fontPixel(14)}px;
`;

const HelperText = styled(Text)`
  text-align: center;
  margin-bottom: ${verticalScale(14)}px;
  font-size: ${fontPixel(14)}px;
  line-height: ${fontPixel(20)}px;
  font-weight: 600;
`;

const ButtonGroup = styled.View`
  gap: ${verticalScale(12)}px;
`;

const styles = {
  proButton: {
    borderWidth: 2,
  },
};

export default Welcome;