import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import type { Intervention } from '@store/api/api.types';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { formatDistanceBetweenCoordinates } from '../../utils/interventionPresentation';

interface DetailProps {
    intervention: Intervention;
    professionalLatitude?: number;
    professionalLongitude?: number;
    isAccepting?: boolean;
    isRefusing?: boolean;
    onAccept?: () => Promise<void>;
    onRefuse?: () => void;
}

const formatDate = (date?: string) => date ? new Date(date).toLocaleString('fr-FR') : 'Date à confirmer';

export const ClientInterventionDetails = ({ intervention }: DetailProps) => (
    <>
        <Section>
            <SectionLabel>Votre demande</SectionLabel>
            <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
        </Section>
        <Section>
            <InfoRow><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.address?.address || 'Adresse non renseignée'}</Text></InfoRow>
            <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(intervention.scheduled_date || intervention.requested_date)}</Text></InfoRow>
        </Section>
        {intervention.professional ? <Section><SectionLabel>Professionnel assigné</SectionLabel><Text variant="regularSmall" color="gray600">{intervention.professional.first_name} {intervention.professional.last_name}</Text></Section> : null}
    </>
);

export const ProfessionalInterventionDetails = ({ intervention, professionalLatitude, professionalLongitude, isAccepting = false, isRefusing = false, onAccept, onRefuse }: DetailProps) => (
    <>
        <Section>
            <SectionLabel>Détails de la demande</SectionLabel>
            <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
        </Section>
        <Section>
            <InfoRow><SvgIcon name="fa-map-marked-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDistanceBetweenCoordinates(professionalLatitude, professionalLongitude, intervention.address?.latitude, intervention.address?.longitude)}</Text></InfoRow>
            <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(intervention.scheduled_date || intervention.requested_date)}</Text></InfoRow>
            {intervention.service ? <InfoRow><SvgIcon name="fa-wrench" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.service.name}{intervention.sub_service?.name ? ` · ${intervention.sub_service.name}` : ''}</Text></InfoRow> : null}
            {intervention.price !== null && intervention.price !== undefined ? <InfoRow><SvgIcon name="fa-euro-sign" size={16} color={colors.primary} /><Text variant="regularSmall" color={colors.gray600}>{intervention.price.toFixed(2)} €</Text></InfoRow> : null}
        </Section>
        {intervention.status === 'pending' ? <Actions><ActionButton disabled={isAccepting || isRefusing} onPress={onAccept}><Text variant="bold" color={colors.white}>{isAccepting ? 'Acceptation...' : 'Accepter la demande'}</Text></ActionButton><RefuseButton disabled={isAccepting || isRefusing} onPress={onRefuse}><Text variant="bold" color={colors.danger}>{isRefusing ? 'Refus...' : 'Refuser la demande'}</Text></RefuseButton></Actions> : null}
    </>
);

export const confirmRefusal = (onConfirm: () => void) => Alert.alert('Refuser cette demande ?', 'Cette demande ne sera plus proposée dans votre liste.', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Refuser', style: 'destructive', onPress: onConfirm },
]);

const Section = styled.View`background-color: ${colors.white}; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: #eeeeee; padding: ${horizontalScale(16)}px; margin-top: ${verticalScale(16)}px;`;
const SectionLabel = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })`margin-bottom: ${verticalScale(10)}px;`;
const InfoRow = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px; margin-bottom: ${verticalScale(12)}px;`;
const Actions = styled.View`margin-top: ${verticalScale(20)}px; gap: ${verticalScale(10)}px;`;
const ActionButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const RefuseButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: ${colors.danger}; align-items: center; justify-content: center;`;
