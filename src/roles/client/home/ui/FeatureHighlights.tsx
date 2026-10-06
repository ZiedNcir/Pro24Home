// components/FeatureHighlights.tsx

import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { IconProps, SvgIcon } from '@shared/ui/icon';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
} from '@utils/normalizedCss';
import { colors } from '@theme';

const features = [
    {
        icon: 'fa-shield-alt',
        titleKey: 'client.home.features.verifiedTitle',
        descriptionKey: 'client.home.features.verifiedDescription',
    },
    {
        icon: 'fa-clock',
        titleKey: 'client.home.features.fastTitle',
        descriptionKey: 'client.home.features.fastDescription',
    },
    {
        icon: 'fa-award',
        titleKey: 'client.home.features.transparentTitle',
        descriptionKey: 'client.home.features.transparentDescription',
    },
    {
        icon: 'fa-headset',
        titleKey: 'client.home.features.supportTitle',
        descriptionKey: 'client.home.features.supportDescription',
    },
];

const FeatureHighlights = () => {
    const { t } = useTranslation();
    return (
        <Container>
            {features.map((item, index) => (
                <FeatureItem key={item.titleKey}>
                    <SvgIcon name={item.icon as IconProps['name']} size={24} color={colors.primary} />

                    <Text
                        variant="bold"
                        color="black"
                        fontSize={12}
                        lineHeight={16}
                        style={[styles.featureText, { marginTop: verticalScale(8) }]}
                    >
                        {t(item.titleKey)}
                    </Text>

                    <Text
                        variant="regularSmall"
                        color="gray600"
                        fontSize={11}
                        lineHeight={15}
                        style={[styles.featureText, { marginTop: verticalScale(8) }]}
                    >
                        {t(item.descriptionKey)}
                    </Text>

                    {index < features.length - 1 && <Divider />}
                </FeatureItem>
            ))}
        </Container>
    );
};

export default FeatureHighlights;

const styles = StyleSheet.create({ featureText: { textAlign: 'center' } });

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
