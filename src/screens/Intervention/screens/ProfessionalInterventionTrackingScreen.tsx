import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import styled from 'styled-components/native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { GOOGLE_PLACES_API_KEY } from '../../../config/googlePlaces';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@store/api/endpoints/intervention';
import { useUpdateStatusMutation, useUpdateInterventionStatusMutation } from '@store/api/endpoints/pro';
import { AppStackType } from '../../../navigation/constant/core';
import { getInterventionAddress, getInterventionClientName } from '../utils/interventionPresentation';

type Coordinates = { latitude: number; longitude: number };
type GeolocationLike = {
    watchPosition: (success: (position: { coords: Coordinates }) => void, error?: (error: unknown) => void, options?: Record<string, unknown>) => number;
    clearWatch: (watchId: number) => void;
};

const DEFAULT_REGION: Region = { latitude: 36.8065, longitude: 10.1815, latitudeDelta: 0.12, longitudeDelta: 0.12 };

const ProfessionalInterventionTrackingScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'ProfessionalInterventionTracking'>>();
    const navigation = useNavigation<any>();
    const mapRef = useRef<MapView>(null);
    const lastStatusUpdate = useRef(0);
    const [professionalPosition, setProfessionalPosition] = useState<Coordinates | null>(null);
    const [eta, setEta] = useState<number | null>(null);
    const [locationError, setLocationError] = useState(false);
    const { data: intervention, isLoading, isError } = useGetInterventionQuery(route.params.intervention_id);
    const [updateStatus] = useUpdateStatusMutation();
    const [updateInterventionStatus, { isLoading: isUpdatingStatus }] = useUpdateInterventionStatusMutation();

    const address = useMemo(() => intervention ? getInterventionAddress(intervention) : undefined, [intervention]);
    const destination = useMemo(() => {
        const latitude = Number(address?.latitude);
        const longitude = Number(address?.longitude);
        return Number.isFinite(latitude) && Number.isFinite(longitude) ? { latitude, longitude } : null;
    }, [address]);

    useEffect(() => {
        let watchId: number | null = null;
        let mounted = true;

        const startWatching = async () => {
            if (Platform.OS === 'android') {
                const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
                if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
                    if (mounted) setLocationError(true);
                    return;
                }
            } else {
                const { request, PERMISSIONS, RESULTS } = await import('react-native-permissions');
                const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
                if (permission !== RESULTS.GRANTED) {
                    if (mounted) setLocationError(true);
                    return;
                }
            }

            const geolocation = (globalThis as { navigator?: { geolocation?: GeolocationLike } }).navigator?.geolocation;
            if (!geolocation) {
                if (mounted) setLocationError(true);
                return;
            }

            watchId = geolocation.watchPosition(position => {
                if (!mounted) return;
                const positionCoordinates = { latitude: Number(position.coords.latitude), longitude: Number(position.coords.longitude) };
                setProfessionalPosition(positionCoordinates);

                const now = Date.now();
                if (now - lastStatusUpdate.current >= 5000) {
                    lastStatusUpdate.current = now;
                    updateStatus({ online: 1, ...positionCoordinates });
                }
            }, () => {
                if (mounted) setLocationError(true);
            }, { enableHighAccuracy: true, distanceFilter: 10, maximumAge: 5000 });
        };

        startWatching().catch(() => {
            if (mounted) setLocationError(true);
        });

        return () => {
            mounted = false;
            if (watchId !== null) {
                geolocationCleanup(watchId);
            }
        };
    }, [updateStatus]);

    useEffect(() => {
        if (professionalPosition && destination) {
            mapRef.current?.fitToCoordinates([professionalPosition, destination], { edgePadding: { top: 150, right: 40, bottom: 280, left: 40 }, animated: true });
        }
    }, [professionalPosition, destination]);

    if (isLoading) return <ScreenContainer mode="light" centered><ActivityIndicator color={colors.primary} /></ScreenContainer>;
    if (isError || !intervention) return <ScreenContainer mode="light" centered><Text variant="regularSmall" color="gray600">Impossible de charger le trajet.</Text></ScreenContainer>;

    const clientName = getInterventionClientName(intervention.client);
    const clientPhone = intervention.client?.phone_number;
    const region = destination ? { ...destination, latitudeDelta: 0.08, longitudeDelta: 0.08 } : DEFAULT_REGION;

    const handleArrived = async () => {
        try {
            await updateInterventionStatus({ interventionId: intervention.id, status: 'in progress' }).unwrap();
        } catch {
            Alert.alert('Mise à jour impossible', 'Le statut n’a pas pu être mis à jour.');
        }
    };

    return <ScreenContainer mode="light" paddingHorizontal={0} paddingVertical={0}>
        <MapWrapper>
            <TrackingMap ref={mapRef} initialRegion={region} showsUserLocation={Boolean(professionalPosition)} showsMyLocationButton showsCompass toolbarEnabled>
                {destination ? <Marker coordinate={destination} pinColor={colors.primary} title="Adresse du client" /> : null}
                {professionalPosition && destination ? <MapViewDirections origin={professionalPosition} destination={destination} apikey={GOOGLE_PLACES_API_KEY} strokeWidth={5} strokeColor={colors.primary} onReady={result => setEta(Math.round(result.duration))} /> : null}
            </TrackingMap>
            <TopBar>
                <BackButton accessibilityRole="button" accessibilityLabel="Retour" onPress={() => navigation.goBack()}><SvgIcon name="arrow-left" size={18} color={colors.black} /></BackButton>
                <TopTitle>Trajet vers le client</TopTitle>
                <MapSpacer />
            </TopBar>
            <InfoCard>
                <Row><Avatar><SvgIcon name="fa-user" size={16} color={colors.primary} /></Avatar><ClientInfo><Text variant="bold" color="black">{clientName || 'Client'}</Text>{clientPhone ? <Text variant="regularSmall" color="gray600">{clientPhone}</Text> : null}</ClientInfo></Row>
                <DestinationText><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{address?.location_name || address?.address || 'Adresse du client'}</Text></DestinationText>
                {locationError ? <WarningText>Activez la localisation pour suivre votre trajet en temps réel.</WarningText> : null}
                {eta !== null ? <EtaText>Arrivée estimée : {eta} min</EtaText> : null}
                <ArrivedButton disabled={isUpdatingStatus} onPress={handleArrived}><Text variant="bold" color={colors.white}>{isUpdatingStatus ? 'Mise à jour...' : 'Je suis arrivé'}</Text></ArrivedButton>
            </InfoCard>
        </MapWrapper>
    </ScreenContainer>;
};

