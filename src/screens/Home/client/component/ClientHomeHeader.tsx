// components/ClientHomeHeader.tsx

import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';

const ClientHomeHeader = () => {
    return (
        <Container>
            <Left>
                <LocationRow>
                    <SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} />
                    <Text variant="medium" color="black">
                        Ma position
                    </Text>
                    <SvgIcon name="fa-chevron-down" size={12} color={colors.gray600} />
                </LocationRow>

                <Title>
                    <Text variant="bold" fontSize={26}>
                        Bonjour,{' '}
                    </Text>
                    <Text variant="bold" color="primary" fontSize={26}>
                        John
                    </Text>
                    <Text variant="bold" fontSize={26}>
                        {' '}👋
                    </Text>
                </Title>

                <Text variant="regular" color="gray600">
                    Comment pouvons-nous vous aider aujourd’hui ?
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