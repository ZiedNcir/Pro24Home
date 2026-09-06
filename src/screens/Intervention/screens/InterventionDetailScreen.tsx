import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import InterventionHeader from '../components/InterventionHeader';
import { ClientInterventionDetails, confirmRefusal, ProfessionalInterventionDetails } from '../components/intervention-detail/InterventionDetailSections';
import { colors } from '@theme/index';
import { moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@store/api/endpoints/intervention';
import { useAcceptInterventionMutation, useReviseInterventionMutation } from '@store/api/endpoints/pro';
import { selectIsProfessional, selectUser } from '@store/slices/authSlice';
import { normalizeInterventionResponse } from '@store/api/utils/interventionResponse';
import { AppStackType } from '../../../navigation/constant/core';
import { getInterventionDetailCopy, getInterventionStatusColor, getInterventionStatusLabel } from '../utils/interventionPresentation';

const InterventionDetailScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'InterventionDetail'>>();
    const isProfessional = useSelector(selectIsProfessional);
    const user = useSelector(selectUser);
    const { data: intervention, isLoading, isError } = useGetInterventionQuery(route.params.intervention_id);
    const [acceptIntervention, { isLoading: isAccepting }] = useAcceptInterventionMutation();
    const [reviseIntervention, { isLoading: isRefusing }] = useReviseInterventionMutation();

    if (isLoading) return <ScreenContainer mode="light" centered><ActivityIndicator color={colors.primary} /></ScreenContainer>;
    if (isError || !intervention) return <ScreenContainer mode="light" centered><Text variant="regularSmall" color="gray600">Impossible de charger cette intervention.</Text></ScreenContainer>;

    const detailIntervention = normalizeInterventionResponse(intervention);
    const copy = getInterventionDetailCopy(isProfessional);
    const handleAccept = async () => {
        try {
            await acceptIntervention(detailIntervention.id).unwrap();
        } catch {
            // The request error is handled by the API layer.
        }
    };
    const handleRefuse = () => confirmRefusal(() => { reviseIntervention(detailIntervention.id); });

    return (
        <ScreenContainer mode="light" scrollable paddingHorizontal={18} paddingVertical={12} contentContainerStyle={{ paddingBottom: verticalScale(30) }}>
            <InterventionHeader title={copy.title} showHelp={false} />
            <StatusBadge background={getInterventionStatusColor(detailIntervention.status)}><Text variant="bold" color="success" fontSize={12}>{getInterventionStatusLabel(detailIntervention.status)}</Text></StatusBadge>
            <Title>{detailIntervention.title}</Title>
            {isProfessional ? <ProfessionalInterventionDetails intervention={detailIntervention} professionalLatitude={user?.professional?.latitude} professionalLongitude={user?.professional?.longitude} isAccepting={isAccepting} isRefusing={isRefusing} onAccept={handleAccept} onRefuse={handleRefuse} /> : <ClientInterventionDetails intervention={detailIntervention} />}
        </ScreenContainer>
    );
};

export default InterventionDetailScreen;

const StatusBadge = styled.View<{ background: string }>`align-self: flex-start; padding: ${verticalScale(8)}px ${moderateScale(12)}px; border-radius: ${moderateScale(10)}px; background-color: ${({ background }) => background}; margin-top: ${verticalScale(18)}px;`;
const Title = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 22 })`margin-top: ${verticalScale(12)}px;`;
