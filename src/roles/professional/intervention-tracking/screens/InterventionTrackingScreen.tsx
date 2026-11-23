import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Linking,
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import styled from 'styled-components/native';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import {
  AudioGuidance,
  NavigationSessionStatus,
  RouteStatus,
  TravelMode,
} from '@googlemaps/react-native-navigation-sdk/src/navigation/types';
import type { MapViewController } from '@googlemaps/react-native-navigation-sdk/src/maps/mapView/types';
import { NavigationUIEnabledPreference } from '@googlemaps/react-native-navigation-sdk/src/navigation/navigationView/types';
import { NavigationView } from '@googlemaps/react-native-navigation-sdk/src/navigation/navigationView/navigationView';
import { useNavigationController } from '@googlemaps/react-native-navigation-sdk/src/navigation/navigation/useNavigationController';
import { TaskRemovedBehavior } from '@googlemaps/react-native-navigation-sdk/src/navigation/navigation/types';

import ScreenContainer from '@shared/ui/layout/ScreenContainer';
import InterventionHeader from '@shared/ui/navigation/InterventionHeader';
import Text from '@shared/ui/typography/Text';
import { SvgIcon } from '@shared/ui/icon';
import { useTheme } from '@theme';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  fontPixel,
} from '@utils/normalizedCss';
import { useGetInterventionQuery } from '@entities/intervention/api/intervention.api';
import {
  useUpdateStatusMutation,
  useUpdateInterventionStatusMutation,
} from '@roles/professional/availability/api/availability.api';
import { AppStackType } from '../../../../navigation/constant/core';
import {
  getInterventionAddress,
  getInterventionClientName,
} from '@entities/intervention/model/intervention-presentation';
import {
  formatRouteDistance,
  getGoogleNavigationWaypoint,
  getProfessionalStatusActions,
  getRoutePolylineDistanceMeters,
  getTrackingPanelMode,
} from '../model/route-presentation';

type Coordinates = { latitude: number; longitude: number };

