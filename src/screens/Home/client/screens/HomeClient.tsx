import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';

import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import HeaderLocation from '../component/HeaderLocation';
import HeroBanner from '../component/HeroBanner';
import ServiceCategoryGrid from '../component/ServiceCategoryGrid';
import FeatureHighlights from '../component/FeatureHighlights';

const ClientHome = () => {
    return (
        <ScreenContainer
            mode="light"
            scrollable
            useImageBackground
            backgroundImage={require('@assets/images/background_ligth.png')}
            imageResizeMode="cover"
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(14)}
            contentContainerStyle={{
                paddingBottom: verticalScale(120),
            }}
        >
            <HeaderLocation />

            <Content>
                <HeroBanner />
                <ServiceCategoryGrid />
                <FeatureHighlights />

            </Content>
        </ScreenContainer>
    );
};

export default ClientHome;

const Content = styled.View`
  gap: ${verticalScale(18)}px;
`;