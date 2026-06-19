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
    details?: string;
    selected?: boolean;
    isDefault?: boolean;
    onPress?: () => void;
    onEditPress?: () => void;
}

const AddressCard: React.FC<Props> = ({
    title,
    details,
    selected,
    isDefault,
    onPress,
    onEditPress,
}) => {
    return (
        <Card selected={!!selected} onPress={onPress} activeOpacity={0.86}>
            <Content>
                <TopLine>
                    <Text variant="bold" color="black" fontSize={13}>
                        {title}
                    </Text>

                    {isDefault ? (
                        <DefaultBadge>
                            <Text variant="notification" color="primary">
                                Par défaut
                            </Text>
                        </DefaultBadge>
                    ) : null}
                </TopLine>

                {details ? (
                    <Text
                        variant="regularSmall"
                        color="gray600"
                        style={{ marginTop: verticalScale(6) }}
                    >
                        {details}
                    </Text>
                ) : null}
            </Content>

            <RightSide>
                {onEditPress ? (
                    <EditButton onPress={onEditPress}>
                        <SvgIcon name="fa-pen" size={14} color={colors.gray600} />
                    </EditButton>
                ) : null}

                <Radio selected={!!selected}>
                    {selected ? <InnerDot /> : null}
                </Radio>
            </RightSide>
        </Card>
    );
};

export default AddressCard;

const Card = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(72)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#E9E9E9')};
  background-color: ${({ selected }) => (selected ? '#FFF5EF' : colors.white)};
  padding: ${horizontalScale(14)}px;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(12)}px;
`;

const Content = styled.View`
  flex: 1;
`;

const TopLine = styled.View`
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: ${horizontalScale(8)}px;
`;

const DefaultBadge = styled.View`
  background-color: #fff1e8;
  padding-horizontal: ${horizontalScale(8)}px;
  padding-vertical: ${verticalScale(3)}px;
  border-radius: ${moderateScale(10)}px;
`;

const RightSide = styled.View`
  align-items: center;
  gap: ${verticalScale(10)}px;
  margin-left: ${horizontalScale(10)}px;
`;

const EditButton = styled.TouchableOpacity`
  width: ${horizontalScale(28)}px;
  height: ${horizontalScale(28)}px;
  justify-content: center;
  align-items: center;
`;

const Radio = styled.View<{ selected: boolean }>`
  width: ${horizontalScale(18)}px;
  height: ${horizontalScale(18)}px;
  border-radius: ${horizontalScale(9)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#D5D5D5')};
  justify-content: center;
  align-items: center;
`;

const InnerDot = styled.View`
  width: ${horizontalScale(9)}px;
  height: ${horizontalScale(9)}px;
  border-radius: ${horizontalScale(4.5)}px;
  background-color: ${colors.primary};
`;