const ProfessionalInterventionTrackingScreen = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const colors = theme.colors;
  const route =
    useRoute<RouteProp<AppStackType, 'ProfessionalInterventionTracking'>>();
  const navigation = useNavigation<any>();
  const lastStatusUpdate = useRef(0);
  const [professionalPosition, setProfessionalPosition] =
    useState<Coordinates | null>(null);
  const navigationPosition = useRef<Coordinates | null>(null);
  const navigationPositionWaiters = useRef<Array<() => void>>([]);
  const routePreviewPromise = useRef<Promise<boolean> | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [isRouteDistanceApproximate, setIsRouteDistanceApproximate] =
    useState(false);
  const [isPreparingRoute, setIsPreparingRoute] = useState(false);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [locationPermissionMissing, setLocationPermissionMissing] =
    useState(false);
  const [locationPermissionRefresh, setLocationPermissionRefresh] = useState(0);
  const [isArrivalActionsVisible, setIsArrivalActionsVisible] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  const [navigationError, setNavigationError] = useState<string | null>(null);
  const [mapViewController, setMapViewController] =
    useState<MapViewController | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const navigationTermsOptions = useMemo(
    () => ({
      title: t('professional.tracking.navigationTitle'),
      companyName: 'Pro24Home',
      showOnlyDisclaimer: false,
    }),
    [t],
  );
  const {
    navigationController,
    setOnArrival,
    setOnLocationChanged,
    setOnRemainingTimeOrDistanceChanged,
    removeAllListeners,
  } = useNavigationController(
    navigationTermsOptions,
    TaskRemovedBehavior.CONTINUE_SERVICE,
  );
  const {
    data: intervention,
    isLoading,
    isError,
  } = useGetInterventionQuery(route.params.intervention_id);
  const [updateStatus] = useUpdateStatusMutation();
  const [updateInterventionStatus, { isLoading: isUpdatingStatus }] =
    useUpdateInterventionStatusMutation();

  const address = useMemo(
    () => (intervention ? getInterventionAddress(intervention) : undefined),
    [intervention],
  );
  const destination = useMemo(() => {
    const waypoint = getGoogleNavigationWaypoint(address);
    return waypoint
      ? { latitude: waypoint.position.lat, longitude: waypoint.position.lng }
      : null;
  }, [address]);
  const hasProfessionalPosition = Boolean(professionalPosition);
  const interventionMarkerId = `intervention-destination-${route.params.intervention_id}`;

  useEffect(() => {
    if (!isMapReady || !mapViewController || !destination) return;
    let disposed = false;
    mapViewController
      .addMarker({
        id: interventionMarkerId,
        position: { lat: destination.latitude, lng: destination.longitude },
        title:
          address?.location_name ||
          address?.address ||
          t('professional.tracking.destination'),
      })
      .then(() => {
        if (disposed) mapViewController.removeMarker(interventionMarkerId);
      })
      .catch(() => undefined);

    return () => {
      disposed = true;
      mapViewController.removeMarker(interventionMarkerId);
    };
  }, [
    address?.address,
    address?.location_name,
    destination,
    interventionMarkerId,
    isMapReady,
    mapViewController,
    t,
  ]);
  const getNavigationErrorMessage = useCallback(
    (error: unknown) => {
      const message = error instanceof Error ? error.message : '';
      const knownMessages = [
        t('professional.tracking.invalidAddress'),
        t('professional.tracking.termsRequired'),
        t('professional.tracking.enableLocation'),
        t('professional.tracking.routeUpdating'),
        t('professional.tracking.navigationPermissionDenied'),
      ];
      const routeUnavailablePrefix =
        t('professional.tracking.routeUnavailable', {
          status: '__status__',
        }).split('__status__')[0] ?? '';
      return knownMessages.includes(message) ||
        message.startsWith(routeUnavailablePrefix)
        ? message
        : t('professional.tracking.navigationUnavailable');
    },
    [t],
  );

  const prepareRoutePreview = useCallback(async () => {
    if (!destination)
      throw new Error(t('professional.tracking.invalidAddress'));
    if (routePreviewPromise.current) return routePreviewPromise.current;

    const preparation = (async (): Promise<boolean> => {
      const termsAccepted =
        (await navigationController.areTermsAccepted()) ||
        (await navigationController.showTermsAndConditionsDialog());
      if (!termsAccepted) return false;

      const sessionStatus = await navigationController.init();
      if (
        sessionStatus === NavigationSessionStatus.LOCATION_PERMISSION_MISSING
      ) {
        throw new Error(t('professional.tracking.enableLocation'));
      }
      if (sessionStatus === NavigationSessionStatus.TERMS_NOT_ACCEPTED) {
        throw new Error(t('professional.tracking.termsRequired'));
      }
      if (sessionStatus === NavigationSessionStatus.NOT_AUTHORIZED) {
        throw new Error(t('professional.tracking.navigationPermissionDenied'));
      }
      if (sessionStatus !== NavigationSessionStatus.OK) {
        throw new Error(t('professional.tracking.navigationUnavailable'));
      }

      navigationController.startUpdatingLocation();
      if (!navigationPosition.current) {
        await new Promise<void>((resolve, reject) => {
          let onNavigationPosition: () => void;
          const locationTimeout = setTimeout(() => {
            navigationPositionWaiters.current =
              navigationPositionWaiters.current.filter(
                waiter => waiter !== onNavigationPosition,
              );
            reject(new Error(t('professional.tracking.enableLocation')));
          }, 15000);
          onNavigationPosition = () => {
            clearTimeout(locationTimeout);
            resolve();
          };
          navigationPositionWaiters.current.push(onNavigationPosition);
        });
      }

      const status = await navigationController.setDestinations(
        [
          {
            title: address?.address || t('professional.tracking.destination'),
            position: { lat: destination.latitude, lng: destination.longitude },
          },
        ],
        {
          routingOptions: { travelMode: TravelMode.DRIVING },
          displayOptions: { showDestinationMarkers: false },
        },
      );
      if (status === RouteStatus.ROUTE_CANCELED) {
        throw new Error(t('professional.tracking.routeUpdating'));
      }
      if (status === RouteStatus.QUOTA_CHECK_FAILED) {
        throw new Error(t('professional.tracking.navigationPermissionDenied'));
      }
      if (status !== RouteStatus.OK)
        throw new Error(
          t('professional.tracking.routeUnavailable', { status }),
        );

      let distanceMeters: number | null = null;
      try {
        const timeAndDistance =
          await navigationController.getCurrentTimeAndDistance();
        if (timeAndDistance && !('error' in timeAndDistance)) {
          setEta(Math.max(0, Math.round(timeAndDistance.seconds / 60)));
          if (
            Number.isFinite(timeAndDistance.meters) &&
            timeAndDistance.meters >= 0 &&
            timeAndDistance.meters <= 50_000_000
          ) {
            distanceMeters = timeAndDistance.meters;
            setIsRouteDistanceApproximate(false);
          }
        }
      } catch {
        // A route preview may not expose remaining distance until guidance begins.
      }

      if (distanceMeters === null) {
        try {
          const segments = await navigationController.getRouteSegments();
          distanceMeters = getRoutePolylineDistanceMeters(
            segments[0]?.segmentLatLngList ?? [],
          );
          if (distanceMeters !== null) setIsRouteDistanceApproximate(true);
        } catch {
          // Navigation callbacks can still supply the exact distance after guidance starts.
        }
      }
      if (distanceMeters !== null) setRouteDistance(distanceMeters / 1000);
      return true;
    })();

    routePreviewPromise.current = preparation;
    try {
      const ready = await preparation;
      if (!ready) routePreviewPromise.current = null;
      return ready;
    } catch (error) {
      routePreviewPromise.current = null;
      throw error;
    }
  }, [address?.address, destination, navigationController, t]);

  useEffect(() => {
    if (!hasProfessionalPosition || !destination) return;
    let mounted = true;
    setIsPreparingRoute(true);
    prepareRoutePreview()
      .then(() => {
        if (mounted) setNavigationError(null);
      })
      .catch(error => {
        if (mounted) setNavigationError(getNavigationErrorMessage(error));
      })
      .finally(() => {
        if (mounted) setIsPreparingRoute(false);
      });
    return () => {
      mounted = false;
    };
  }, [
    destination,
    getNavigationErrorMessage,
    hasProfessionalPosition,
    prepareRoutePreview,
    t,
  ]);

  useEffect(() => {
    let watchId: number | null = null;
    let mounted = true;

    const startWatching = async () => {
      if (Platform.OS === 'android') {
        const permission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
          if (mounted) {
            setLocationPermissionMissing(true);
            setLocationError(true);
          }
          return;
        }
      } else {
        const { request, PERMISSIONS, RESULTS } = await import(
          'react-native-permissions'
        );
        const permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (permission !== RESULTS.GRANTED) {
          if (mounted) {
            setLocationPermissionMissing(true);
            setLocationError(true);
          }
          return;
        }
      }

      if (mounted) {
        setLocationPermissionMissing(false);
        setLocationError(false);
      }

      watchId = Geolocation.watchPosition(
        position => {
          if (!mounted) return;
          const positionCoordinates = {
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
          };
          setProfessionalPosition(positionCoordinates);

          const now = Date.now();
          if (now - lastStatusUpdate.current >= 5000) {
            lastStatusUpdate.current = now;
            updateStatus({ onligne: 1, ...positionCoordinates });
          }
        },
        () => {
          if (mounted) setLocationError(true);
        },
        { enableHighAccuracy: true, distanceFilter: 10, maximumAge: 5000 },
      );
    };

    startWatching().catch(() => {
      if (mounted) {
        setLocationPermissionMissing(true);
        setLocationError(true);
      }
    });

    return () => {
      mounted = false;
      if (watchId !== null) {
        geolocationCleanup(watchId);
      }
    };
  }, [locationPermissionRefresh, updateStatus]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') setLocationPermissionRefresh(value => value + 1);
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    setOnLocationChanged(location => {
      const coordinates = { latitude: location.lat, longitude: location.lng };
      navigationPosition.current = coordinates;
      navigationPositionWaiters.current.splice(0).forEach(resolve => resolve());
      setProfessionalPosition(coordinates);
    });
    setOnRemainingTimeOrDistanceChanged(value => {
      if (Number.isFinite(value.seconds) && value.seconds >= 0)
        setEta(Math.round(value.seconds / 60));
      if (
        Number.isFinite(value.meters) &&
        value.meters >= 0 &&
        value.meters <= 50_000_000
      ) {
        setRouteDistance(value.meters / 1000);
        setIsRouteDistanceApproximate(false);
      }
    });
    setOnArrival(() => setIsArrivalActionsVisible(true));
    return () => removeAllListeners();
  }, [
    removeAllListeners,
    setOnArrival,
    setOnLocationChanged,
    setOnRemainingTimeOrDistanceChanged,
  ]);

  useEffect(
    () => () => {
      navigationController.stopGuidance().catch(() => undefined);
      navigationController.cleanup().catch(() => undefined);
    },
    [navigationController],
  );

  if (isLoading)
    return (
      <ScreenContainer centered>
        <ActivityIndicator color={colors.primary} />
      </ScreenContainer>
    );
  if (isError || !intervention)
    return (
      <ScreenContainer centered>
        <Text variant="regularSmall" color="gray600">
          {t('professional.tracking.loadFailed')}
        </Text>
      </ScreenContainer>
    );

  const clientName = getInterventionClientName(intervention.client);
  const clientPhone = intervention.client?.phone_number;
  const trackingPanelMode = getTrackingPanelMode(isTripStarted);
  const formattedRouteDistance = formatRouteDistance(routeDistance);
  const routeDistanceLabel = formattedRouteDistance
    ? `${isRouteDistanceApproximate ? '≈ ' : ''}${formattedRouteDistance}`
    : t('professional.tracking.distanceUnavailable');

  const startGoogleGuidance = async () => {
    const routeReady = await prepareRoutePreview();
    if (!routeReady) return false;
    await navigationController.startGuidance();
    await navigationController.setAudioGuidanceType(
      voiceGuidance
        ? AudioGuidance.VOICE_ALERTS_AND_GUIDANCE
        : AudioGuidance.SILENT,
    );
    setNavigationError(null);
    return true;
  };

  const retryRoutePreview = async () => {
    setIsPreparingRoute(true);
    try {
      await prepareRoutePreview();
      setNavigationError(null);
    } catch (error) {
      setNavigationError(getNavigationErrorMessage(error));
    } finally {
      setIsPreparingRoute(false);
    }
  };

  const openLocationSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      Alert.alert(
        t('professional.tracking.updateFailed'),
        t('professional.tracking.locationSettingsUnavailable'),
      );
    }
  };

  const handleTripAction = async () => {
    try {
      const routeStarted = await startGoogleGuidance();
      if (!routeStarted) return;
    } catch (error) {
      setNavigationError(getNavigationErrorMessage(error));
      Alert.alert(
        t('professional.tracking.updateFailed'),
        getNavigationErrorMessage(error),
      );
      return;
    }

    try {
      await updateInterventionStatus({
        interventionId: intervention.id,
        status: 'in progress',
      }).unwrap();
      setIsTripStarted(true);
    } catch {
      Alert.alert(
        t('professional.tracking.updateFailed'),
        t('professional.tracking.statusFailed'),
      );
    }
  };

  const handleStatusSelection = async (
    status: 'in progress' | 'rejected' | 'completed',
  ) => {
    try {
      await updateInterventionStatus({
        interventionId: intervention.id,
        status,
      }).unwrap();
      setIsArrivalActionsVisible(false);
      if (status === 'rejected' || status === 'completed') {
        await navigationController.stopGuidance().catch(() => undefined);
        navigation.goBack();
      }
    } catch {
      Alert.alert(
        t('professional.tracking.updateFailed'),
        t('professional.tracking.interventionStatusFailed'),
      );
    }
  };

  return (
    <ScreenContainer paddingHorizontal={0} paddingVertical={0}>
      <MapWrapper>
        <NavigationView
          style={styles.navigationView}
          onMapViewControllerCreated={setMapViewController}
          onMapReady={() => setIsMapReady(true)}
          navigationUIEnabledPreference={
            NavigationUIEnabledPreference.AUTOMATIC
          }
          tripProgressBarEnabled={false}
          trafficPromptsEnabled
          headerEnabled
          footerEnabled
        />
        {!isMapReady ? (
          <MapLoadingOverlay
            accessibilityRole="progressbar"
            accessibilityLabel={t('professional.tracking.mapLoading')}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <MapLoadingText>
              {t('professional.tracking.mapLoading')}
            </MapLoadingText>
          </MapLoadingOverlay>
        ) : null}
        <MapTools>
          <MapControlButton
            accessibilityRole="button"
            accessibilityLabel={t('professional.tracking.voice')}
            onPress={() => {
              const next = !voiceGuidance;
              setVoiceGuidance(next);
              navigationController.setAudioGuidanceType(
                next
                  ? AudioGuidance.VOICE_ALERTS_AND_GUIDANCE
                  : AudioGuidance.SILENT,
              );
            }}
          >
            <SvgIcon
              name="fa-bell"
              size={17}
              color={voiceGuidance ? colors.primary : colors.gray500}
            />
          </MapControlButton>
        </MapTools>
        {!isTripStarted ? (
          <TrackingHeader>
            <InterventionHeader
              title={t('professional.tracking.toClient')}
              showHelp={false}
            />
          </TrackingHeader>
        ) : null}
        <InfoCard
          compact={trackingPanelMode === 'compact'}
          preTrip={!isTripStarted}
        >
          {trackingPanelMode === 'compact' ? (
            <CompactPanel>
              <CompactStatsRow>
                <CompactStats>
                  <CompactStat>
                    <SvgIcon
                      name="fa-map-marked-alt"
                      size={15}
                      color={colors.primary}
                    />
                    <CompactStatCopy>
                      <CompactValue>{routeDistanceLabel}</CompactValue>
                      <CompactLabel>
                        {t('professional.tracking.distance')}
                      </CompactLabel>
                    </CompactStatCopy>
                  </CompactStat>
                  <StatsDivider />
                  <CompactStat>
                    <SvgIcon name="fa-clock" size={15} color={colors.primary} />
                    <CompactStatCopy>
                      <CompactValue>
                        {eta !== null ? `${eta} min` : '—'}
                      </CompactValue>
                      <CompactLabel>
                        {t('professional.tracking.eta')}
                      </CompactLabel>
                    </CompactStatCopy>
                  </CompactStat>
                </CompactStats>
                <CloseTrackingButton
                  accessibilityRole="button"
                  accessibilityLabel={t('intervention.address.close')}
                  onPress={() => navigation.goBack()}
                >
                  <SvgIcon name="fa-times" size={15} color={colors.gray600} />
                </CloseTrackingButton>
              </CompactStatsRow>
              <ArrivedButton
                disabled={isUpdatingStatus}
                onPress={() => setIsArrivalActionsVisible(true)}
              >
                <Text variant="bold" color={colors.textInverse}>
                  {isUpdatingStatus
                    ? t('professional.tracking.updating')
                    : t('professional.tracking.arrived')}
                </Text>
              </ArrivedButton>
            </CompactPanel>
          ) : (
            <>
              <Row>
                <Avatar>
                  <SvgIcon name="fa-user" size={17} color={colors.primary} />
                </Avatar>
                <ClientInfo>
                  <Text variant="bold" color="black" fontSize={17}>
                    {clientName || t('professional.tracking.client')}
                  </Text>
                  {clientPhone ? (
                    <Text variant="regularSmall" color="gray600">
                      {clientPhone}
                    </Text>
                  ) : null}
                </ClientInfo>
              </Row>
              <DestinationText compact={!isTripStarted}>
                <SvgIcon
                  name="fa-map-marker-alt"
                  size={16}
                  color={colors.primary}
                />
                <Text variant="regularSmall" color="gray600">
                  {address?.location_name ||
                    address?.address ||
                    t('professional.tracking.clientAddress')}
                </Text>
              </DestinationText>
              {locationError ? (
                <LocationPermissionNotice>
                  <WarningText>
                    {t('professional.tracking.enableLocation')}
                  </WarningText>
                  {locationPermissionMissing ? (
                    <RetryButton onPress={openLocationSettings}>
                      <Text variant="bold" color="primary">
                        {t('professional.tracking.openLocationSettings')}
                      </Text>
                    </RetryButton>
                  ) : null}
                </LocationPermissionNotice>
              ) : null}
              {navigationError ? (
                <RetryRow>
                  <WarningText>{navigationError}</WarningText>
                  <RetryButton onPress={retryRoutePreview}>
                    <Text variant="bold" color="primary">
                      {t('professional.tracking.retry')}
                    </Text>
                  </RetryButton>
                </RetryRow>
              ) : null}
              <RouteStats compact={!isTripStarted}>
                <RouteStat>
                  <SvgIcon
                    name="fa-map-marked-alt"
                    size={15}
                    color={colors.primary}
                  />
                  <RouteStatText>
                    {routeDistanceLabel}
                    <StatCaption>
                      {t('professional.tracking.distance')}
                    </StatCaption>
                  </RouteStatText>
                </RouteStat>
                <StatsDivider />
                {eta !== null ? (
                  <RouteStat>
                    <SvgIcon name="fa-clock" size={15} color={colors.primary} />
                    <RouteStatText>
                      {eta} min
                      <StatCaption>
                        {t('professional.tracking.arrivalEstimate')}
                      </StatCaption>
                    </RouteStatText>
                  </RouteStat>
                ) : null}
              </RouteStats>
              <ArrivedButton
                compact={!isTripStarted}
                disabled={isUpdatingStatus || isPreparingRoute}
                onPress={handleTripAction}
              >
                <Text variant="bold" color={colors.textInverse}>
                  {isUpdatingStatus || isPreparingRoute
                    ? t('professional.tracking.updating')
                    : t('professional.tracking.start')}
                </Text>
              </ArrivedButton>
            </>
          )}
        </InfoCard>
        <Modal
          visible={isArrivalActionsVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsArrivalActionsVisible(false)}
        >
          <StatusModalBackdrop>
            <StatusModalCard>
              <StatusModalHandle />
              <Text variant="bold" color="black" fontSize={18}>
                {t('professional.tracking.updateIntervention')}
              </Text>
              <StatusModalDescription>
                {t('professional.tracking.chooseStatus')}
              </StatusModalDescription>
              <StatusActionList>
                {getProfessionalStatusActions().map(action => (
                  <StatusAction
                    key={action.status}
                    disabled={isUpdatingStatus}
                    onPress={() => handleStatusSelection(action.status)}
                  >
                    <StatusActionIcon>
                      <SvgIcon
                        name={
                          action.status === 'completed'
                            ? 'fa-check-circle'
                            : action.status === 'rejected'
                            ? 'fa-times-circle'
                            : 'fa-wrench'
                        }
                        size={17}
                        color={
                          action.status === 'rejected'
                            ? colors.danger
                            : colors.primary
                        }
                      />
                    </StatusActionIcon>
                    <Text variant="bold" color="black" fontSize={14}>
                      {t(action.labelKey)}
                    </Text>
                    <SvgIcon
                      name="fa-chevron-right"
                      size={14}
                      color={colors.gray500}
                    />
                  </StatusAction>
                ))}
              </StatusActionList>
              <CancelAction onPress={() => setIsArrivalActionsVisible(false)}>
                <Text variant="bold" color="gray600">
                  {t('professional.tracking.cancel')}
                </Text>
              </CancelAction>
            </StatusModalCard>
          </StatusModalBackdrop>
        </Modal>
      </MapWrapper>
    </ScreenContainer>
  );
};

