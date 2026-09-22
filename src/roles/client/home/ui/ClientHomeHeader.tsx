// components/ClientHomeHeader.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { colors } from '@theme';
import { selectUser } from '@store/slices/authSlice';

const ClientHomeHeader = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const displayName = user?.client
        ? `${user.client.first_name} ${user.client.last_name}`.trim()
        : user?.name || t('client.home.user');
    return (
        <Container>
            <Left>
                <LocationRow>
                    <SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} />
                    <Text variant="medium" color="black">
                        {t('client.home.myLocation')}
                    </Text>
                    <SvgIcon name="fa-chevron-down" size={12} color={colors.gray600} />
                </LocationRow>

                <Title>
                    <Text variant="bold" fontSize={26}>
                        {t('client.home.hello')}{' '}
                    </Text>
                    <Text variant="bold" color="primary" fontSize={26}>
                        {displayName}
                    </Text>
                    <Text variant="bold" fontSize={26}>
                        {' '}👋
                    </Text>
                </Title>

                <Text variant="regular" color="gray600">
                    {t('client.home.headline')}
                </Text>
            </Left>

            <Bell>
                <SvgIcon name="fa-bell" size={22} color={colors.black} />
                <Badge>
                    <Text variant="notification" color="white">
                        2
                    </Text>
                </Badge>
            </Bell>
        </Container>
    );
};

export default ClientHomeHeader;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${verticalScale(18)}px;
`;

const Left = styled.View`
  flex: 1;
`;

const LocationRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

const Title = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: ${verticalScale(4)}px;
`;

const Bell = styled.TouchableOpacity`
  width: ${horizontalScale(44)}px;
  height: ${horizontalScale(44)}px;
  justify-content: center;
  align-items: center;
`;

const Badge = styled.View`
  position: absolute;
  top: 4px;
  right: 2px;
  background-color: ${colors.primary};
  width: 20px;
  height: 20px;
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
