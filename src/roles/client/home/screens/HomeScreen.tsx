import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';

import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import HeaderLocation from '@roles/client/home/ui/HeaderLocation';
import HeroBanner from '@roles/client/home/ui/HeroBanner';
import ServiceCategoryGrid from '@roles/client/home/ui/ServiceCategoryGrid';
import FeatureHighlights from '@roles/client/home/ui/FeatureHighlights';
import { useTheme } from '@theme';

const ClientHome = () => {
    const { themeMode } = useTheme();

    return (
        <ScreenContainer
            mode={themeMode}
            scrollable
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(14)}
            contentContainerStyle={{
                paddingBottom: verticalScale(190),
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
