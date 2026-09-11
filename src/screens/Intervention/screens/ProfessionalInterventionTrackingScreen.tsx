import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import styled from 'styled-components/native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';

import ScreenContainer from '@components/ScreenContainer';
import Text from '@components/Text';
import { SvgIcon } from '@components/Icon';
import { GOOGLE_DIRECTIONS_API_KEY } from '../../../config/googlePlaces';
import { colors } from '@theme/index';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@store/api/endpoints/intervention';
import { useUpdateStatusMutation, useUpdateInterventionStatusMutation } from '@store/api/endpoints/pro';
import { AppStackType } from '../../../navigation/constant/core';
import { getInterventionAddress, getInterventionClientName } from '../utils/interventionPresentation';
import { formatRouteDistance, getRouteFitCoordinates } from '../utils/routePresentation';

type Coordinates = { latitude: number; longitude: number };

const DEFAULT_REGION: Region = { latitude: 36.8065, longitude: 10.1815, latitudeDelta: 0.12, longitudeDelta: 0.12 };

const ProfessionalInterventionTrackingScreen = () => {
    const route = useRoute<RouteProp<AppStackType, 'ProfessionalInterventionTracking'>>();
    const navigation = useNavigation<any>();
    const mapRef = useRef<MapView>(null);
    const lastStatusUpdate = useRef(0);
    const isProgrammaticCameraChange = useRef(false);
    const [professionalPosition, setProfessionalPosition] = useState<Coordinates | null>(null);
    const [eta, setEta] = useState<number | null>(null);
    const [routeDistance, setRouteDistance] = useState<number | null>(null);
    const [isTripStarted, setIsTripStarted] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [routeError, setRouteError] = useState(false);
    const [isFollowingRoute, setIsFollowingRoute] = useState(true);
    const [mapType, setMapType] = useState<'standard' | 'satellite' | 'hybrid' | 'terrain'>('standard');
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

            watchId = Geolocation.watchPosition(position => {
                if (!mounted) return;
                const positionCoordinates = { latitude: Number(position.coords.latitude), longitude: Number(position.coords.longitude) };
                setProfessionalPosition(positionCoordinates);

                const now = Date.now();
                if (now - lastStatusUpdate.current >= 5000) {
                    lastStatusUpdate.current = now;
                    updateStatus({ onligne: 1, ...positionCoordinates });
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
        if (isFollowingRoute) {
            const coordinates = getRouteFitCoordinates(professionalPosition, destination);
            if (coordinates) {
                isProgrammaticCameraChange.current = true;
                mapRef.current?.fitToCoordinates(coordinates, { edgePadding: { top: 150, right: 70, bottom: 300, left: 40 }, animated: true });
            }
        }
    }, [professionalPosition, destination, isFollowingRoute]);

    if (isLoading) return <ScreenContainer mode="light" centered><ActivityIndicator color={colors.primary} /></ScreenContainer>;
    if (isError || !intervention) return <ScreenContainer mode="light" centered><Text variant="regularSmall" color="gray600">Impossible de charger le trajet.</Text></ScreenContainer>;

    const clientName = getInterventionClientName(intervention.client);
    const clientPhone = intervention.client?.phone_number;
    const region = destination ? { ...destination, latitudeDelta: 0.08, longitudeDelta: 0.08 } : DEFAULT_REGION;

    const handleTripAction = async () => {
        try {
            await updateInterventionStatus({ interventionId: intervention.id, status: 'in progress' }).unwrap();
            setIsTripStarted(true);
        } catch {
            Alert.alert('Mise à jour impossible', 'Le statut n’a pas pu être mis à jour.');
        }
    };

    const handleUserLocationChange = (event: { nativeEvent: { coordinate?: Coordinates } }) => {
        const coordinate = event.nativeEvent.coordinate;
        if (!coordinate || !Number.isFinite(coordinate.latitude) || !Number.isFinite(coordinate.longitude)) return;
        setProfessionalPosition(coordinate);
    };

    const fitRoute = () => {
        const coordinates = getRouteFitCoordinates(professionalPosition, destination);
        if (!coordinates) return;
        setIsFollowingRoute(true);
        isProgrammaticCameraChange.current = true;
        mapRef.current?.fitToCoordinates(coordinates, { edgePadding: { top: 150, right: 70, bottom: 300, left: 40 }, animated: true });
    };

    const recenterOnProfessional = () => {
        if (!professionalPosition) return;
        setIsFollowingRoute(false);
        mapRef.current?.animateToRegion({ ...professionalPosition, latitudeDelta: 0.015, longitudeDelta: 0.015 }, 350);
    };

    const cycleMapType = () => {
        const types: Array<typeof mapType> = ['standard', 'satellite', 'hybrid', 'terrain'];
        setMapType(types[(types.indexOf(mapType) + 1) % types.length] ?? 'standard');
    };

    return <ScreenContainer mode="light" paddingHorizontal={0} paddingVertical={0}>
        <MapWrapper>
            <TrackingMap ref={mapRef} initialRegion={region} mapType={mapType} customMapStyle={mapType === 'standard' ? PRO24_MAP_STYLE : undefined} showsUserLocation onUserLocationChange={handleUserLocationChange} showsMyLocationButton showsCompass toolbarEnabled onRegionChangeComplete={() => { if (isProgrammaticCameraChange.current) { isProgrammaticCameraChange.current = false; return; } setIsFollowingRoute(false); }}>
                {professionalPosition ? <Marker coordinate={professionalPosition} pinColor="#1E88E5" title="Ma position" /> : null}
                {destination ? <Marker coordinate={destination} pinColor={colors.primary} title="Destination client" description={address?.address} /> : null}
                {professionalPosition && destination ? <MapViewDirections origin={professionalPosition} destination={destination} apikey={GOOGLE_DIRECTIONS_API_KEY} mode="DRIVING" precision="high" strokeWidth={7} strokeColor={colors.primary} resetOnChange onReady={result => { setEta(Math.round(result.duration)); setRouteDistance(result.distance); setRouteError(false); }} onError={() => setRouteError(true)} /> : null}
            </TrackingMap>
            <MapTools>
                <MapControlButton accessibilityRole="button" accessibilityLabel="Changer le style de carte" onPress={cycleMapType}>
                    <SvgIcon name="fa-layer-group" size={17} color={colors.black} />
                </MapControlButton>
                <MapControlButton accessibilityRole="button" accessibilityLabel="Recentrer sur ma position" onPress={recenterOnProfessional} disabled={!professionalPosition}>
                    <SvgIcon name="fa-crosshairs" size={17} color={professionalPosition ? colors.primary : colors.gray400} />
                </MapControlButton>
                <MapControlButton accessibilityRole="button" accessibilityLabel="Afficher le trajet complet" onPress={fitRoute} disabled={!professionalPosition || !destination} active={isFollowingRoute}>
                    <SvgIcon name="fa-map-marked-alt" size={17} color={isFollowingRoute ? colors.white : colors.black} />
                </MapControlButton>
            </MapTools>
            <TopBar>
                <BackButton accessibilityRole="button" accessibilityLabel="Retour" onPress={() => navigation.goBack()}><SvgIcon name="arrow-left" size={18} color={colors.black} /></BackButton>
                <TopTitle>Trajet vers le client</TopTitle>
                <MapSpacer />
            </TopBar>
            <InfoCard>
                <Row><Avatar><SvgIcon name="fa-user" size={16} color={colors.primary} /></Avatar><ClientInfo><Text variant="bold" color="black">{clientName || 'Client'}</Text>{clientPhone ? <Text variant="regularSmall" color="gray600">{clientPhone}</Text> : null}</ClientInfo></Row>
                <DestinationText><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{address?.location_name || address?.address || 'Adresse du client'}</Text></DestinationText>
                {locationError ? <WarningText>Activez la localisation pour suivre votre trajet en temps réel.</WarningText> : null}
                {routeError ? <WarningText>Itinéraire momentanément indisponible. Vérifiez votre connexion.</WarningText> : null}
                <RouteStats>
                    <RouteStat><SvgIcon name="fa-map-marked-alt" size={14} color={colors.primary} /><RouteStatText>{formatRouteDistance(routeDistance)}</RouteStatText></RouteStat>
                    {eta !== null ? <RouteStat><SvgIcon name="fa-clock" size={14} color={colors.primary} /><RouteStatText>{eta} min</RouteStatText></RouteStat> : null}
                </RouteStats>
                <ArrivedButton disabled={isUpdatingStatus} onPress={handleTripAction}><Text variant="bold" color={colors.white}>{isUpdatingStatus ? 'Mise à jour...' : isTripStarted ? 'Je suis arrivé' : 'Démarrer le trajet'}</Text></ArrivedButton>
            </InfoCard>
        </MapWrapper>
    </ScreenContainer>;
};

const geolocationCleanup = (watchId: number) => {
    Geolocation.clearWatch(watchId);
};

export default ProfessionalInterventionTrackingScreen;

const MapWrapper = styled.View`flex: 1;`;
const TrackingMap = styled(MapView).attrs({ provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined })`flex: 1;`;
const MapTools = styled.View`position: absolute; top: ${verticalScale(88)}px; right: ${horizontalScale(18)}px; gap: ${verticalScale(10)}px;`;
const MapControlButton = styled.TouchableOpacity<{ active?: boolean }>`width: ${horizontalScale(44)}px; height: ${horizontalScale(44)}px; border-radius: ${horizontalScale(22)}px; background-color: ${({ active }) => active ? colors.primary : colors.white}; align-items: center; justify-content: center; elevation: 4; opacity: ${({ disabled }) => disabled ? 0.55 : 1};`;
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
const RouteStats = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(18)}px; margin-top: ${verticalScale(12)}px;`;
const RouteStat = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(6)}px;`;
const RouteStatText = styled(Text).attrs({ variant: 'bold', color: 'gray700', fontSize: 13 })``;
const ArrivedButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; margin-top: ${verticalScale(14)}px; border-radius: ${moderateScale(12)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;

const PRO24_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#f5f2ef' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6b625b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffd9bf' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dcecf2' }] },
];
