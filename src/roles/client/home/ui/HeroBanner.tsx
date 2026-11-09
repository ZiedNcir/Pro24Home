// components/HeroBanner.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
// The illustration has a light background in both app themes.
const bannerInk = '#212121';
const bannerAccent = '#9A3900';

const HeroBanner = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <Content>
                <Text variant="bold" color={bannerAccent} fontSize={22} >
                    {t('client.home.heroTitle')}
                </Text>

                <Text
                    variant="regular"
                    color={bannerInk}
                    fontSize={16}
                    style={{ marginTop: verticalScale(10) }}
                >
                    {t('client.home.heroDescription')}
                </Text>


            </Content>

            <HeroImage
                source={require('@assets/images/hero_baner2.png')}
                resizeMode="cover"
            />

            <FeatureRow>
                <FeatureItem>
                    <SvgIcon name="fa-clock" size={16} color={bannerAccent} />
                    <Text variant="medium" color={bannerInk} fontSize={13}>
                        {t('client.home.fast')}
                    </Text>
                </FeatureItem>
                <FeatureItem>
                    <SvgIcon name="fa-shield-alt" size={16} color={bannerAccent} />
                    <Text variant="medium" color={bannerInk} fontSize={13}>
                        {t('client.home.verified')}
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
  background-color: #FFF3E8;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.borderLight};
  overflow: hidden;
  shadow-color: ${({ theme }) => theme.colors.black};
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
  flex-wrap: wrap;
  align-items: center;
  gap: ${horizontalScale(5)}px;
  align-self: flex-start;
  padding: 0px ${horizontalScale(15)}px ${verticalScale(12)}px;
`;

const FeatureItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(3)}px;
`;
