// src/screens/intervention/PriceEstimationScreen.tsx

import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import InterventionHeader from '../components/InterventionHeader';
import BottomActions from '../components/BottomActions';
import InfoNotice from '../components/InfoNotice';
//import { appNavigate } from '@navigations/navigation';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppStackType } from '../../../navigation/constant/core';
import { useGetInterventionPriceQuery } from '@store/api/endpoints/payment';

export const PriceEstimationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AppStackType, 'PriceEstimation'>>();
    const [checkWithProfessional, setCheckWithProfessional] = useState(false);
    const { data: price, isLoading: isPriceLoading } = useGetInterventionPriceQuery();

    const priceLabel = price?.minPrice && price?.maxPrice
        ? `${price.minPrice} € – ${price.maxPrice} €`
        : price?.price
            ? `${price.price} €`
            : '50 € – 80 €';

    const continueToPayment = () => {
        const intervention = {
            ...route.params.intervention,
            price: checkWithProfessional
                ? null
                : price?.price ?? price?.minPrice ?? null,
        };

        (navigation as any).navigate('PaymentTravelFee', {
            intervention,
            checkPriceWithProfessional: checkWithProfessional,
        });
    };

    return (
        <ScreenContainer
            mode="light"
            scrollable
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
            contentContainerStyle={{ paddingBottom: verticalScale(18) }}
        >
            <InterventionHeader title="Estimation du prix" showHelp={false} />

            <PriceBox>
                <PriceIcon>
                    <SvgIcon name="fa-euro-sign" size={18} color="#FF6B00" />
                </PriceIcon>
                <PriceContent>
                    <Text variant="bold" color="black" fontSize={13}>
                        Prix moyen estimé
                    </Text>
                    {isPriceLoading ? (
                        <ActivityIndicator color="#FF6B00" />
                    ) : (
                        <Text variant="bold" color="black" fontSize={24}>{priceLabel}</Text>
                    )}
                    <Text variant="regularSmall" color="gray600">
                        Fourchette basée sur des interventions similaires.
                    </Text>
                </PriceContent>
            </PriceBox>

            <SectionTitle>Besoin d’une confirmation ?</SectionTitle>

            <ProfessionalOption
                selected={checkWithProfessional}
                onPress={() => setCheckWithProfessional(value => !value)}
                activeOpacity={0.85}
            >
                <OptionIcon>
                    <SvgIcon name="fa-user-check" size={18} color="#FF6B00" />
                </OptionIcon>
                <OptionContent>
                    <Text variant="bold" color="black" fontSize={13}>
                        Faire vérifier le prix par un professionnel
                    </Text>
                    <Text variant="regularSmall" color="gray600">
                        Recevez une confirmation avant l’intervention.
                    </Text>
                </OptionContent>
                <Radio selected={checkWithProfessional} />
            </ProfessionalOption>

            <SectionTitle>Ce qui peut influencer le prix</SectionTitle>

            <FactorsCard>
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
            </FactorsCard>

            <FooterNote>
                Le prix affiché est indicatif. Le montant final sera confirmé par le professionnel après son diagnostic sur place.
            </FooterNote>

            <BottomActions
                primaryTitle="Compris"
                onPrimaryPress={continueToPayment}
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
  padding: ${horizontalScale(16)}px;
  flex-direction: row;
  align-items: center;
  margin-top: ${verticalScale(26)}px;
  margin-bottom: ${verticalScale(18)}px;
`;

const PriceIcon = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${horizontalScale(42)}px;
  border-radius: ${horizontalScale(21)}px;
  background-color: #fff1e8;
  align-items: center;
  justify-content: center;
  margin-right: ${horizontalScale(12)}px;
`;

const PriceContent = styled.View`
  flex: 1;
`;

const SectionTitle = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 15,
})`
  margin-bottom: ${verticalScale(12)}px;
`;

const FooterNote = styled(Text).attrs({
    variant: 'regularSmall',
    color: 'gray600',
})`
  background-color: #f7f7f7;
  padding: ${horizontalScale(14)}px;
  border-radius: 12px;
`;

const FactorsCard = styled.View`
  border-radius: 14px;
  background-color: #fffaf7;
  padding: ${horizontalScale(2)}px ${horizontalScale(12)}px ${horizontalScale(12)}px;
`;

const ProfessionalOption = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(70)}px;
  border-radius: 14px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? '#FF6B00' : '#E5E5E5')};
  background-color: ${({ selected }) => (selected ? '#FFF5EF' : '#FFFFFF')};
  padding: ${horizontalScale(12)}px;
  flex-direction: row;
  align-items: center;
`;

const OptionIcon = styled.View`
  width: ${horizontalScale(36)}px;
  height: ${horizontalScale(36)}px;
  border-radius: 18px;
  background-color: #fff1e8;
  align-items: center;
  justify-content: center;
`;

const OptionContent = styled.View`
  flex: 1;
  margin-left: ${horizontalScale(10)}px;
`;

const Radio = styled.View<{ selected: boolean }>`
  width: ${horizontalScale(20)}px;
  height: ${horizontalScale(20)}px;
  border-radius: ${horizontalScale(10)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? '#FF6B00' : '#D5D5D5')};
  background-color: ${({ selected }) => (selected ? '#FF6B00' : 'transparent')};
`;
