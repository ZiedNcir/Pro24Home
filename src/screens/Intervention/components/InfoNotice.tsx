// src/screens/intervention/components/InfoNotice.tsx

import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme/index';

interface Props {
    icon: string;
    title: string;
    description: string;
}

const InfoNotice: React.FC<Props> = ({ icon, title, description }) => {
    return (
        <Notice>
            <IconBox>
                <SvgIcon name={icon as any} size={18} color={colors.primary} />
            </IconBox>

            <Content>
                <Text variant="bold" color="black" fontSize={13}>
                    {title}
                </Text>

                <Text
                    variant="regularSmall"
                    color="gray600"
                    style={{ marginTop: verticalScale(4) }}
                >
                    {description}
                </Text>
            </Content>
        </Notice>
    );
};

export default InfoNotice;

const Notice = styled.View`
  border-radius: ${moderateScale(14)}px;
  background-color: #fff5ef;
  padding: ${horizontalScale(14)}px;
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(12)}px;
`;

const IconBox = styled.View`
  width: ${horizontalScale(38)}px;
  height: ${horizontalScale(38)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${colors.white};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(12)}px;
`;

const Content = styled.View`
  flex: 1;
`;