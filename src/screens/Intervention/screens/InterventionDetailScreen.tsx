import React from 'react';
import { ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, type RouteProp } from '@react-navigation/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import InterventionHeader from '../components/InterventionHeader';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@store/api/endpoints/intervention';
import { AppStackType } from '../../../navigation/constant/core';
import { getInterventionStatusColor, getInterventionStatusLabel } from '../utils/interventionPresentation';

const InterventionDetailScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'InterventionDetail'>>();
    const { data: intervention, isLoading, isError } = useGetInterventionQuery(route.params.intervention_id);

    if (isLoading) return <ScreenContainer mode="light" centered><ActivityIndicator color={colors.primary} /></ScreenContainer>;
    if (isError || !intervention) return <ScreenContainer mode="light" centered><Text variant="regularSmall" color="gray600">Impossible de charger cette intervention.</Text></ScreenContainer>;

    return (
        <ScreenContainer mode="light" scrollable paddingHorizontal={horizontalScale(18)} paddingVertical={verticalScale(12)} contentContainerStyle={{ paddingBottom: verticalScale(30) }}>
            <InterventionHeader title="Détail de l’intervention" showHelp={false} />
            <StatusBadge background={getInterventionStatusColor(intervention.status)}>
                <Text variant="bold" color="success" fontSize={12}>{getInterventionStatusLabel(intervention.status)}</Text>
            </StatusBadge>
            <Title>{intervention.title}</Title>
            <Section>
                <SectionLabel>Votre demande</SectionLabel>
                <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
            </Section>
            <Section>
                <InfoRow><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.address?.address || 'Adresse non renseignée'}</Text></InfoRow>
                <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.scheduled_date ? new Date(intervention.scheduled_date).toLocaleString('fr-FR') : 'Date à confirmer'}</Text></InfoRow>
            </Section>
            {intervention.professional ? <Section><SectionLabel>Professionnel assigné</SectionLabel><Text variant="regularSmall" color="gray600">{intervention.professional.first_name} {intervention.professional.last_name}</Text></Section> : null}
        </ScreenContainer>
    );
};

export default InterventionDetailScreen;

const StatusBadge = styled.View<{ background: string }>`align-self: flex-start; padding: ${verticalScale(8)}px ${horizontalScale(12)}px; border-radius: ${moderateScale(10)}px; background-color: ${({ background }) => background}; margin-top: ${verticalScale(18)}px;`;
const Title = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 22 })`margin-top: ${verticalScale(12)}px;`;
const Section = styled.View`background-color: ${colors.white}; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: #eeeeee; padding: ${horizontalScale(16)}px; margin-top: ${verticalScale(16)}px;`;
const SectionLabel = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 13 })`margin-bottom: ${verticalScale(10)}px;`;
const InfoRow = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(10)}px; margin-bottom: ${verticalScale(12)}px;`;
