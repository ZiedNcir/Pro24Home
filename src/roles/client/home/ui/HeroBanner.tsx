// components/HeroBanner.tsx

import React from 'react';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme/index';

const HeroBanner = () => {
    return (
        <Card>
            <Content>
                <Text variant="bold" color={colors.primary} fontSize={22} >
                    Des pros <Text variant="bold" color="black" fontSize={22} >
                        à votre service, à
                        domicile
                    </Text>
                </Text>

                <Text
                    variant="regular"
                    color="black"
                    fontSize={16}
                    style={{ marginTop: verticalScale(10) }}
                >
                    Réparation, installation et
                    dépannage rapide et{'\n'}
                    fiable.
                </Text>


            </Content>

            <HeroImage
                source={require('@assets/images/hero_baner2.png')}
                resizeMode="cover"
            />

            <FeatureRow>
                <FeatureItem>
                    <SvgIcon name="fa-clock" size={16} color={colors.primary} />
                    <Text variant="medium" color="black" fontSize={13}>
                        Intervention rapide
                    </Text>
                </FeatureItem>
                <FeatureItem>
                    <SvgIcon name="fa-shield-alt" size={16} color={colors.primary} />
                    <Text variant="medium" color="black" fontSize={13}>
                        Pros vérifiés
                    </Text>
                </FeatureItem>
            </FeatureRow>
        </Card>
    );
};

export default HeroBanner;

const Card = styled.View`
  min-height: ${verticalScale(200)}px;
  border-radius: ${moderateScale(10)}px;
  background-color: rgba(255, 255, 255, 0.96);
  border-width: 1px;
  border-color: #f1e4dc;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px ${verticalScale(8)}px;
  shadow-opacity: 0.06;
  shadow-radius: ${moderateScale(16)}px;
  elevation: 4;
`;

const Content = styled.View`
  z-index: 2;
  width: 62%;
  padding: ${horizontalScale(15)}px;
`;


const HeroImage = styled(Image)`
  position: absolute;
  right: 0px;
  width: ${100}%;
  height: ${100}%;
`;

const FeatureRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(5)}px;
  align-self: flex-start;
  padding-left: ${horizontalScale(15)}px;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(3)}px;
`;
