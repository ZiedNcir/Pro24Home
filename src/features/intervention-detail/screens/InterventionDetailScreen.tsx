import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { colors } from '@theme';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import { ClientInterventionDetails, confirmRefusal, ProfessionalInterventionDetails } from '../ui/intervention-detail/InterventionDetailSections';
import InterventionDetailSkeleton from '../ui/intervention-detail/InterventionDetailSkeleton';
import ClientRatingModal from '../ui/intervention-detail/ClientRatingModal';
import { moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@entities/intervention/api/intervention.api';
import { useAddRatingMutation } from '@entities/intervention/api/intervention.api';
import {
    useAcceptInterventionMutation,
    useReviseInterventionMutation,
} from '@entities/intervention/api/intervention-actions.api';
import { selectIsProfessional, selectUser } from '@store/slices/authSlice';
import { normalizeInterventionResponse } from '@entities/intervention/model';
import { AppStackType } from '../../../navigation/constant/core';
import { getInterventionDetailCopy, getInterventionStatusColor, getInterventionStatusLabel, shouldShowRatingPrompt } from '@entities/intervention/model/intervention-presentation';

const InterventionDetailScreen = () => {
    const { t } = useTranslation();
    const route = useRoute<RouteProp<AppStackType, 'InterventionDetail'>>();
    const navigation = useNavigation<any>();
    const isProfessional = useSelector(selectIsProfessional);
    const user = useSelector(selectUser);
    const { data: intervention, isLoading, isError } = useGetInterventionQuery(route.params.intervention_id);
    const [acceptIntervention, { isLoading: isAccepting }] = useAcceptInterventionMutation();
    const [reviseIntervention, { isLoading: isRefusing }] = useReviseInterventionMutation();
    const [addRating, { isLoading: isSubmittingRating }] = useAddRatingMutation();
    const [isRatingVisible, setIsRatingVisible] = useState(false);

    if (isLoading) return <InterventionDetailSkeleton />;
    if (isError || !intervention) return <ScreenContainer centered><Text variant="regularSmall" color="gray600">{t('intervention.detail.loadFailed')}</Text></ScreenContainer>;

    const detailIntervention = normalizeInterventionResponse(intervention);
    const copy = getInterventionDetailCopy(isProfessional);
    const handleAccept = async () => {
        try {
            await acceptIntervention(detailIntervention.id).unwrap();
            if (isProfessional) {
                (navigation as any).replace('ProfessionalInterventionTracking', { intervention_id: detailIntervention.id });
            }
        } catch {
            // The request error is handled by the API layer.
        }
    };
    const handleRefuse = () => confirmRefusal(() => { reviseIntervention(detailIntervention.id); }, t);
    const handleOpenTracking = () => navigation.navigate('ProfessionalInterventionTracking', { intervention_id: detailIntervention.id });
    const handleRatingSubmit = async (rating: number, comment: string) => {
        try {
            await addRating({ intervention_id: detailIntervention.id, rating, ...(comment ? { comment } : {}) }).unwrap();
            setIsRatingVisible(false);
            Alert.alert(t('intervention.detail.ratingThanks'), t('intervention.detail.ratingSent'));
        } catch {
            Alert.alert(t('intervention.detail.sendFailed'), t('intervention.detail.ratingFailed'));
        }
    };

    return (
        <>
            <ScreenContainer scrollable paddingHorizontal={18} paddingVertical={12} contentContainerStyle={{ paddingBottom: verticalScale(30) }}>
                <InterventionHeader title={copy.title} showHelp={false} />
                <StatusRow>
                    <StatusBadge background={getInterventionStatusColor(detailIntervention.status)}><Text variant="bold" color="success" fontSize={12}>{getInterventionStatusLabel(detailIntervention.status)}</Text></StatusBadge>
                    {!isProfessional && shouldShowRatingPrompt(detailIntervention.status, detailIntervention.rating, false) ? <RateButton onPress={() => setIsRatingVisible(true)} accessibilityRole="button" accessibilityLabel={t('intervention.detail.rate')}><Text variant="bold" color={colors.primary} fontSize={12}>{t('intervention.detail.rate')}</Text><SvgIcon name="fa-star" size={14} color={colors.primary} /></RateButton> : null}
                </StatusRow>
                <Title>{detailIntervention.title}</Title>
                {isProfessional ? <ProfessionalInterventionDetails intervention={detailIntervention} professionalLatitude={user?.professional?.latitude} professionalLongitude={user?.professional?.longitude} isAccepting={isAccepting} isRefusing={isRefusing} onAccept={handleAccept} onRefuse={handleRefuse} onOpenTracking={handleOpenTracking} /> : <ClientInterventionDetails intervention={detailIntervention} />}
            </ScreenContainer>
            <ClientRatingModal
                visible={isRatingVisible && shouldShowRatingPrompt(detailIntervention.status, detailIntervention.rating, isProfessional)}
                professionalName={detailIntervention.professional ? `${detailIntervention.professional.first_name} ${detailIntervention.professional.last_name}`.trim() : undefined}
                isSubmitting={isSubmittingRating}
                onClose={() => setIsRatingVisible(false)}
                onSubmit={handleRatingSubmit}
            />
        </>
    );
};

export default InterventionDetailScreen;

const StatusRow = styled.View`flex-direction: row; align-items: center; justify-content: space-between; margin-top: ${verticalScale(18)}px;`;
const StatusBadge = styled.View<{ background: string }>`align-self: flex-start; padding: ${verticalScale(8)}px ${moderateScale(12)}px; border-radius: ${moderateScale(10)}px; background-color: ${({ background }) => background};`;
const RateButton = styled.Pressable`min-height: ${verticalScale(38)}px; padding: 0 ${moderateScale(12)}px; border-width: 1px; border-color: ${colors.primary}; border-radius: ${moderateScale(12)}px; flex-direction: row; align-items: center; justify-content: center; gap: ${moderateScale(7)}px;`;
const Title = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 22 })`margin-top: ${verticalScale(12)}px;`;
