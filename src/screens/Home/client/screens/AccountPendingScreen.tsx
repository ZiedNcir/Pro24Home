// src/screens/AccountPendingScreen.tsx

import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { IconProps, SvgIcon } from '@components/Icon';
import { OutlineButton } from '@components/Button/Button';

import {
  horizontalScale,
  verticalScale,
  moderateScale,
} from '@utils/normalizedCss';

import { Colors } from '@utils/constant';
import { colors } from '@theme/index';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@components/index';
export const AccountPendingScreen = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    navigation.navigate('Welcome' as never);
  };
  return (
    <ScreenContainer
      mode="light"
      scrollable
      paddingHorizontal={horizontalScale(20)}
      paddingVertical={verticalScale(20)}
      useImageBackground
      backgroundImage={require('@assets/images/background_ligth.png')}
      imageResizeMode="cover"
    >
      <Header>
        <View>
          <Text variant="medium" color="gray600" fontSize={16}>
            Good morning,
          </Text>

          <Text
            variant="bold"
            color="black"
            fontSize={30}
            lineHeight={38}
            style={{ marginTop: verticalScale(4) }}
          >
            John Doe 👋
          </Text>
        </View>

        <ActionButton onPress={handleLogout}>
          <SvgIcon name="fa-sign-out-alt" size={29} color={colors.gray900} />
          <Text variant="regular" color={colors.gray900}>
            Logout
          </Text>
        </ActionButton>
      </Header>

      <MainCard>
        <AvatarWrapper>
          <AvatarCircle>
            <Avatar
              source={require('@assets/images/worker_avatar.png')}
              resizeMode="contain"
            />
          </AvatarCircle>
        </AvatarWrapper>

        <StatusPill>
          <Text
            variant="notification"
            color="primary"
            fontSize={13}
            fontWeight="700"
          >
            PENDING APPROVAL
          </Text>
        </StatusPill>

        <Text
          variant="bold"
          color="black"
          fontSize={24}
          lineHeight={30}
          style={{ textAlign: 'center' }}
        >
          Your account is{' '}
          <Text
            variant="bold"
            color="primary"
            fontSize={24}
            lineHeight={30}
          >
            under review
          </Text>
        </Text>

        <Text
          variant="regular"
          color="gray600"
          fontSize={15}
          lineHeight={22}
          style={{
            textAlign: 'center',
            marginTop: verticalScale(12),
            marginBottom: verticalScale(22),
          }}
        >
          Our team is reviewing your information.{'\n'}
          You’ll be notified once your account is activated.
        </Text>

        <InfoPanel>
          <InfoRow>
            <IconCircle>
              <SvgIcon name="fa-clock" size={20} color={colors.primary} />
            </IconCircle>

            <InfoTextBlock>
              <Text variant="bold" color="black" fontSize={15}>
                Status
              </Text>
              <Text
                variant="regular"
                color="primary"
                fontSize={14}
                style={{ marginTop: verticalScale(3) }}
              >
                Pending Review
              </Text>
            </InfoTextBlock>
          </InfoRow>

          <InfoRow>
            <IconCircle>
              <SvgIcon name="fa-calendar" size={20} color={colors.gray600} />
            </IconCircle>

            <InfoTextBlock>
              <Text variant="bold" color="black" fontSize={15}>
                Estimated review time
              </Text>
              <Text
                variant="regular"
                color="gray600"
                fontSize={14}
                style={{ marginTop: verticalScale(3) }}
              >
                24 – 48 hours
              </Text>
            </InfoTextBlock>
          </InfoRow>

          <InfoRow isLast>
            <IconCircle>
              <SvgIcon name="fa-bell" size={20} color={colors.primary} />
            </IconCircle>

            <InfoTextBlock>
              <Text variant="bold" color="black" fontSize={15}>
                You’ll be notified via
              </Text>
              <Text
                variant="regular"
                color="gray600"
                fontSize={14}
                style={{ marginTop: verticalScale(3) }}
              >
                Email and Push Notification
              </Text>
            </InfoTextBlock>
          </InfoRow>
        </InfoPanel>
      </MainCard>

      <StepsCard>
        <Text
          variant="bold"
          color="black"
          fontSize={18}
          style={{ marginBottom: verticalScale(22) }}
        >
          What happens next?
        </Text>

        <StepsRow>
          {steps.map((step, index) => (
            <StepItem key={step.title}>
              <StepIconCircle success={step.success}>
                <SvgIcon
                  name={step.icon as IconProps['name']}
                  size={22}
                  color={step.success ? colors.success : colors.primary}
                />
              </StepIconCircle>

              {index < steps.length - 1 && <StepLine />}

              <StepNumber success={step.success}>
                <Text variant="notification" color="white" fontWeight="700">
                  {index + 1}
                </Text>
              </StepNumber>

              <Text
                variant="bold"
                color="black"
                fontSize={12}
                lineHeight={16}
                style={{ textAlign: 'center' }}
              >
                {step.title}
              </Text>

              <Text
                variant="regularSmall"
                color="gray600"
                fontSize={11}
                lineHeight={15}
                style={{
                  textAlign: 'center',
                  marginTop: verticalScale(4),
                }}
              >
                {step.description}
              </Text>
            </StepItem>
          ))}
        </StepsRow>
      </StepsCard>

      <HelpCard>
        <HelpLeft>
          <HelpIconCircle>
            <SvgIcon name="fa-headset" size={24} color={colors.primary} />
          </HelpIconCircle>

          <HelpTextBlock>
            <Text variant="bold" color="black" fontSize={16}>
              Need help?
            </Text>

            <Text
              variant="regularSmall"
              color="gray600"
              fontSize={13}
              lineHeight={18}
              style={{ marginTop: verticalScale(4) }}
            >
              Contact our support team if you have any questions.
            </Text>
          </HelpTextBlock>
        </HelpLeft>

        <OutlineButton title="Contact Support" size="medium" rounded />
      </HelpCard>
    </ScreenContainer>
  );
};

