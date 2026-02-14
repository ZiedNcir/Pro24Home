import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { fontPixel, horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
//import { appNavigate } from '../../navigations/navigation';
import Text from '@components/Text';
import { PrimaryButton, OutlineButton, GhostButton } from '@components/Button/Button';
import SvgIcon from '@components/Icon/SvgIcon';
import { Spinner } from '@components/Modal/AppSpinner';
import { colors } from '@theme/index';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface WelcomeProps {
    // Optional props for customization
    showAnimation?: boolean;
}

const Welcome: React.FC<WelcomeProps> = ({ }) => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleClientPress = async () => {
        setLoading(true);
        // Simulate API call or check
        await new Promise(resolve => setTimeout(resolve, 500));
        setLoading(false);
        ///appNavigate('SignIn', { role: 'client' });
    };

    const handleProfessionalSignUp = () => {
        navigation.navigate('RegisterScreen', { role: 'professional' });
    };

    const handleProfessionalSignIn = () => {
        //appNavigate('SignIn', { role: 'professional' });
    };

    return (
        <SafeAreaView>
            <Container>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Content>
                        <CardContainer>
                            <GlassCard>
                                <WelcomeImage
                                    source={require('@assets/images/welcome_img.png')}
                                    resizeMode="center"
                                />
                                <TitleContainer>
                                    <Title variant="regularSmall" color={colors.primary}>
                                        {t('terms.welcome')}
                                    </Title>
                                </TitleContainer>

                                <Description variant="regular" color={colors.black}>
                                    Trouvez votre dépanneur près de chez vous{' '}
                                    <Text variant="medium" color={colors.primary}>
                                        en quelques minutes
                                    </Text>
                                </Description>

                                <Section>
                                    <SectionTitle variant="medium" color={colors.black}>
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

                                <Section>
                                    <Divider>
                                        <DividerLine />
                                        <DividerText variant="notification" color={colors.gray600}>
                                            Professionnels
                                        </DividerText>
                                        <DividerLine />
                                    </Divider>

                                    <HelperText variant="notification" color={colors.black}>
                                        Vous êtes un professionnel ?{'\n'} Rejoigner-nous !
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

                                <Footer>
                                    <SecurityInfo>
                                        <SvgIcon name="fa-shield" size={16} color={colors.success} />
                                        <Text variant="notification" color={colors.black} style={{ marginLeft: 8 }}>
                                            🔐 Sécurité & Confidentialité garanties
                                        </Text>
                                    </SecurityInfo>
                                    <Copyright variant="notification" color={colors.gray600}>
                                        © 2024 Pro24. Tous droits réservés.
                                    </Copyright>
                                </Footer>
                            </GlassCard>
                        </CardContainer>
                    </Content>
                </ScrollView>
            </Container>

            <Spinner
                visible={loading}
                onRequestClose={() => setLoading(false)}
                animationType="rotate"
                color={colors.primary}
                message="Chargement..."
            />
        </SafeAreaView>
    );
};

// Styled Components
const Container = styled.View`
  background-color: ${colors.background};
`;


const Content = styled.View`
  flex: 1;
`;



const WelcomeImage = styled.Image`
  width: ${SCREEN_WIDTH * 0.55}px;
  height: ${SCREEN_HEIGHT * 0.27}px;
  align-self: center;
  margin-bottom: ${verticalScale(6)}px;
`;



const CardContainer = styled.View`
  flex: 1;
  padding-horizontal: ${horizontalScale(10)}px;
  margin-top: ${verticalScale(5)}px;
  margin-bottom: ${verticalScale(15)}px;
`;

const GlassCard = styled.View`
  width: 100%;
  border-radius: ${moderateScale(26)}px;
  padding-horizontal: ${horizontalScale(26)}px;
  padding-top: ${verticalScale(15)}px;
  padding-bottom: ${verticalScale(15)}px;
  background-color: rgba(255, 255, 255, 0.92);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.75);
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(8)}px;
  shadow-opacity: 0.12;
  shadow-radius: ${moderateScale(18)}px;
`;


const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: ${verticalScale(16)}px;
`;

const Title = styled(Text)`
  text-align: center;
  font-size: ${fontPixel(26)}px;
  line-height: ${fontPixel(38)}px;
  font-weight: 800;
`;



const Description = styled(Text)`
  text-align: center;
  opacity: 0.9;
  margin-bottom: ${verticalScale(12)}px;
  line-height: ${fontPixel(24)}px;
  font-size: ${fontPixel(16)}px;
  padding-horizontal: ${horizontalScale(8)}px;
`;


const Section = styled.View`
  margin-bottom: ${verticalScale(10)}px;
`;

const SectionTitle = styled(Text)`
  text-align: center;
  margin-bottom: ${verticalScale(12)}px;
  font-size: ${fontPixel(18)}px;
  font-weight: 600;
`;

const Divider = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: ${verticalScale(12)}px;
`;

const DividerLine = styled.View`
  flex: 1;
  height: 1px;
  background-color: ${colors.gray300};
  opacity: 0.35;
`;

const DividerText = styled(Text)`
  margin-horizontal: ${horizontalScale(12)}px;
  font-size: ${fontPixel(14)}px;
`;

const HelperText = styled(Text)`
  text-align: center;
  margin-bottom: ${verticalScale(12)}px;
  opacity: 0.85;
  font-size: ${fontPixel(14)}px;
  line-height: ${fontPixel(18)}px;
`;

const ButtonGroup = styled.View`
  gap: ${verticalScale(12)}px;
`;


const Footer = styled.View`
  margin-top: ${verticalScale(5)}px;
  align-items: center;
`;

const SecurityInfo = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const Copyright = styled(Text)`
  text-align: center;
  font-size: ${fontPixel(12)}px;
  opacity: 0.7;
`;



const styles = {
    background: {
        flex: 1,
        width: '100%',
        height: '100%',


    },
    scrollContent: {
        flexGrow: 1,
    },

    proButton: {
        borderWidth: 2,
    },
};

export default Welcome;