const geolocationCleanup = (watchId: number) => {
  Geolocation.clearWatch(watchId);
};

export default ProfessionalInterventionTrackingScreen;

const styles = StyleSheet.create({ navigationView: { flex: 1 } });

const MapWrapper = styled.View`
  flex: 1;
`;
const MapLoadingOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background-color: ${({ theme }) => theme.colors.surface};
  opacity: 0.9;
  align-items: center;
  justify-content: center;
`;
const MapLoadingText = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
})`
  margin-top: ${verticalScale(10)}px;
`;
const MapTools = styled.View`
  position: absolute;
  top: ${verticalScale(160)}px;
  right: ${horizontalScale(18)}px;
  gap: ${verticalScale(10)}px;
`;
const MapControlButton = styled.TouchableOpacity`
  width: ${horizontalScale(44)}px;
  height: ${horizontalScale(44)}px;
  border-radius: ${horizontalScale(22)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  align-items: center;
  justify-content: center;
  elevation: 4;
`;
const TrackingHeader = styled.View`
  position: absolute;
  top: ${verticalScale(18)}px;
  left: ${horizontalScale(18)}px;
  right: ${horizontalScale(18)}px;
  z-index: 10;
  elevation: 10;
`;
const InfoCard = styled.View<{ compact?: boolean; preTrip?: boolean }>`
  position: absolute;
  left: ${horizontalScale(18)}px;
  right: ${horizontalScale(18)}px;
  bottom: ${verticalScale(22)}px;
  padding: ${({ compact, preTrip }) =>
    compact || preTrip
      ? `${verticalScale(12)}px ${horizontalScale(14)}px`
      : `${verticalScale(16)}px`};
  border-radius: ${moderateScale(18)}px;
  background-color: ${({ theme }) => theme.colors.surface};
  elevation: 6;
`;
const CompactPanel = styled.View``;
const CompactStatsRow = styled.View`
  flex-direction: row;
  align-items: center;
`;
const CompactStats = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const CloseTrackingButton = styled.TouchableOpacity`
  width: ${horizontalScale(36)}px;
  height: ${horizontalScale(36)}px;
  margin-left: ${horizontalScale(8)}px;
  border-radius: ${horizontalScale(18)}px;
  background-color: ${({ theme }) => theme.colors.gray100};
  align-items: center;
  justify-content: center;
`;
const CompactStat = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${horizontalScale(7)}px;
`;
const CompactStatCopy = styled.View``;
const CompactValue = styled(Text).attrs({
  variant: 'bold',
  color: 'gray700',
  fontSize: fontPixel(16),
})``;
const CompactLabel = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
  fontSize: fontPixel(10),
})``;
const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Avatar = styled.View`
  width: ${horizontalScale(40)}px;
  height: ${horizontalScale(40)}px;
  border-radius: ${horizontalScale(20)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  align-items: center;
  justify-content: center;
`;
const ClientInfo = styled.View`
  margin-left: ${horizontalScale(10)}px;
`;
const DestinationText = styled.View<{ compact?: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ compact }) => verticalScale(compact ? 8 : 14)}px;
  gap: ${horizontalScale(10)}px;
