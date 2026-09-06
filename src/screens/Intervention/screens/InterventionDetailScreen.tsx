import React from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import InterventionHeader from '../components/InterventionHeader';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@store/api/endpoints/intervention';
import { useAcceptInterventionMutation, useReviseInterventionMutation } from '@store/api/endpoints/pro';
import { selectIsProfessional, selectUser } from '@store/slices/authSlice';
import { AppStackType } from '../../../navigation/constant/core';
import { formatDistanceBetweenCoordinates, getInterventionDetailCopy, getInterventionStatusColor, getInterventionStatusLabel } from '../utils/interventionPresentation';

const InterventionDetailScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'InterventionDetail'>>();
    const isProfessional = useSelector(selectIsProfessional);
    const user = useSelector(selectUser);
    const { data: intervention, isLoading, isError } = useGetInterventionQuery(route.params.intervention_id);
    const [acceptIntervention, { isLoading: isAccepting }] = useAcceptInterventionMutation();
    const [reviseIntervention, { isLoading: isRefusing }] = useReviseInterventionMutation();
    const copy = getInterventionDetailCopy(isProfessional);

    const handleAccept = async () => {
        try {
            await acceptIntervention(route.params.intervention_id).unwrap();
        } catch {
            // The API error is surfaced by the existing global request handling.
        }
    };

    const handleRefuse = () => {
        Alert.alert('Refuser cette demande ?', 'Cette demande ne sera plus proposée dans votre liste.', [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Refuser', style: 'destructive', onPress: () => reviseIntervention(route.params.intervention_id) },
        ]);
    };

    if (isLoading) return <ScreenContainer mode="light" centered><ActivityIndicator color={colors.primary} /></ScreenContainer>;
    if (isError || !intervention) return <ScreenContainer mode="light" centered><Text variant="regularSmall" color="gray600">Impossible de charger cette intervention.</Text></ScreenContainer>;

    return (
        <ScreenContainer mode="light" scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)} contentContainerStyle={{ paddingBottom: verticalScale(30) }}>
            <InterventionHeader title={copy.title} showHelp={false} />
            <StatusBadge background={getInterventionStatusColor(intervention.status)}>
                <Text variant="bold" color="success" fontSize={12}>{getInterventionStatusLabel(intervention.status)}</Text>
            </StatusBadge>
            <Title>{intervention.title}</Title>
            <Section>
                <SectionLabel>{copy.section}</SectionLabel>
                <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
            </Section>
            <Section>
                {!isProfessional ? <InfoRow><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.address?.address || 'Adresse non renseignée'}</Text></InfoRow> : null}
                <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.scheduled_date ? new Date(intervention.scheduled_date).toLocaleString('fr-FR') : 'Date à confirmer'}</Text></InfoRow>
            </Section>
            {isProfessional ? <Section><SectionLabel>Informations de la demande</SectionLabel><InfoRow><SvgIcon name="fa-map-marked-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDistanceBetweenCoordinates(user?.professional?.latitude, user?.professional?.longitude, intervention.address?.latitude, intervention.address?.longitude)}</Text></InfoRow><InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color={colors.gray600}>{intervention.scheduled_date || intervention.requested_date ? new Date(intervention.scheduled_date || intervention.requested_date).toLocaleString('fr-FR') : 'Date à confirmer'}</Text></InfoRow>{intervention.service ? <InfoRow><SvgIcon name="fa-wrench" size={16} color={colors.primary} /><Text variant="regularSmall" color={colors.gray600}>{intervention.service.name}{intervention.sub_service?.name ? ` · ${intervention.sub_service.name}` : ''}</Text></InfoRow> : null}{intervention.price !== null && intervention.price !== undefined ? <InfoRow><SvgIcon name="fa-euro-sign" size={16} color={colors.primary} /><Text variant="regularSmall" color={colors.gray600}>{intervention.price.toFixed(2)} €</Text></InfoRow> : null}</Section> : null}
            {!isProfessional && intervention.professional ? <Section><SectionLabel>Professionnel assigné</SectionLabel><Text variant="regularSmall" color="gray600">{intervention.professional.first_name} {intervention.professional.last_name}</Text></Section> : null}
            {isProfessional && intervention.status === 'pending' ? <Actions><ActionButton disabled={isAccepting || isRefusing} onPress={handleAccept}><Text variant="bold" color={colors.white}>{isAccepting ? 'Acceptation...' : 'Accepter la demande'}</Text></ActionButton><RefuseButton disabled={isAccepting || isRefusing} onPress={handleRefuse}><Text variant="bold" color={colors.danger}>{isRefusing ? 'Refus...' : 'Refuser la demande'}</Text></RefuseButton></Actions> : null}
        </ScreenContainer>
    );
};

export default InterventionDetailScreen;

const StatusBadge = styled.View<{ background: string }>`align-self: flex-start; padding: ${verticalScale(8)}px ${horizontalScale(12)}px; border-radius: ${moderateScale(10)}px; background-color: ${({ background }) => background}; margin-top: ${verticalScale(18)}px;`;
const Title = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 22 })`margin-top: ${verticalScale(12)}px;`;
const Section = styled.View`background-color: ${colors.white}; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: #eeeeee; padding: ${horizontalScale(16)}px; margin-top: ${verticalScale(16)}px;`;
const SectionLabel = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })`margin-bottom: ${verticalScale(10)}px;`;
const InfoRow = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px; margin-bottom: ${verticalScale(12)}px;`;
const Actions = styled.View`margin-top: ${verticalScale(20)}px; gap: ${verticalScale(10)}px;`;
const ActionButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const RefuseButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: ${colors.danger}; align-items: center; justify-content: center;`;
