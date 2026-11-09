import { useFindProfessionalsByAddressMutation } from '@store/api/endpoints/client';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '@store/slices/authSlice';
import { localInterventionsApi, useGetLocalInterventionsQuery } from '@entities/intervention/api/local-interventions.api';
import { LocalInterventionStorageError, submitInterventionRequest } from '@entities/intervention/model/local-interventions';

import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { horizontalScale, verticalScale, moderateScale } from '@utils/normalizedCss';
import { useTheme } from '@theme';
import { useNavigation } from '@react-navigation/core';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Toast } from '@core/notifications/toast';
import { useAddInterventionMutation } from '@entities/intervention/api/intervention.api';
import { AppStackType } from '../../../../navigation/constant/core';

export const PaymentTravelFeeScreen = () => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const colors = theme.colors;
    const [selectedCard, setSelectedCard] = useState('main');
    const navigation = useNavigation();
    const route = useRoute<RouteProp<AppStackType, 'PaymentTravelFee'>>();
    const [addIntervention, { isLoading }] = useAddInterventionMutation();
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const localQuery = useGetLocalInterventionsQuery(user?.id ?? 0, { skip: !user });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submitting = useRef(false);
    const recordId = useRef(route.params.localInterventionId || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const createdAt = useRef(new Date().toISOString());
    const [findProfessionals] = useFindProfessionalsByAddressMutation();
    const checkPriceWithProfessional = route.params?.checkPriceWithProfessional;

    const handlePayment = async () => {
        if (!user || submitting.current) return;
        submitting.current = true;
        setIsSubmitting(true);
        try {
            const existing = localQuery.currentData?.find(item => item.id === recordId.current);
            const result = await submitInterventionRequest({
                userId: user.id,
                record: existing || {
                    id: recordId.current,
                    createdAt: createdAt.current,
                    payload: route.params.intervention,
                    snapshot: route.params.snapshot || { serviceName: route.params.intervention.title },
                    checkPriceWithProfessional,
                },
                findProfessionals: location => findProfessionals(location).unwrap(),
                submit: payload => addIntervention(payload).unwrap(),
            });
            dispatch(localInterventionsApi.util.invalidateTags([{ type: 'LocalInterventions', id: user.id }]));
            if (result === 'unavailable') {
                Toast.show(t('intervention.local.saved'), { type: 'warning', placement: 'bottom' });
                (navigation as any).replace('InterventionDetail', { intervention_id: 0, localInterventionId: recordId.current });
            } else {
                (navigation as any).navigate('InterventionSuccess');
            }
        } catch (error: any) {
            Toast.show(error instanceof LocalInterventionStorageError ? t('intervention.local.saveFailed') : error?.data?.message || error?.message || t('payment.travel.failed'), {
                type: 'danger',
                placement: 'bottom',
            });
        } finally {
            submitting.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <ScreenContainer
            paddingHorizontal={horizontalScale(18)}
            paddingVertical={verticalScale(12)}
        >
            <InterventionHeader title={t('payment.travel.title')} showHelp={false} />

            <HeroIcon>
                <SvgIcon name="fa-credit-card" size={42} color={colors.primary} />
            </HeroIcon>

            <Title>{t('payment.travel.confirmRequest')}</Title>

            <Description>
                {t('payment.travel.description')}
            </Description>

            {checkPriceWithProfessional ? (
                <ProfessionalNote>
                    <SvgIcon name="fa-user-check" size={16} color={colors.primary} />
                    <Text variant="regularSmall" color="gray700">
                        {t('payment.travel.proReview')}
                    </Text>
                </ProfessionalNote>
            ) : null}

            <FeeCard>
                <Text variant="bold" color="black" fontSize={15}>
                    {t('payment.travel.fee')}
                </Text>
                <Text variant="bold" color="black" fontSize={24}>
                    20 €
                </Text>
            </FeeCard>

            <SecureRow>
                <SvgIcon name="fa-lock" size={12} color={colors.gray600} />
                <Text variant="regularSmall" color="gray600">
                    {t('payment.travel.secure')}
                </Text>
            </SecureRow>

            <SectionLabel>{t('payment.travel.method')}</SectionLabel>

            <PaymentOption
                selected={selectedCard === 'main'}
                onPress={() => setSelectedCard('main')}
            >
                <SvgIcon name="fa-credit-card" size={20} color={colors.primary} />
                <PaymentText>
                    <Text variant="bold" color="black" fontSize={13}>
                        {t('payment.travel.card')}
                    </Text>
                    <Text variant="regularSmall" color="gray600">
                        {t('payment.travel.sampleCard')}
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
                        {t('payment.travel.otherCard')}
                    </Text>
                </PaymentText>
                <Radio selected={selectedCard === 'other'} />
            </PaymentOption>

            <Spacer />

            <PayButton onPress={handlePayment} disabled={isLoading || isSubmitting}>
                {isLoading || isSubmitting ? <ActivityIndicator color={colors.textInverse} /> : <Text variant="bold" color="white" fontSize={14}>{t('payment.travel.payAmount', { amount: '20 €' })}</Text>}
            </PayButton>
        </ScreenContainer>
    );
};


const HeroIcon = styled.View`
  align-self: center;
  width: ${horizontalScale(82)}px;
  height: ${horizontalScale(82)}px;
  border-radius: ${horizontalScale(41)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  justify-content: center;
  align-items: center;
  margin-top: ${verticalScale(30)}px;
`;

const Title = styled(Text).attrs(({ theme }) => ({
    variant: 'bold',
    color: theme.colors.textPrimary,
    fontSize: 17,
}))`
  text-align: center;
  margin-top: ${verticalScale(20)}px;
`;

const Description = styled(Text).attrs(({ theme }) => ({
    variant: 'regularSmall',
    color: theme.colors.textSecondary,
}))`
  text-align: center;
  margin-top: ${verticalScale(12)}px;
  line-height: 18px;
`;

const FeeCard = styled.View`
  height: ${verticalScale(66)}px;
  border-radius: ${moderateScale(14)}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin-top: ${verticalScale(24)}px;
  padding-horizontal: ${horizontalScale(16)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.surface};
`;

const ProfessionalNote = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(8)}px;
  margin-top: ${verticalScale(14)}px;
  padding: ${horizontalScale(12)}px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
`;

const SecureRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
  margin-top: ${verticalScale(12)}px;
`;

const SectionLabel = styled(Text).attrs(({ theme }) => ({
    variant: 'bold',
    color: theme.colors.textPrimary,
    fontSize: 13,
}))`
  margin-top: ${verticalScale(24)}px;
  margin-bottom: ${verticalScale(10)}px;
`;

const PaymentOption = styled.TouchableOpacity<{ selected: boolean }>`
  min-height: ${verticalScale(56)}px;
  border-radius: 12px;
  border-width: 1px;
  border-color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primaryLighter : theme.colors.surface)};
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
  border-color: ${({ selected, theme }) => (selected ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ selected, theme }) => (selected ? theme.colors.primary : 'transparent')};
`;

const Spacer = styled.View`
  flex: 1;
`;

const PayButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  height: ${verticalScale(52)}px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