`;
const WarningText = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'danger',
})`
  margin-top: ${verticalScale(10)}px;
`;
const LocationPermissionNotice = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${horizontalScale(10)}px;
`;
const RetryRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: ${horizontalScale(10)}px;
`;
const RetryButton = styled.TouchableOpacity`
  margin-top: ${verticalScale(10)}px;
  padding: ${verticalScale(8)}px ${horizontalScale(10)}px;
`;
const RouteStats = styled.View<{ compact?: boolean }>`
  flex-direction: row;
  align-items: center;
  margin-top: ${({ compact }) => verticalScale(compact ? 10 : 16)}px;
`;
const RouteStat = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${horizontalScale(6)}px;
`;
const RouteStatText = styled(Text).attrs({
  variant: 'bold',
  color: 'gray700',
  fontSize: fontPixel(16),
})``;
const StatCaption = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
  fontSize: fontPixel(10),
})`
  display: block;
  margin-top: ${verticalScale(2)}px;
`;
const StatsDivider = styled.View`
  height: ${verticalScale(34)}px;
  width: 1px;
  background-color: ${({ theme }) => theme.colors.gray200};
  margin: 0 ${horizontalScale(18)}px;
`;
const ArrivedButton = styled.TouchableOpacity<{ compact?: boolean }>`
  height: ${({ compact }) => verticalScale(compact ? 44 : 48)}px;
  margin-top: ${({ compact }) => verticalScale(compact ? 10 : 14)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: ${({ theme }) => theme.colors.primary};
  align-items: center;
  justify-content: center;
`;
const StatusModalBackdrop = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.colors.backdrop};
`;
const StatusModalCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top-left-radius: ${moderateScale(24)}px;
  border-top-right-radius: ${moderateScale(24)}px;
  padding: ${verticalScale(14)}px ${horizontalScale(18)}px
    ${verticalScale(24)}px;
`;
const StatusModalHandle = styled.View`
  width: ${horizontalScale(42)}px;
  height: ${verticalScale(4)}px;
  border-radius: ${verticalScale(2)}px;
  background-color: ${({ theme }) => theme.colors.gray300};
  align-self: center;
  margin-bottom: ${verticalScale(18)}px;
`;
const StatusModalDescription = styled(Text).attrs({
  variant: 'regularSmall',
  color: 'gray600',
})`
  margin-top: ${verticalScale(6)}px;
  margin-bottom: ${verticalScale(16)}px;
`;
const StatusActionList = styled.View`
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.gray200};
`;
const StatusAction = styled(Pressable)`
  min-height: ${verticalScale(58)}px;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray200};
  gap: ${horizontalScale(12)}px;
`;
const StatusActionIcon = styled.View`
  width: ${horizontalScale(36)}px;
  height: ${horizontalScale(36)}px;
  border-radius: ${horizontalScale(18)}px;
  background-color: ${({ theme }) => theme.colors.primaryLighter};
  align-items: center;
  justify-content: center;
`;
const CancelAction = styled(Pressable)`
  height: ${verticalScale(48)}px;
  align-items: center;
  justify-content: center;
  margin-top: ${verticalScale(8)}px;
`;