export default AccountPendingScreen;

const steps = [
  {
    icon: 'fa-file-alt',
    title: 'We review',
    description: 'your information',
  },
  {
    icon: 'fa-shield-alt',
    title: 'We verify',
    description: 'your details and documents',
  },
  {
    icon: 'fa-user',
    title: 'Your account',
    description: 'will be activated',
  },
  {
    icon: 'fa-check',
    title: 'You can start',
    description: 'using all features',
    success: true,
  },
];

const View = styled.View``;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${verticalScale(24)}px;
`;

const ActionButton = styled.TouchableOpacity`
  width: ${horizontalScale(44)}px;
  height: ${horizontalScale(44)}px;
  justify-content: center;
  align-items: center;
  border-radius: ${horizontalScale(22)}px;
`;

const CardBase = styled.View`
  background-color: rgba(255, 255, 255, 0.96);
  border-radius: ${moderateScale(26)}px;
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(8)}px;
  shadow-opacity: 0.06;
  shadow-radius: ${moderateScale(18)}px;
  elevation: 4;
`;

const MainCard = styled(CardBase)`
  padding: ${horizontalScale(19)}px;
  align-items: center;
  margin-bottom: ${verticalScale(16)}px;
`;

const AvatarWrapper = styled.View`
  margin-top: ${verticalScale(6)}px;
  margin-bottom: ${verticalScale(14)}px;
`;

const AvatarCircle = styled.View`
  width: ${horizontalScale(150)}px;
  height: ${horizontalScale(150)}px;
  border-radius: ${horizontalScale(75)}px;
  background-color: #fff2ea;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: #ffe0d1;
`;

const Avatar = styled(Image)`
  width: ${horizontalScale(195)}px;
  height: ${horizontalScale(195)}px;
`;

const StatusPill = styled.View`
  background-color: #fff1e8;
  padding-horizontal: ${horizontalScale(16)}px;
  padding-vertical: ${verticalScale(6)}px;
  border-radius: ${moderateScale(18)}px;
  margin-bottom: ${verticalScale(14)}px;
`;

const InfoPanel = styled.View`
  width: 100%;
  background-color: #fff5ef;
  border-radius: ${moderateScale(18)}px;
  padding: ${horizontalScale(16)}px;
`;

const InfoRow = styled.View<{ isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ isLast }) => (isLast ? 0 : verticalScale(16))}px;
`;

const IconCircle = styled.View`
  width: ${horizontalScale(48)}px;
  height: ${horizontalScale(48)}px;
  border-radius: ${horizontalScale(24)}px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(14)}px;
`;

const InfoTextBlock = styled.View`
  flex: 1;
`;

const StepsCard = styled(CardBase)`
  padding: ${horizontalScale(18)}px;
  margin-bottom: ${verticalScale(16)}px;
`;

const StepsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StepItem = styled.View`
  width: 24%;
  align-items: center;
  position: relative;
`;

const StepIconCircle = styled.View<{ success?: boolean }>`
  width: ${horizontalScale(54)}px;
  height: ${horizontalScale(54)}px;
  border-radius: ${horizontalScale(27)}px;
  background-color: ${({ success }) => (success ? '#E7F7EF' : '#FFF1E8')};
  justify-content: center;
  align-items: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const StepLine = styled.View`
  position: absolute;
  top: ${verticalScale(26)}px;
  left: 75%;
  width: 60%;
  height: 2px;
  border-style: dashed;
  border-width: 1px;
  border-color: #d9d9d9;
`;

const StepNumber = styled.View<{ success?: boolean }>`
  width: ${horizontalScale(24)}px;
  height: ${horizontalScale(24)}px;
  border-radius: ${horizontalScale(12)}px;
  background-color: ${({ success }) =>
    success ? colors.success : colors.primary};
  justify-content: center;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
`;

const HelpCard = styled(CardBase)`
  padding: ${horizontalScale(16)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HelpLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
  margin-right: ${horizontalScale(12)}px;
`;

const HelpIconCircle = styled.View`
  width: ${horizontalScale(54)}px;
  height: ${horizontalScale(54)}px;
  border-radius: ${horizontalScale(27)}px;
  background-color: #fff1e8;
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(14)}px;
`;

const HelpTextBlock = styled.View`
  flex: 1;
`;