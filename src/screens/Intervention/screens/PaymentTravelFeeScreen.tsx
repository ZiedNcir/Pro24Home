// src/screens/intervention/PaymentTravelFeeScreen.tsx

import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import InterventionHeader from '../components/InterventionHeader';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
import { colors } from '@theme/index';
import { useNavigation } from '@react-navigation/core';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Toast } from 'react-native-toast-notifications';
import { useAddInterventionMutation } from '@store/api/endpoints/client';
import { AppStackType } from '../../../navigation/constant/core';

export const PaymentTravelFeeScreen = () => {
    const [selectedCard, setSelectedCard] = useState('main');
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AppStackType, 'PaymentTravelFee'>>();
    const [addIntervention, { isLoading }] = useAddInterventionMutation();

    const handlePayment = async () => {
        try {
            await addIntervention(route.params.intervention).unwrap();
            (navigation as any).navigate('InterventionSuccess');
        } catch (error: any) {
            Toast.show(error?.data?.message || error?.message || 'Le paiement n’a pas pu être finalisé.', {
                type: 'danger',
                placement: 'bottom',
            });
        }
    };

    return (
        <ScreenContainer
            mode="light"
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
        >
            <InterventionHeader title="Paiement des frais de déplacement" showHelp={false} />

            <HeroIcon>
                <SvgIcon name="fa-credit-card" size={42} color={colors.primary} />
            </HeroIcon>

            <Title>Pour confirmer votre demande</Title>

            <Description>
                Un frais de déplacement est demandé pour réserver l’intervention. Ce montant sera déduit du prix final si l’intervention est réalisée.
            </Description>

            <FeeCard>
                <Text variant="bold" color="black" fontSize={15}>
                    Frais de déplacement
                </Text>
                <Text variant="bold" color="black" fontSize={24}>
                    20 €
                </Text>
            </FeeCard>

            <SecureRow>
                <SvgIcon name="fa-lock" size={12} color={colors.gray600} />
                <Text variant="regularSmall" color="gray600">
                    Paiement 100% sécurisé
                </Text>
            </SecureRow>

            <SectionLabel>Mode de paiement</SectionLabel>

            <PaymentOption
                selected={selectedCard === 'main'}
                onPress={() => setSelectedCard('main')}
            >
                <SvgIcon name="fa-credit-card" size={20} color={colors.primary} />
                <PaymentText>
                    <Text variant="bold" color="black" fontSize={13}>
                        Carte bancaire
                    </Text>
                    <Text variant="regularSmall" color="gray600">
                        Visa **** 4242
                    </Text>
                </PaymentText>
                <Radio selected={selectedCard === 'main'} />
            </PaymentOption>

            <PaymentOption
                selected={selectedCard === 'other'}
                onPress={() => setSelectedCard('other')}
            >
                <SvgIcon name="fa-credit-card" size={20} color={colors.gray600} />
                <PaymentText>
                    <Text variant="bold" color="black" fontSize={13}>
                        Autre carte
                    </Text>
                </PaymentText>
                <Radio selected={selectedCard === 'other'} />
            </PaymentOption>

            <Spacer />

            <PayButton onPress={handlePayment} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color={colors.white} /> : <Text variant="bold" color="white" fontSize={14}>Payer 20 €</Text>}
            </PayButton>
        </ScreenContainer>
    );
};


const HeroIcon = styled.View`
  align-self: center;
  width: ${horizontalScale(82)}px;
  height: ${horizontalScale(82)}px;
  border-radius: ${horizontalScale(41)}px;
  background-color: #fff1e8;
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(30)}px;
`;

const Title = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 17,
})`
  text-align: center;
  margin-top: ${verticalScale(20)}px;
`;

const Description = styled(Text).attrs({
    variant: 'regularSmall',
    color: 'gray600',
})`
  text-align: center;
  margin-top: ${verticalScale(12)}px;
  line-height: 18px;
`;

const FeeCard = styled.View`
  height: ${verticalScale(66)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 1px;
  border-color: #e5e5e5;
  margin-top: ${verticalScale(24)}px;
  padding-horizontal: ${horizontalScale(16)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.white};
`;

const SecureRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  margin-top: ${verticalScale(12)}px;
`;

const SectionLabel = styled(Text).attrs({
    variant: 'bold',
    color: 'black',
    fontSize: 13,
})`
  margin-top: ${verticalScale(24)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

const PaymentOption = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(56)}px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#E5E5E5')};
  background-color: ${colors.white};
  padding-horizontal: ${horizontalScale(14)}px;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${verticalScale(10)}px;
`;

const PaymentText = styled.View`
  flex: 1;
  margin-left: ${horizontalScale(12)}px;
`;

const Radio = styled.View<{ selected: boolean }>`
  width: ${horizontalScale(18)}px;
  height: ${horizontalScale(18)}px;
  border-radius: ${horizontalScale(9)}px;
  border-width: 1px;
  border-color: ${({ selected }) => (selected ? colors.primary : '#D5D5D5')};
  background-color: ${({ selected }) => (selected ? colors.primary : 'transparent')};
`;

const Spacer = styled.View`
  flex: 1;
`;

const PayButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: ${verticalScale(52)}px;
  border-radius: 12px;
  background-color: ${colors.primary};
  justify-content: center;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
