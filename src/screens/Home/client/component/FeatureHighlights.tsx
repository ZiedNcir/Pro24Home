// components/FeatureHighlights.tsx

import React from 'react';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { IconProps, SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme/index';

const features = [
    {
        icon: 'fa-shield-alt',
        title: 'Techniciens\nvérifiés',
        description: 'Professionnels\nde confiance',
    },
    {
        icon: 'fa-clock',
        title: 'Intervention\nrapide',
        description: 'À votre domicile\nen un rien de temps',
    },
    {
        icon: 'fa-award',
        title: 'Tarifs\ntransparents',
        description: 'Aucun frais\ncaché',
    },
    {
        icon: 'fa-headset',
        title: 'Support\n24/7',
        description: 'Nous sommes\nlà pour vous',
    },
];

const FeatureHighlights = () => {
    return (
        <Container>
            {features.map((item, index) => (
                <FeatureItem key={item.title}>
                    <SvgIcon name={item.icon as IconProps['name']} size={24} color={colors.primary} />

                    <Text
                        variant="bold"
                        color="black"
                        fontSize={12}
                        lineHeight={16}
                        style={{ textAlign: 'center', marginTop: verticalScale(8) }}
                    >
                        {item.title}
                    </Text>

                    <Text
                        variant="regularSmall"
                        color="gray600"
                        fontSize={11}
                        lineHeight={15}
                        style={{ textAlign: 'center', marginTop: verticalScale(8) }}
                    >
                        {item.description}
                    </Text>

                    {index < features.length - 1 && <Divider />}
                </FeatureItem>
            ))}
        </Container>
    );
};

export default FeatureHighlights;

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.96);
  border-radius: ${moderateScale(22)}px;
  border-width: 1px;
  border-color: #f1e4dc;
  padding-vertical: ${verticalScale(18)}px;
  padding-horizontal: ${horizontalScale(10)}px;

  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(6)}px;
  shadow-opacity: 0.04;
  shadow-radius: ${moderateScale(12)}px;
  elevation: 3;
`;

const FeatureItem = styled.View`
  width: 25%;
  align-items: center;
  position: relative;
  padding-horizontal: ${horizontalScale(4)}px;
`;

const Divider = styled.View`
  position: absolute;
  right: 0px;
  top: ${verticalScale(8)}px;
  bottom: ${verticalScale(8)}px;
  width: 1px;
  background-color: #f0ddd4;
`;