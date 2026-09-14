import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';

import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import HeaderLocation from '@screens/Home/client/component/HeaderLocation';
import HeroBanner from '@screens/Home/client/component/HeroBanner';
import ServiceCategoryGrid from '@screens/Home/client/component/ServiceCategoryGrid';
import FeatureHighlights from '@screens/Home/client/component/FeatureHighlights';
import { useTheme } from '@theme/ThemeProvider';

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