const geolocationCleanup = (watchId: number) => {
    const geolocation = (globalThis as { navigator?: { geolocation?: GeolocationLike } }).navigator?.geolocation;
    geolocation?.clearWatch(watchId);
};

export default ProfessionalInterventionTrackingScreen;

const MapWrapper = styled.View`flex: 1;`;
const TrackingMap = styled(MapView)`flex: 1;`;
const TopBar = styled.View`position: absolute; top: ${verticalScale(18)}px; left: ${horizontalScale(18)}px; right: ${horizontalScale(18)}px; flex-direction: row; align-items: center; justify-content: space-between;`;
const BackButton = styled.TouchableOpacity`width: ${horizontalScale(42)}px; height: ${horizontalScale(42)}px; border-radius: ${horizontalScale(21)}px; background-color: ${colors.white}; align-items: center; justify-content: center; elevation: 4;`;
const TopTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`background-color: ${colors.white}; padding: ${verticalScale(10)}px ${horizontalScale(16)}px; border-radius: ${moderateScale(18)}px;`;
const MapSpacer = styled.View`width: ${horizontalScale(42)}px; height: ${horizontalScale(42)}px;`;
const InfoCard = styled.View`position: absolute; left: ${horizontalScale(18)}px; right: ${horizontalScale(18)}px; bottom: ${verticalScale(22)}px; padding: ${verticalScale(16)}px; border-radius: ${moderateScale(18)}px; background-color: ${colors.white}; elevation: 6;`;
const Row = styled.View`flex-direction: row; align-items: center;`;
const Avatar = styled.View`width: ${horizontalScale(40)}px; height: ${horizontalScale(40)}px; border-radius: ${horizontalScale(20)}px; background-color: #fff1e8; align-items: center; justify-content: center;`;
const ClientInfo = styled.View`margin-left: ${horizontalScale(10)}px;`;
const DestinationText = styled.View`flex-direction: row; align-items: center; margin-top: ${verticalScale(14)}px; gap: ${horizontalScale(10)}px;`;
const WarningText = styled(Text).attrs({ variant: 'regularSmall', color: 'danger' })`margin-top: ${verticalScale(10)}px;`;
const EtaText = styled(Text).attrs({ variant: 'bold', color: 'black' })`margin-top: ${verticalScale(10)}px;`;
const ArrivedButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; margin-top: ${verticalScale(14)}px; border-radius: ${moderateScale(12)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
