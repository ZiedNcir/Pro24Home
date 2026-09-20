import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import styled from 'styled-components/native';

import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import AppImage from '@shared/ui/image/AppImage';
import type { Intervention } from '@entities/intervention/model';
import { useAddDevisMutation, useAcceptDevisMutation, useReviseDevisMutation } from '@entities/quote/api/quote.api';
import { colors } from '@theme';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { formatDistanceBetweenCoordinates, getInterventionAddress, getInterventionImageUrls, getInterventionPrice, getProfessionalInterventionBrief, isValidInterventionPriceInput, shouldShowClientDevisActions, shouldShowPriceProposal, shouldShowTrackingButton } from '@entities/intervention/model/intervention-presentation';

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
    onOpenTracking?: () => void;
}

const formatDate = (date?: string) => date ? new Date(date).toLocaleString('fr-FR') : 'Date à confirmer';

export const ClientInterventionDetails = ({ intervention }: DetailProps) => {
    const [acceptDevis, { isLoading: isAcceptingDevis }] = useAcceptDevisMutation();
    const [reviseDevis, { isLoading: isRefusingDevis }] = useReviseDevisMutation();
    const address = getInterventionAddress(intervention);
    const latitude = Number(address?.latitude);
    const longitude = Number(address?.longitude);
    const hasCoordinates = Number.isFinite(latitude) && Number.isFinite(longitude);
    const price = getInterventionPrice(intervention);
    const canRespondToDevis = shouldShowClientDevisActions(intervention.price, intervention.status, intervention.id);
    const handleAcceptDevis = async () => {
        try {
            await acceptDevis(intervention.id).unwrap();
            Alert.alert('Prix accepté', 'Le devis a bien été accepté.');
        } catch (error: any) {
            Alert.alert('Action impossible', error?.data?.message || 'Le devis n’a pas pu être accepté.');
        }
    };
    const handleRefuseDevis = async () => {
        try {
            await reviseDevis(intervention.id).unwrap();
            Alert.alert('Prix refusé', 'Le professionnel devra revoir sa proposition.');
        } catch (error: any) {
            Alert.alert('Action impossible', error?.data?.message || 'Le devis n’a pas pu être refusé.');
        }
    };

    return <>
        <Section>
            <SectionLabel>Votre demande</SectionLabel>
            <Text variant="regularSmall" color="gray600">{intervention.description || 'Aucune description renseignée.'}</Text>
        </Section>
        <Section>
            <InfoRow><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{address?.address || 'Adresse non renseignée'}</Text></InfoRow>
            <InfoRow><SvgIcon name="fa-user-clock" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(intervention.scheduled_date || intervention.requested_date)}</Text></InfoRow>
            {price && canRespondToDevis ? <InfoRow><SvgIcon name="fa-euro-sign" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">Prix proposé : {price}</Text></InfoRow> : null}
        </Section>
        {canRespondToDevis ? <DevisActions><DevisActionButton onPress={handleAcceptDevis} disabled={isAcceptingDevis || isRefusingDevis}><Text variant="bold" color={colors.white}>{isAcceptingDevis ? 'Acceptation...' : 'Accepter le prix'}</Text></DevisActionButton><DevisRefuseButton onPress={handleRefuseDevis} disabled={isAcceptingDevis || isRefusingDevis}><Text variant="bold" color={colors.danger}>{isRefusingDevis ? 'Refus...' : 'Refuser le prix'}</Text></DevisRefuseButton></DevisActions> : null}
        {hasCoordinates ? <Section>
            <SectionLabel>Lieu de l’intervention</SectionLabel>
            <ClientMap
                initialRegion={{ latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
                showsCompass={false}
                accessibilityLabel="Carte du lieu de l’intervention"
            >
                <Marker coordinate={{ latitude, longitude }} pinColor={colors.primary} />
            </ClientMap>
        </Section> : null}
        {intervention.professional ? <Section><SectionLabel>Professionnel assigné</SectionLabel><Text variant="regularSmall" color="gray600">{intervention.professional.first_name} {intervention.professional.last_name}</Text></Section> : null}
    </>;
};

export const ProfessionalInterventionDetails = ({ intervention, professionalLatitude, professionalLongitude, isAccepting = false, isRefusing = false, onAccept, onRefuse, onOpenTracking }: DetailProps) => {
    const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
    const [proposedPrice, setProposedPrice] = useState('');
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [addDevis, { isLoading: isSubmittingPrice }] = useAddDevisMutation();
    const address = getInterventionAddress(intervention);
    const imageUrls = getInterventionImageUrls(intervention);
    const price = getInterventionPrice(intervention);
    const brief = getProfessionalInterventionBrief(intervention);
    const priceBrief = brief[3]!;
    const requestedDate = intervention.scheduled_date || intervention.requested_date;
    const canProposePrice = !price && shouldShowPriceProposal(intervention.price, intervention.status);
    const handleSubmitPrice = async () => {
        if (!isValidInterventionPriceInput(proposedPrice)) {
            Alert.alert('Montant invalide', 'Saisissez un prix supérieur à 0 €.');
            return;
        }

        try {
            await addDevis({ interventionId: intervention.id, price: Number(proposedPrice.trim().replace(',', '.')) }).unwrap();
            setProposedPrice('');
            setIsPriceModalVisible(false);
            Alert.alert('Prix envoyé', 'Votre proposition a bien été envoyée au client.');
        } catch (error: any) {
            Alert.alert('Envoi impossible', error?.data?.message || 'Le prix n’a pas pu être envoyé.');
        }
    };

    return <>
        <Timeline accessibilityLabel="Résumé de l’intervention">
            {brief.slice(0, 3).map((item, index) => <TimelineStep key={item.key}>
                <TimelineRail>
                    <TimelineMarker><Text variant="bold" color={colors.white} fontSize={13}>{index + 1}</Text></TimelineMarker>
                    <TimelineLine />
                </TimelineRail>
                <TimelineContent>
                    <TimelineHeading><TimelineIcon><SvgIcon name={item.key === 'client' ? 'fa-user' : item.key === 'location' ? 'fa-map-marker-alt' : 'fa-wrench'} size={17} color={colors.primary} /></TimelineIcon><Text variant="bold" color="black" fontSize={15}>{item.label}</Text></TimelineHeading>
                    <Text variant="regularSmall" color="black">{item.primary}</Text>
                    {item.secondary ? <TimelineSecondary variant="regularSmall" color="gray600">{item.secondary}</TimelineSecondary> : null}
                    {item.key === 'location' ? <TimelineMeta><SvgIcon name="fa-map-marked-alt" size={14} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDistanceBetweenCoordinates(professionalLatitude, professionalLongitude, Number(address?.latitude), Number(address?.longitude))}</Text></TimelineMeta> : null}
                    {item.key === 'request' && requestedDate ? <TimelineMeta><SvgIcon name="fa-user-clock" size={14} color={colors.primary} /><Text variant="regularSmall" color="gray600">{formatDate(requestedDate)}</Text></TimelineMeta> : null}
                </TimelineContent>
            </TimelineStep>)}
            <TimelineStep>
                <TimelineRail>
                    <TimelineMarker><Text variant="bold" color={colors.white} fontSize={13}>4</Text></TimelineMarker>
                    <TimelineLine />
                </TimelineRail>
                <TimelineContent>
                    <TimelineHeading><TimelineIcon><SvgIcon name="image" size={17} color={colors.primary} /></TimelineIcon><Text variant="bold" color="black" fontSize={15}>Photos de l’intervention</Text></TimelineHeading>
                    <ImageGrid>
                        {[0, 1, 2].map(index => {
                            const uri = imageUrls[index];

                            return <ImageTile key={index} onPress={() => uri && setSelectedImageUrl(uri)} disabled={!uri}>
                                {uri ? <TileImage uri={uri} borderRadius={moderateScale(10)} renderLoading={() => <ImageSkeleton />} renderError={() => <ImageFallback><SvgIcon name="image" size={22} color={colors.gray600} /><Text variant="regularSmall" color="gray600">Photo indisponible</Text></ImageFallback>} /> : <ImageFallback><SvgIcon name="image" size={22} color={colors.gray600} /><Text variant="regularSmall" color="gray600">Aucune photo</Text></ImageFallback>}
                            </ImageTile>;
                        })}
                    </ImageGrid>
                </TimelineContent>
            </TimelineStep>
            <TimelineStep>
                <TimelineRail><TimelineMarker><Text variant="bold" color={colors.white} fontSize={13}>5</Text></TimelineMarker></TimelineRail>
                <TimelineContent>
                    <TimelineHeading><TimelineIcon><SvgIcon name="fa-euro-sign" size={17} color={colors.primary} /></TimelineIcon><Text variant="bold" color="black" fontSize={15}>{priceBrief.label}</Text></TimelineHeading>
                    <Text variant="bold" color="black" fontSize={20}>{priceBrief.primary}</Text>
                </TimelineContent>
            </TimelineStep>
        </Timeline>
        <Modal visible={Boolean(selectedImageUrl)} transparent animationType="fade" onRequestClose={() => setSelectedImageUrl(null)}>
            <ImagePreviewBackdrop onPress={() => setSelectedImageUrl(null)}>
                <ImagePreviewClose onPress={() => setSelectedImageUrl(null)} accessibilityRole="button" accessibilityLabel="Fermer l’image">
                    <SvgIcon name="fa-times" size={22} color={colors.white} />
                </ImagePreviewClose>
                {selectedImageUrl ? <ImagePreview source={{ uri: selectedImageUrl }} resizeMode="contain" /> : null}
            </ImagePreviewBackdrop>
        </Modal>
        {canProposePrice ? <PriceButton onPress={() => setIsPriceModalVisible(true)} accessibilityRole="button"><SvgIcon name="fa-euro-sign" size={17} color={colors.white} /><Text variant="bold" color={colors.white}>Proposer un prix</Text></PriceButton> : null}
        {intervention.status === 'pending' ? <Actions><ActionButton disabled={isAccepting || isRefusing} onPress={onAccept}><Text variant="bold" color={colors.white}>{isAccepting ? 'Acceptation...' : 'Accepter la demande'}</Text></ActionButton><RefuseButton disabled={isAccepting || isRefusing} onPress={onRefuse}><Text variant="bold" color={colors.danger}>{isRefusing ? 'Refus...' : 'Refuser la demande'}</Text></RefuseButton></Actions> : null}
        {shouldShowTrackingButton(intervention.status, true) ? <TrackingButton onPress={onOpenTracking} accessibilityRole="button" accessibilityLabel="Ouvrir le trajet"><SvgIcon name="fa-map-marked-alt" size={17} color={colors.white} /><Text variant="bold" color={colors.white}>Ouvrir le trajet</Text></TrackingButton> : null}
        <Modal visible={isPriceModalVisible} transparent animationType="slide" onRequestClose={() => setIsPriceModalVisible(false)}>
            <ModalBackdrop><PriceModalCard><ModalHandle /><Text variant="bold" color="black" fontSize={18}>Proposer un prix</Text><Text variant="regularSmall" color="gray600">Indiquez le montant de votre intervention.</Text><PriceInput value={proposedPrice} onChangeText={setProposedPrice} placeholder="Ex. 75,00" placeholderTextColor={colors.gray500} keyboardType="decimal-pad" autoFocus /><PriceModalActions><CancelButton onPress={() => setIsPriceModalVisible(false)} disabled={isSubmittingPrice}><Text variant="bold" color={colors.gray700}>Annuler</Text></CancelButton><SubmitPriceButton onPress={handleSubmitPrice} disabled={isSubmittingPrice}>{isSubmittingPrice ? <ActivityIndicator color={colors.white} /> : <Text variant="bold" color={colors.white}>Envoyer</Text>}</SubmitPriceButton></PriceModalActions></PriceModalCard></ModalBackdrop>
        </Modal>
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
const DevisActions = styled.View`flex-direction: row; gap: ${horizontalScale(10)}px; margin-top: ${verticalScale(16)}px;`;
const DevisActionButton = styled.TouchableOpacity`flex: 1; min-height: ${verticalScale(48)}px; border-radius: ${moderateScale(13)}px; background-color: ${colors.primary}; align-items: center; justify-content: center; padding: 0 ${horizontalScale(8)}px;`;
const DevisRefuseButton = styled.TouchableOpacity`flex: 1; min-height: ${verticalScale(48)}px; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: ${colors.danger}; align-items: center; justify-content: center; padding: 0 ${horizontalScale(8)}px;`;
const ActionButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const TrackingButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; margin-top: ${verticalScale(12)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; flex-direction: row; gap: ${horizontalScale(8)}px; align-items: center; justify-content: center;`;
const PriceButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; margin-top: ${verticalScale(4)}px; border-radius: ${moderateScale(14)}px; background-color: ${colors.primary}; flex-direction: row; gap: ${horizontalScale(8)}px; align-items: center; justify-content: center;`;
const RefuseButton = styled.TouchableOpacity`height: ${verticalScale(52)}px; border-radius: ${moderateScale(14)}px; border-width: 1px; border-color: ${colors.danger}; align-items: center; justify-content: center;`;
const ImageGrid = styled.View`flex-direction: row; gap: ${horizontalScale(8)}px;`;
const ImageTile = styled.TouchableOpacity`flex: 1; height: ${verticalScale(92)}px; overflow: hidden; border-radius: ${moderateScale(10)}px; background-color: #f5f5f5;`;
const ImageFallback = styled.View`flex: 1; align-items: center; justify-content: center; gap: ${verticalScale(4)}px; padding: ${horizontalScale(4)}px;`;
const ImageSkeleton = styled.View`width: 100%; height: 100%; background-color: ${colors.gray200};`;
const TileImage = styled(AppImage)`width: 100%; height: 100%;`;
const ImagePreviewBackdrop = styled.Pressable`flex: 1; background-color: rgba(0, 0, 0, 0.94); justify-content: center; align-items: center; padding: ${horizontalScale(16)}px;`;
const ImagePreview = styled.Image`width: 100%; height: 82%;`;
const ImagePreviewClose = styled.TouchableOpacity`position: absolute; top: ${verticalScale(44)}px; right: ${horizontalScale(22)}px; z-index: 2; width: ${moderateScale(44)}px; height: ${moderateScale(44)}px; border-radius: ${moderateScale(22)}px; background-color: rgba(255, 255, 255, 0.2); align-items: center; justify-content: center;`;
const Timeline = styled.View`margin-top: ${verticalScale(18)}px; padding: ${verticalScale(4)}px 0;`;
const TimelineStep = styled.View`flex-direction: row; min-height: ${verticalScale(92)}px;`;
const TimelineRail = styled.View`width: ${horizontalScale(48)}px; align-items: center;`;
const TimelineMarker = styled.View`width: ${moderateScale(32)}px; height: ${moderateScale(32)}px; border-radius: ${moderateScale(16)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const TimelineLine = styled.View`width: ${moderateScale(2)}px; flex: 1; margin: ${verticalScale(4)}px 0; background-color: ${colors.primary};`;
const TimelineContent = styled.View`flex: 1; padding-bottom: ${verticalScale(18)}px; border-bottom-width: 1px; border-bottom-color: ${colors.gray200}; margin-bottom: ${verticalScale(14)}px;`;
const TimelineHeading = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(9)}px; margin-bottom: ${verticalScale(8)}px;`;
const TimelineIcon = styled.View`width: ${moderateScale(30)}px; height: ${moderateScale(30)}px; border-radius: ${moderateScale(15)}px; background-color: ${colors.primaryLighter}; align-items: center; justify-content: center;`;
const TimelineSecondary = styled(Text)`margin-top: ${verticalScale(4)}px;`;
const TimelineMeta = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(7)}px; margin-top: ${verticalScale(9)}px;`;
const ClientMap = styled(MapView)`height: ${verticalScale(190)}px; border-radius: ${moderateScale(12)}px; overflow: hidden;`;
const ModalBackdrop = styled.View`flex: 1; justify-content: flex-end; background-color: rgba(0, 0, 0, 0.42);`;
const PriceModalCard = styled.View`background-color: ${colors.white}; border-top-left-radius: ${moderateScale(24)}px; border-top-right-radius: ${moderateScale(24)}px; padding: ${verticalScale(14)}px ${horizontalScale(18)}px ${verticalScale(24)}px;`;
const ModalHandle = styled.View`width: ${horizontalScale(42)}px; height: ${verticalScale(4)}px; border-radius: ${verticalScale(2)}px; background-color: ${colors.gray300}; align-self: center; margin-bottom: ${verticalScale(18)}px;`;
const PriceInput = styled(TextInput)`height: ${verticalScale(52)}px; margin-top: ${verticalScale(18)}px; border-width: 1px; border-color: ${colors.gray300}; border-radius: ${moderateScale(12)}px; padding: 0 ${horizontalScale(14)}px; color: ${colors.black}; font-size: 16px;`;
const PriceModalActions = styled.View`flex-direction: row; gap: ${horizontalScale(10)}px; margin-top: ${verticalScale(18)}px;`;
const CancelButton = styled.TouchableOpacity`flex: 1; height: ${verticalScale(50)}px; border-radius: ${moderateScale(13)}px; border-width: 1px; border-color: ${colors.gray300}; align-items: center; justify-content: center;`;
const SubmitPriceButton = styled.TouchableOpacity`flex: 1; height: ${verticalScale(50)}px; border-radius: ${moderateScale(13)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
