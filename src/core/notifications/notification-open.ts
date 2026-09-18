import { OneSignal } from 'react-native-onesignal';
import { store } from '../../store';
import { notificationEndpoints } from '../../store/api/endpoints/notification';
import { interventionEndpoints } from '../../store/api/endpoints/intervention';
import { navigationRef } from '../../app/navigation/navigation-service';

type NotificationTarget = { notificationId?: string; interventionId?: number };
let pendingTarget: NotificationTarget | null = null;
let listening = false;

const parseTarget = (data: Record<string, unknown> | undefined): NotificationTarget | null => {
  if (!data) return null;
  const notificationId = typeof data.notification_id === 'string' ? data.notification_id : undefined;
  const interventionValue = data.intervention_id;
  const interventionId = typeof interventionValue === 'number' ? interventionValue : Number(interventionValue);
  return { notificationId, interventionId: Number.isFinite(interventionId) ? interventionId : undefined };
};

const openTarget = async (target: NotificationTarget): Promise<void> => {
  if (!navigationRef.isReady() || !store.getState().auth.isAuthenticated) {
    pendingTarget = target;
    return;
  }

  if (target.notificationId) {
    await store.dispatch(notificationEndpoints.endpoints.readNotification.initiate(target.notificationId)).unwrap().catch(() => undefined);
  }

  let interventionId = target.interventionId;
  if (!interventionId) {
    const userType = store.getState().auth.user?.type;
    const result = await store.dispatch(interventionEndpoints.endpoints.getInterventions.initiate({ type: userType === 'professional' ? 'professional' : 'client' })).unwrap().catch(() => null);
    interventionId = result?.data?.[0]?.id;
  }

  if (interventionId) navigationRef.navigate('InterventionDetail', { intervention_id: interventionId });
  else navigationRef.navigate('Notifications');
};

export const initializeNotificationOpenHandler = (): void => {
  if (listening) return;
  listening = true;
  OneSignal.Notifications.addEventListener('click', (event: any) => {
    const target = parseTarget(event.notification?.additionalData);
    if (target) void openTarget(target);
    else if (navigationRef.isReady()) navigationRef.navigate('Notifications');
  });
};

export const flushPendingNotificationOpen = (): void => {
  if (!pendingTarget) return;
  const target = pendingTarget;
  pendingTarget = null;
  void openTarget(target);
};
