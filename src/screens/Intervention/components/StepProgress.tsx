import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
} from '@utils/normalizedCss';
import { InterventionStep } from '../screens/types';
import { colors } from '@theme/index';

const labels = ['Type de service', 'Détails', 'Adresse', 'Récapitulatif'];

interface Props {
    currentStep: InterventionStep;
}

const StepProgress: React.FC<Props> = ({ currentStep }) => {
    return (
        <Wrapper>
            <Line />

            <StepsRow>
                {labels.map((label, index) => {
                    const step = index + 1;
                    const isActive = step === currentStep;
                    const isDone = step < currentStep;

                    return (
                        <StepItem key={label}>
                            <StepCircle isActive={isActive} isDone={isDone}>
                                {isDone ? (
                                    <SvgIcon name="fa-check" size={10} color={colors.success} />
                                ) : (
                                    <Text
                                        variant="notification"
                                        color={isActive ? 'white' : 'gray600'}
                                        fontWeight="700"
                                    >
                                        {step}
                                    </Text>
                                )}
                            </StepCircle>

                            <Text
                                variant="notification"
                                color={isActive ? 'primary' : 'gray600'}
                                style={{ textAlign: 'center', marginTop: verticalScale(6) }}
                            >
                                {label}
                            </Text>
                        </StepItem>
                    );
                })}
            </StepsRow>
        </Wrapper>
    );
};

export default StepProgress;

const Wrapper = styled.View`
  margin-top: ${verticalScale(14)}px;
  margin-bottom: ${verticalScale(20)}px;
`;

const Line = styled.View`
  position: absolute;
  left: ${horizontalScale(35)}px;
  right: ${horizontalScale(35)}px;
  top: ${verticalScale(12)}px;
  height: 1px;
  background-color: #e5e5e5;
`;

const StepsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const StepItem = styled.View`
  width: 25%;
  align-items: center;
`;

const StepCircle = styled.View<{ isActive: boolean; isDone: boolean }>`
  width: ${horizontalScale(24)}px;
  height: ${horizontalScale(24)}px;
  border-radius: ${horizontalScale(12)}px;
  background-color: ${({ isActive, isDone }) =>
        isActive ? colors.primary : isDone ? '#E9F8EF' : '#F0F0F0'};
  justify-content: center;
  align-items: center;
  z-index: 2;
`;