import { navigate } from '../navigation/service/navigationRef';
import AuthService from '@services/auth';
import {AppState} from '@store/configuration';
import {setNotification} from '@store/notification/notification.action';
import {useEffect} from 'react';
import {OneSignal} from 'react-native-onesignal';
import {useDispatch, useSelector} from 'react-redux';

const seenNotifications = new Set<number>(); // Anti-doublon en mémoire

export default function OneSignalListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: AppState) => state.auth.currentUser?.user,
  );

  useEffect(() => {
    OneSignal.Notifications.requestPermission(true);
  }, []);

  useEffect(() => {
    const handleNotification = (notification: any) => {
      const customId =
        notification?.notification?.additionalData?.intervention_id;

      if (customId && seenNotifications.has(customId)) return;
      if (customId) {
        seenNotifications.add(customId);
      }

      dispatch(setNotification(notification.notification) as any);
    };

    const handleClick = (event: any) => {
      const payload = event?.notification?.rawPayload;
      const screen = payload?.navigateTo ?? 'ProfessionalApp';
      navigate(screen as any);
    };

    OneSignal.Notifications.addEventListener(
      'foregroundWillDisplay',
      handleNotification,
    );
    OneSignal.Notifications.addEventListener('click', handleClick);

    return () => {
      OneSignal.Notifications.removeEventListener(
        'foregroundWillDisplay',
        handleNotification,
      );
      OneSignal.Notifications.removeEventListener('click', handleClick);
    };
  }, [dispatch]);

  useEffect(() => {
    if (!currentUser?.id) return;

    OneSignal.User.pushSubscription.getIdAsync().then(playerId => {
      if (!playerId) return;

      AuthService.updateOneSignalKey(playerId);
    });
  }, [currentUser?.id, currentUser?.type]);

  return null;
}
