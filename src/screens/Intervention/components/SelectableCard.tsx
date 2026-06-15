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
    title: string;
    description?: string;
    icon?: string;
    selected?: boolean;
    onPress?: () => void;
}

const SelectableCard: React.FC<Props> = ({
    title,
    description,
    icon,
    selected,
    onPress,
}) => {
    return (
        <Card selected={!!selected} onPress={onPress} activeOpacity={0.85}>
            <Radio selected={!!selected}>
                {selected ? <InnerDot /> : null}
            </Radio>

            {icon ? (
                <IconBox>
                    <SvgIcon name={icon as any} size={18} color={colors.primary} />
                </IconBox>
            ) : null}

            <Content>
                <Text variant="bold" color="black" fontSize={13}>
                    {title}
                </Text>
                {description ? (
                    <Text
                        variant="regularSmall"
                        color="gray600"
                        numberOfLines={2}
                        style={{ marginTop: verticalScale(3) }}
                    >
                        {description}
                    </Text>
                ) : null}
            </Content>
        </Card>
    );
};

export default SelectableCard;

const Card = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(58)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#E9E9E9')};
  background-color: ${({ selected }) => (selected ? '#FFF5EF' : colors.white)};
  padding-horizontal: ${horizontalScale(12)}px;
  padding-vertical: ${verticalScale(10)}px;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
`;

const Radio = styled.View<{ selected: boolean }>`
  width: ${horizontalScale(18)}px;
  height: ${horizontalScale(18)}px;
  border-radius: ${horizontalScale(9)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#D8D8D8')};
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(10)}px;
`;

const InnerDot = styled.View`
  width: ${horizontalScale(9)}px;
  height: ${horizontalScale(9)}px;
  border-radius: ${horizontalScale(4.5)}px;
  background-color: ${colors.primary};
`;

const IconBox = styled.View`
  width: ${horizontalScale(34)}px;
  height: ${horizontalScale(34)}px;
  border-radius: ${moderateScale(9)}px;
  background-color: #fff1e8;
  justify-content: center;
  align-items: center;
  margin-right: ${horizontalScale(10)}px;
`;

const Content = styled.View`
  flex: 1;
`;