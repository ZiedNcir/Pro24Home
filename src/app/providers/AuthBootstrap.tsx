import { useEffect } from 'react';

import { useAppDispatch } from '../../store/hooks';
import { clearSession } from '../../core/session/session-storage';
import { restoreStoredSession } from '../../core/session/session-service';
import { flushPendingNotificationOpen } from '../../core/notifications/notification-open';

const AuthBootstrap = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    restoreStoredSession(dispatch)
      .then(flushPendingNotificationOpen)
      .catch(async () => {
        await clearSession();
      });
  }, [dispatch]);

  return null;
};

export default AuthBootstrap;
