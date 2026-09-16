import React from 'react';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useTheme } from '@theme';

const NotificationEmptyState = () => {
    const { theme } = useTheme();
    return (
        <Wrapper>
            <Circle>
                <SvgIcon name="fa-bell" size={44} color={theme.colors.primary} />
            </Circle>

            <Text variant="bold" color="black" fontSize={14}>
                Vous êtes à jour !
            </Text>

            <Text
                variant="regularSmall"
                color="gray600"
                style={{ textAlign: 'center', marginTop: verticalScale(4) }}
            >
                Aucune nouvelle notification pour le moment.
            </Text>
        </Wrapper>
    );
};

export default NotificationEmptyState;

const Wrapper = styled.View`
  align-items: center;
  margin-top: ${verticalScale(10)}px;
`;

const Circle = styled.View`
  width: ${horizontalScale(110)}px;
  height: ${horizontalScale(80)}px;
  border-top-left-radius: ${horizontalScale(80)}px;
  border-top-right-radius: ${horizontalScale(80)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  justify-content: center;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
`;
