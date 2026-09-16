
import React from 'react';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { useTheme } from '@theme';

interface Props {
    icon: string;
    title: string;
    description: string;
}

const InfoNotice: React.FC<Props> = ({ icon, title, description }) => {
    const { theme } = useTheme();
    return (
        <Notice>
            <IconBox>
                <SvgIcon name={icon as any} size={18} color={theme.colors.primary} />
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
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  padding: ${horizontalScale(14)}px;
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(12)}px;
`;

const IconBox = styled.View`
  width: ${horizontalScale(38)}px;
  height: ${horizontalScale(38)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(12)}px;
`;

const Content = styled.View`
  flex: 1;
`;
