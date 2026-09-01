import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import styled from 'styled-components/native';
import { ScreenContainer } from '@components/index';
import Text from '@components/Text';
import LogoMediumPro24Icon from '@assets/svg/logo-mediumPro24.svg';
import { fontPixel, horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme/ThemeProvider';

type AccountNavigation = {
  RegisterScreen: { role: 'client' | 'professional' };
};

const AccountTypeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<AccountNavigation>>();
  const { theme, themeMode } = useTheme();

  return (
    <ScreenContainer mode={themeMode} scrollable paddingHorizontal={0} paddingVertical={0} withTopSafeArea>
      <Page>
        <Header>
          <BackButton onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Retour">
            <BackIcon>‹</BackIcon>
          </BackButton>
          <Logo />
        </Header>

        <Content>
          <Eyebrow>VOTRE PROJET, NOTRE EXPERTISE</Eyebrow>
          <Title>Comment souhaitez-vous utiliser PRO24HOME ?</Title>
          <Description>Choisissez votre profil pour créer le compte adapté à vos besoins.</Description>

          <RoleCard
            onPress={() => navigation.navigate('RegisterScreen', { role: 'client' })}
            accessibilityRole="button"
            accessibilityLabel="Je suis un client"
            activeOpacity={0.88}
          >
            <IconCircle background={theme.colors.surfaceVariant}><IconText color={theme.colors.primary}>⌂</IconText></IconCircle>
            <RoleCopy>
              <RoleTitle>Je suis un client</RoleTitle>
              <RoleDescription>Je cherche un professionnel pour mes travaux ou dépannages.</RoleDescription>
            </RoleCopy>
            <Arrow>›</Arrow>
          </RoleCard>

          <RoleCard
            secondary
            onPress={() => navigation.navigate('RegisterScreen', { role: 'professional' })}
            accessibilityRole="button"
            accessibilityLabel="Je suis un professionnel"
            activeOpacity={0.88}
          >
            <IconCircle background={theme.colors.surfaceVariant}><IconText color={theme.colors.success}>✓</IconText></IconCircle>
            <RoleCopy>
              <RoleTitle>Je suis un professionnel</RoleTitle>
              <RoleDescription>Je souhaite proposer mes services et rejoindre le réseau.</RoleDescription>
            </RoleCopy>
            <Arrow>›</Arrow>
          </RoleCard>

          <TrustNote>Vous pourrez modifier vos informations plus tard.</TrustNote>
        </Content>
      </Page>
    </ScreenContainer>
  );
};

const Page = styled.View`
  flex: 1;
  min-height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  position: relative;
  min-height: ${verticalScale(78)}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${horizontalScale(22)}px;
`;

const BackButton = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
`;

const BackIcon = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(34)}px;
  line-height: ${fontPixel(34)}px;
`;

const Logo = styled(LogoMediumPro24Icon)`
  position: absolute;
  left: 50%;
  margin-left: -${horizontalScale(75)}px;
  width: ${horizontalScale(150)}px;
  height: ${verticalScale(42)}px;
`;

const Content = styled.View`
  flex: 1;
  padding-horizontal: ${horizontalScale(24)}px;
  padding-top: ${verticalScale(30)}px;
`;

const Eyebrow = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(10)}px;
  letter-spacing: 1px;
  text-align: center;
  margin-bottom: ${verticalScale(13)}px;
`;

const Title = styled(Text)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(27)}px;
  line-height: ${fontPixel(34)}px;
  text-align: center;
`;

const Description = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(15)}px;
  line-height: ${fontPixel(22)}px;
  text-align: center;
  margin-top: ${verticalScale(12)}px;
  margin-bottom: ${verticalScale(28)}px;
`;

const RoleCard = styled.TouchableOpacity<{ secondary?: boolean }>`
  min-height: ${verticalScale(112)}px;
  flex-direction: row;
  align-items: center;
  padding-horizontal: ${horizontalScale(17)}px;
  margin-bottom: ${verticalScale(14)}px;
  border-radius: ${moderateScale(22)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const IconCircle = styled.View<{ background: string }>`
  width: ${horizontalScale(54)}px;
  height: ${verticalScale(54)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(27)}px;
  background-color: ${({ background }) => background};
`;

const IconText = styled(Text)<{ color: string }>`
  color: ${({ color }) => color};
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(26)}px;
`;

const RoleCopy = styled.View`
  flex: 1;
  padding-horizontal: ${horizontalScale(14)}px;
`;

const RoleTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: 'Inter-Bold';
  font-size: ${fontPixel(16)}px;
  margin-bottom: ${verticalScale(5)}px;
`;

const RoleDescription = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(12)}px;
  line-height: ${fontPixel(17)}px;
`;

const Arrow = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(30)}px;
`;

const TrustNote = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: 'Inter-Regular';
  font-size: ${fontPixel(12)}px;
  text-align: center;
  margin-top: ${verticalScale(14)}px;
`;

export default AccountTypeScreen;
