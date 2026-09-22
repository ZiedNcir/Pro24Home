
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import BottomActions from '@shared/ui/action/BottomActions';
import InfoNotice from '@shared/ui/action/InfoNotice';
//import { appNavigate } from '@navigations/navigation';
import { horizontalScale, verticalScale } from '@utils/normalizedCss';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { AppStackType } from '../../../../navigation/constant/core';
import { useGetInterventionPriceQuery } from '@entities/payment/api/payment.api';

export const PriceEstimationScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AppStackType, 'PriceEstimation'>>();
    const [checkWithProfessional, setCheckWithProfessional] = useState(false);
    const { data: price, isLoading: isPriceLoading } = useGetInterventionPriceQuery();

    const priceLabel = price?.minPrice && price?.maxPrice
        ? `${price.minPrice} € – ${price.maxPrice} €`
        : price?.price
            ? `${price.price} €`
            : t('payment.estimate.defaultRange', { min: 50, max: 80 });

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
            <InterventionHeader title={t('payment.estimate.title')} showHelp={false} />

            <PriceBox>
                <PriceIcon>
                    <SvgIcon name="fa-euro-sign" size={18} color="#FF6B00" />
                </PriceIcon>
                <PriceContent>
                    <Text variant="bold" color="black" fontSize={13}>
                        {t('payment.estimate.average')}
                    </Text>
                    {isPriceLoading ? (
                        <ActivityIndicator color="#FF6B00" />
                    ) : (
                        <Text variant="bold" color="black" fontSize={24}>{priceLabel}</Text>
                    )}
                    <Text variant="regularSmall" color="gray600">
                        {t('payment.estimate.range')}
                    </Text>
                </PriceContent>
            </PriceBox>

            <SectionTitle>{t('payment.estimate.confirmation')}</SectionTitle>

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
                        {t('payment.estimate.professionalCheck')}
                    </Text>
                    <Text variant="regularSmall" color="gray600">
                        {t('payment.estimate.beforeIntervention')}
                    </Text>
                </OptionContent>
                <Radio selected={checkWithProfessional} />
            </ProfessionalOption>

            <SectionTitle>{t('payment.estimate.factors')}</SectionTitle>

            <FactorsCard>
                <InfoNotice
                    icon="fa-exclamation-circle"
                    title={t('payment.estimate.complexity')}
                    description={t('payment.estimate.complexityDescription')}
                />

                <InfoNotice
                    icon="fa-tools"
                    title={t('payment.estimate.equipment')}
                    description={t('payment.estimate.equipmentDescription')}
                />

                <InfoNotice
                    icon="fa-clock"
                    title={t('payment.estimate.time')}
                    description={t('payment.estimate.timeDescription')}
                />
            </FactorsCard>

            <FooterNote>
                {t('payment.estimate.disclaimer')}
            </FooterNote>

            <BottomActions
                primaryTitle={t('payment.estimate.understood')}
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
