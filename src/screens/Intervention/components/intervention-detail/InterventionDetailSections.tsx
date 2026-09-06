import React from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';

import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import AppImage from '@components/Image/AppImage';
import type { Intervention } from '@store/api/api.types';
import { API_BASE_URL } from '@config/api';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { formatDistanceBetweenCoordinates, formatInterventionPrice, getInterventionAddress, getInterventionClientName, getInterventionImageUrls } from '../../utils/interventionPresentation';

type InterventionDetailData = Omit<Intervention, 'address' | 'price'> & {
    address?: Intervention['address'];
    adress?: Intervention['address'] & { latitude?: number | string; longitude?: number | string };
    price?: number | string | null;
};

interface DetailProps {
    intervention: InterventionDetailData;
    professionalLatitude?: number | string;
    professionalLongitude?: number | string;
    isAccepting?: boolean;
    isRefusing?: boolean;
    onAccept?: () => Promise<void>;
    onRefuse?: () => void;
}

const formatDate = (date?: string) => date ? new Date(date).toLocaleString('fr-FR') : 'Date à confirmer';

export const ClientInterventionDetails = ({ intervention }: DetailProps) => {
    const address = getInterventionAddress(intervention);

    return <>
        <Section>
            <SectionLabel>Votre demande</SectionLabel>
            <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
        </Section>
        <Section>
            <InfoRow><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{address?.address || 'Adresse non renseignée'}</Text></InfoRow>
            <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(intervention.scheduled_date || intervention.requested_date)}</Text></InfoRow>
        </Section>
        {intervention.professional ? <Section><SectionLabel>Professionnel assigné</SectionLabel><Text variant="regularSmall" color="gray600">{intervention.professional.first_name} {intervention.professional.last_name}</Text></Section> : null}
    </>;
};

export const ProfessionalInterventionDetails = ({ intervention, professionalLatitude, professionalLongitude, isAccepting = false, isRefusing = false, onAccept, onRefuse }: DetailProps) => {
    const address = getInterventionAddress(intervention);
    const clientName = getInterventionClientName(intervention.client);
    const imageUrls = getInterventionImageUrls(intervention);
    const price = formatInterventionPrice(intervention.price);
    const requestedDate = intervention.scheduled_date || intervention.requested_date;

    return <>
        <Section>
            <SectionLabel>Détails de la demande</SectionLabel>
            <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
        </Section>
        {clientName ? <Section>
            <SectionLabel>Client</SectionLabel>
            <InfoRow><SvgIcon name="fa-user" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{clientName}</Text></InfoRow>
        </Section> : null}
        <Section>
            <SectionLabel>Photos de l’intervention</SectionLabel>
            <ImageGrid>
                {[0, 1, 2].map(index => {
                    const imageUrl = imageUrls[index];
                    const uri = imageUrl && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') ? imageUrl : `${API_BASE_URL}/${imageUrl.replace(/^\//, '')}`);

                    return <ImageTile key={index}>
                        {uri ? <TileImage uri={uri} borderRadius={moderateScale(10)} showLoader={false} renderError={() => <ImageFallback><SvgIcon name="fa-image" size={22} color={colors.gray600} /><Text variant="regularSmall" color="gray600">Photo indisponible</Text></ImageFallback>} /> : <ImageFallback><SvgIcon name="fa-image" size={22} color={colors.gray600} /><Text variant="regularSmall" color="gray600">Aucune photo</Text></ImageFallback>}
                    </ImageTile>;
                })}
            </ImageGrid>
        </Section>
        <Section>
            <InfoRow><SvgIcon name="fa-map-marked-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDistanceBetweenCoordinates(professionalLatitude, professionalLongitude, Number(address?.latitude), Number(address?.longitude))}</Text></InfoRow>
            {requestedDate ? <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(requestedDate)}</Text></InfoRow> : null}
            <InfoRow><SvgIcon name="fa-wrench" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{intervention.service?.name || intervention.title}</Text></InfoRow>
            {price ? <InfoRow><SvgIcon name="fa-euro-sign" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{price}</Text></InfoRow> : null}
        </Section>
        {intervention.status === 'pending' ? <Actions><ActionButton disabled={isAccepting || isRefusing} onPress={onAccept}><Text variant="bold" color={colors.white}>{isAccepting ? 'Acceptation...' : 'Accepter la demande'}</Text></ActionButton><RefuseButton disabled={isAccepting || isRefusing} onPress={onRefuse}><Text variant="bold" color={colors.danger}>{isRefusing ? 'Refus...' : 'Refuser la demande'}</Text></RefuseButton></Actions> : null}
    </>;
};

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
const ImageGrid = styled.View`flex-direction: row; gap: ${horizontalScale(8)}px;`;
const ImageTile = styled.View`flex: 1; height: ${verticalScale(92)}px; overflow: hidden; border-radius: ${moderateScale(10)}px; background-color: #f5f5f5;`;
const ImageFallback = styled.View`flex: 1; align-items: center; justify-content: center; gap: ${verticalScale(4)}px; padding: ${horizontalScale(4)}px;`;
const TileImage = styled(AppImage)`width: 100%; height: 100%;`;
