import { OneSignal } from 'react-native-onesignal';
import { store } from '../../store';
import { notificationEndpoints } from '../../store/api/endpoints/notification';
import { getNotificationInterventionId } from './notification-target';
import { navigationRef } from '../../app/navigation/navigation-service';

type NotificationTarget = { notificationId?: string; interventionId?: number };
let pendingTarget: NotificationTarget | null = null;
let listening = false;

const parseTarget = (data: Record<string, unknown> | undefined): NotificationTarget => ({
  notificationId: typeof data?.notification_id === 'string' ? data.notification_id : undefined,
  interventionId: getNotificationInterventionId(data),
});

const openTarget = (target: NotificationTarget): void => {
  if (!navigationRef.isReady() || !store.getState().auth.isAuthenticated) {
    pendingTarget = target;
    return;
  }

  if (target.notificationId) {
    store.dispatch(notificationEndpoints.endpoints.readNotification.initiate(target.notificationId)).unwrap().catch(() => undefined);
  }

  if (target.interventionId !== undefined) {
    navigationRef.navigate('InterventionDetail', { intervention_id: target.interventionId });
  } else {
    navigationRef.navigate('Notifications');
  }
};

export const initializeNotificationOpenHandler = (): void => {
  if (listening) return;
  listening = true;
  OneSignal.Notifications.addEventListener('click', (event: any) => {
    openTarget(parseTarget(event.notification?.additionalData));
  });
};

export const flushPendingNotificationOpen = (): void => {
  if (!pendingTarget) return;
  const target = pendingTarget;
  pendingTarget = null;
  openTarget(target);
};
