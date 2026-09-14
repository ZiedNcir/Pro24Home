
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
    primaryTitle: string;
    secondaryTitle?: string;
    onPrimaryPress: () => void;
    onSecondaryPress?: () => void;
    primaryDisabled?: boolean;
}

const BottomActions: React.FC<Props> = ({
    primaryTitle,
    secondaryTitle = 'Précédent',
    onPrimaryPress,
    onSecondaryPress,
    primaryDisabled = false,
}) => {
    return (
        <Wrapper>
            {onSecondaryPress ? (
                <SecondaryButton onPress={onSecondaryPress}>
                    <Text variant="bold" color="black" fontSize={13}>
                        {secondaryTitle}
                    </Text>
                </SecondaryButton>
            ) : null}

            <PrimaryButton
                onPress={onPrimaryPress}
                disabled={primaryDisabled}
                activeOpacity={0.8}
                primaryDisabled={primaryDisabled}
            >
                <Text variant="bold" color="white" fontSize={13}>
                    {primaryTitle}
                </Text>
                <SvgIcon name="fa-chevron-right" size={14} color={colors.white} />
            </PrimaryButton>
        </Wrapper>
    );
};

export default BottomActions;

const Wrapper = styled.View`
  flex-direction: row;
  gap: ${horizontalScale(12)}px;
  padding-top: ${verticalScale(14)}px;
`;

const SecondaryButton = styled.TouchableOpacity`
  flex: 1;
  height: ${verticalScale(50)}px;
  border-radius: ${moderateScale(12)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
`;

const PrimaryButton = styled.TouchableOpacity<{ primaryDisabled: boolean }>`
  flex: 2;
  height: ${verticalScale(50)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${({ primaryDisabled }) => (primaryDisabled ? '#D7D7D7' : colors.primary)};
  justify-content: center;
  align-items: center;
  flex-direction: row;
  gap: ${horizontalScale(10)}px;
`;
