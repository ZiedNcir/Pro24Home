// src/screens/intervention/PriceEstimationScreen.tsx

import React from 'react';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import InterventionHeader from '../components/InterventionHeader';
import BottomActions from '../components/BottomActions';
import InfoNotice from '../components/InfoNotice';
//import { appNavigate } from '@navigations/navigation';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppStackType } from '../../../navigation/constant/core';

export const PriceEstimationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AppStackType, 'PriceEstimation'>>();
    return (
        <ScreenContainer
            mode="light"
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
        >
            <InterventionHeader title="Estimation du prix" showHelp={false} />

            <PriceBox>
                <Text variant="bold" color="black" fontSize={13}>
                    Prix moyen estimé
                </Text>

                <Text variant="bold" color="black" fontSize={24}>
                    50 € – 80 €
                </Text>

                <Text variant="regularSmall" color="gray600">
                    Fourchette basée sur des interventions similaires.
                </Text>
            </PriceBox>

            <SectionTitle>Ce qui peut influencer le prix</SectionTitle>

            <InfoNotice
                icon="fa-exclamation-circle"
                title="Complexité du problème"
                description="Plus le problème est complexe, plus le prix peut augmenter."
            />

            <InfoNotice
                icon="fa-tools"
                title="Matériel nécessaire"
                description="Les pièces ou équipements peuvent influencer le prix."
            />

            <InfoNotice
                icon="fa-clock"
                title="Temps d’intervention"
                description="La durée peut faire varier le coût."
            />

            <BottomSpacer />

            <FooterNote>
                Le prix final sera confirmé par le professionnel après son diagnostic sur place.
            </FooterNote>

            <BottomActions
                primaryTitle="Compris"
                onPrimaryPress={() => (navigation as any).navigate('PaymentTravelFee', { intervention: route.params.intervention })}
                    //appNavigate('PaymentTravelFee')
            />
        </ScreenContainer>
    );
};


const PriceBox = styled.View`
  background-color: #f8fffb;
  border-width: 1px;
  border-color: #dff5e8;
  border-radius: 16px;
  padding: ${horizontalScale(18)}px;
  margin-top: ${verticalScale(26)}px;
  margin-bottom: ${verticalScale(18)}px;
`;

const SectionTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
`;

const BottomSpacer = styled.View`
  flex: 1;
`;

const FooterNote = styled(Text).attrs({
    variant: 'regularSmall',
    color: 'gray600',
})`
  background-color: #f7f7f7;
  padding: ${horizontalScale(14)}px;
  border-radius: 12px;
`;
