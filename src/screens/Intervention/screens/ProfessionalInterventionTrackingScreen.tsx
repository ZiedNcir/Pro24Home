import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, PermissionsAndroid, Platform, Pressable } from 'react-native';
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
import { formatRouteDistance, getNavigationBannerCopy, getProfessionalStatusActions, getRouteFitCoordinates, getTrackingPanelMode } from '../utils/routePresentation';

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
    const [isArrivalActionsVisible, setIsArrivalActionsVisible] = useState(false);
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
    const navigationBannerCopy = getNavigationBannerCopy(isTripStarted);
    const trackingPanelMode = getTrackingPanelMode(isTripStarted);

    const handleTripAction = async () => {
        try {
            await updateInterventionStatus({ interventionId: intervention.id, status: 'in progress' }).unwrap();
            setIsTripStarted(true);
        } catch {
            Alert.alert('Mise à jour impossible', 'Le statut n’a pas pu être mis à jour.');
        }
    };

    const handleStatusSelection = async (status: 'in progress' | 'rejected' | 'completed') => {
        try {
            await updateInterventionStatus({ interventionId: intervention.id, status }).unwrap();
            setIsArrivalActionsVisible(false);
            if (status === 'rejected' || status === 'completed') navigation.goBack();
        } catch {
            Alert.alert('Mise à jour impossible', 'Le statut de l’intervention n’a pas pu être mis à jour.');
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
            <NavigationBanner active={isTripStarted}>
                <NavigationIcon active={isTripStarted}>
                    <SvgIcon name="fa-chevron-up" size={19} color={isTripStarted ? colors.primary : colors.white} />
                </NavigationIcon>
                <NavigationCopy>
                    <Text variant="bold" color={isTripStarted ? colors.white : colors.black} fontSize={17}>{navigationBannerCopy.title}</Text>
                    <Text variant="regularSmall" color={isTripStarted ? colors.white : colors.gray700}>{navigationBannerCopy.subtitle}</Text>
                </NavigationCopy>
            </NavigationBanner>
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
                {!isTripStarted ? <TopTitle>Trajet vers le client</TopTitle> : <MapSpacer />}
                <MapSpacer />
            </TopBar>
            <InfoCard compact={trackingPanelMode === 'compact'}>
                {trackingPanelMode === 'compact' ? <CompactPanel>
                    <CompactStats>
                        <CompactStat><SvgIcon name="fa-map-marked-alt" size={15} color={colors.primary} /><CompactStatCopy><CompactValue>{formatRouteDistance(routeDistance)}</CompactValue><CompactLabel>Distance</CompactLabel></CompactStatCopy></CompactStat>
                        <StatsDivider />
                        <CompactStat><SvgIcon name="fa-clock" size={15} color={colors.primary} /><CompactStatCopy><CompactValue>{eta !== null ? `${eta} min` : '—'}</CompactValue><CompactLabel>ETA</CompactLabel></CompactStatCopy></CompactStat>
                    </CompactStats>
                    <ArrivedButton disabled={isUpdatingStatus} onPress={() => setIsArrivalActionsVisible(true)}><Text variant="bold" color={colors.white}>{isUpdatingStatus ? 'Mise à jour...' : 'Je suis arrivé'}</Text></ArrivedButton>
                </CompactPanel> : <>
                    <CardEyebrow>INTERVENTION CHEZ</CardEyebrow>
                    <Row><Avatar><SvgIcon name="fa-user" size={17} color={colors.primary} /></Avatar><ClientInfo><Text variant="bold" color="black" fontSize={17}>{clientName || 'Client'}</Text>{clientPhone ? <Text variant="regularSmall" color="gray600">{clientPhone}</Text> : null}</ClientInfo></Row>
                    <DestinationText><SvgIcon name="fa-map-marker-alt" size={16} color={colors.primary} /><Text variant="regularSmall" color="gray600">{address?.location_name || address?.address || 'Adresse du client'}</Text></DestinationText>
                    {locationError ? <WarningText>Activez la localisation pour suivre votre trajet en temps réel.</WarningText> : null}
                    {routeError ? <WarningText>Itinéraire momentanément indisponible. Vérifiez votre connexion.</WarningText> : null}
                    <RouteStats>
                        <RouteStat><SvgIcon name="fa-map-marked-alt" size={15} color={colors.primary} /><RouteStatText>{formatRouteDistance(routeDistance)}<StatCaption>Distance</StatCaption></RouteStatText></RouteStat>
                        <StatsDivider />
                        {eta !== null ? <RouteStat><SvgIcon name="fa-clock" size={15} color={colors.primary} /><RouteStatText>{eta} min<StatCaption>Arrivée estimée</StatCaption></RouteStatText></RouteStat> : null}
                    </RouteStats>
                    <ProgressTrack><ProgressFill /></ProgressTrack>
                    <ArrivedButton disabled={isUpdatingStatus} onPress={handleTripAction}><Text variant="bold" color={colors.white}>{isUpdatingStatus ? 'Mise à jour...' : 'Démarrer le trajet'}</Text></ArrivedButton>
                </>}
            </InfoCard>
            <Modal visible={isArrivalActionsVisible} transparent animationType="slide" onRequestClose={() => setIsArrivalActionsVisible(false)}>
                <StatusModalBackdrop>
                    <StatusModalCard>
                        <StatusModalHandle />
                        <Text variant="bold" color="black" fontSize={18}>Mettre à jour l’intervention</Text>
                        <StatusModalDescription>Choisissez l’état actuel de l’intervention.</StatusModalDescription>
                        <StatusActionList>
                            {getProfessionalStatusActions().map(action => (
                                <StatusAction key={action.status} disabled={isUpdatingStatus} onPress={() => handleStatusSelection(action.status)}>
                                    <StatusActionIcon><SvgIcon name={action.status === 'completed' ? 'fa-check-circle' : action.status === 'rejected' ? 'fa-times-circle' : 'fa-wrench'} size={17} color={action.status === 'rejected' ? colors.danger : colors.primary} /></StatusActionIcon>
                                    <Text variant="bold" color="black" fontSize={14}>{action.label}</Text>
                                    <SvgIcon name="fa-chevron-right" size={14} color={colors.gray500} />
                                </StatusAction>
                            ))}
                        </StatusActionList>
                        <CancelAction onPress={() => setIsArrivalActionsVisible(false)}><Text variant="bold" color="gray600">Annuler</Text></CancelAction>
                    </StatusModalCard>
                </StatusModalBackdrop>
            </Modal>
        </MapWrapper>
    </ScreenContainer>;
};

const geolocationCleanup = (watchId: number) => {
    Geolocation.clearWatch(watchId);
};

export default ProfessionalInterventionTrackingScreen;

const MapWrapper = styled.View`flex: 1;`;
const TrackingMap = styled(MapView).attrs({ provider: Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined })`flex: 1;`;
const NavigationBanner = styled.View<{ active: boolean }>`position: absolute; top: ${verticalScale(78)}px; left: ${horizontalScale(18)}px; right: ${horizontalScale(18)}px; min-height: ${verticalScale(70)}px; padding: ${verticalScale(10)}px ${horizontalScale(12)}px; border-radius: ${moderateScale(16)}px; background-color: ${({ active }) => active ? colors.primary : colors.white}; flex-direction: row; align-items: center; elevation: 5;`;
const NavigationIcon = styled.View<{ active: boolean }>`width: ${horizontalScale(48)}px; height: ${horizontalScale(48)}px; border-radius: ${horizontalScale(12)}px; background-color: ${({ active }) => active ? colors.white : colors.primary}; align-items: center; justify-content: center;`;
const NavigationCopy = styled.View`margin-left: ${horizontalScale(12)}px; flex: 1;`;
const MapTools = styled.View`position: absolute; top: ${verticalScale(160)}px; right: ${horizontalScale(18)}px; gap: ${verticalScale(10)}px;`;
const MapControlButton = styled.TouchableOpacity<{ active?: boolean }>`width: ${horizontalScale(44)}px; height: ${horizontalScale(44)}px; border-radius: ${horizontalScale(22)}px; background-color: ${({ active }) => active ? colors.primary : colors.white}; align-items: center; justify-content: center; elevation: 4; opacity: ${({ disabled }) => disabled ? 0.55 : 1};`;
const TopBar = styled.View`position: absolute; top: ${verticalScale(18)}px; left: ${horizontalScale(18)}px; right: ${horizontalScale(18)}px; flex-direction: row; align-items: center; justify-content: space-between;`;
const BackButton = styled.TouchableOpacity`width: ${horizontalScale(42)}px; height: ${horizontalScale(42)}px; border-radius: ${horizontalScale(21)}px; background-color: ${colors.white}; align-items: center; justify-content: center; elevation: 4;`;
const TopTitle = styled(Text).attrs({ variant: 'bold', color: 'black', fontSize: 15 })`background-color: ${colors.white}; padding: ${verticalScale(10)}px ${horizontalScale(16)}px; border-radius: ${moderateScale(18)}px;`;
const MapSpacer = styled.View`width: ${horizontalScale(42)}px; height: ${horizontalScale(42)}px;`;
const InfoCard = styled.View<{ compact?: boolean }>`position: absolute; left: ${horizontalScale(18)}px; right: ${horizontalScale(18)}px; bottom: ${verticalScale(22)}px; padding: ${({ compact }) => compact ? `${verticalScale(12)}px ${horizontalScale(14)}px` : `${verticalScale(16)}px`}; border-radius: ${moderateScale(18)}px; background-color: ${colors.white}; elevation: 6;`;
const CompactPanel = styled.View``;
const CompactStats = styled.View`flex-direction: row; align-items: center; justify-content: center;`;
const CompactStat = styled.View`flex: 1; flex-direction: row; align-items: center; justify-content: center; gap: ${horizontalScale(7)}px;`;
const CompactStatCopy = styled.View``;
const CompactValue = styled(Text).attrs({ variant: 'bold', color: 'gray700', fontSize: 16 })``;
const CompactLabel = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 10 })``;
const CardEyebrow = styled(Text).attrs({ variant: 'bold', color: 'gray600', fontSize: 11 })`letter-spacing: 1px; margin-bottom: ${verticalScale(10)}px;`;
const Row = styled.View`flex-direction: row; align-items: center;`;
const Avatar = styled.View`width: ${horizontalScale(40)}px; height: ${horizontalScale(40)}px; border-radius: ${horizontalScale(20)}px; background-color: #fff1e8; align-items: center; justify-content: center;`;
const ClientInfo = styled.View`margin-left: ${horizontalScale(10)}px;`;
const DestinationText = styled.View`flex-direction: row; align-items: center; margin-top: ${verticalScale(14)}px; gap: ${horizontalScale(10)}px;`;
const WarningText = styled(Text).attrs({ variant: 'regularSmall', color: 'danger' })`margin-top: ${verticalScale(10)}px;`;
const RouteStats = styled.View`flex-direction: row; align-items: center; margin-top: ${verticalScale(16)}px;`;
const RouteStat = styled.View`flex-direction: row; align-items: center; gap: ${horizontalScale(6)}px;`;
const RouteStatText = styled(Text).attrs({ variant: 'bold', color: 'gray700', fontSize: 16 })``;
const StatCaption = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600', fontSize: 10 })`display: block; margin-top: ${verticalScale(2)}px;`;
const StatsDivider = styled.View`height: ${verticalScale(34)}px; width: 1px; background-color: ${colors.gray200}; margin: 0 ${horizontalScale(18)}px;`;
const ProgressTrack = styled.View`height: ${verticalScale(5)}px; border-radius: ${verticalScale(3)}px; background-color: ${colors.gray200}; margin-top: ${verticalScale(16)}px; overflow: hidden;`;
const ProgressFill = styled.View`height: 100%; width: 35%; border-radius: ${verticalScale(3)}px; background-color: ${colors.primary};`;
const ArrivedButton = styled.TouchableOpacity`height: ${verticalScale(48)}px; margin-top: ${verticalScale(14)}px; border-radius: ${moderateScale(12)}px; background-color: ${colors.primary}; align-items: center; justify-content: center;`;
const StatusModalBackdrop = styled.View`flex: 1; justify-content: flex-end; background-color: ${colors.backdrop};`;
const StatusModalCard = styled.View`background-color: ${colors.white}; border-top-left-radius: ${moderateScale(24)}px; border-top-right-radius: ${moderateScale(24)}px; padding: ${verticalScale(14)}px ${horizontalScale(18)}px ${verticalScale(24)}px;`;
const StatusModalHandle = styled.View`width: ${horizontalScale(42)}px; height: ${verticalScale(4)}px; border-radius: ${verticalScale(2)}px; background-color: ${colors.gray300}; align-self: center; margin-bottom: ${verticalScale(18)}px;`;
const StatusModalDescription = styled(Text).attrs({ variant: 'regularSmall', color: 'gray600' })`margin-top: ${verticalScale(6)}px; margin-bottom: ${verticalScale(16)}px;`;
const StatusActionList = styled.View`border-top-width: 1px; border-top-color: ${colors.gray200};`;
const StatusAction = styled(Pressable)`min-height: ${verticalScale(58)}px; flex-direction: row; align-items: center; border-bottom-width: 1px; border-bottom-color: ${colors.gray200}; gap: ${horizontalScale(12)}px;`;
const StatusActionIcon = styled.View`width: ${horizontalScale(36)}px; height: ${horizontalScale(36)}px; border-radius: ${horizontalScale(18)}px; background-color: ${colors.primaryLighter}; align-items: center; justify-content: center;`;
const CancelAction = styled(Pressable)`height: ${verticalScale(48)}px; align-items: center; justify-content: center; margin-top: ${verticalScale(8)}px;`;

const PRO24_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#f5f2ef' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#6b625b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffd9bf' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#dcecf2' }] },
];
