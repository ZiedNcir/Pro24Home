import { startOneSignalTokenSync } from '../core/notifications/startOneSignalTokenSync';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import AuthBootstrap from './providers/AuthBootstrap';
import RootNavigator from './navigation/RootNavigator';
import '../utils/i18n';
import { AppProviders } from './providers/AppProviders';
import { initializeOneSignal } from '../core/notifications/oneSignalSubscription';
import { initializeNotificationOpenHandler } from '../core/notifications/notification-open';

library.add(fas as any);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const App = (): React.JSX.Element => {
  useEffect(() => {
    SplashScreen.hide();
    initializeOneSignal();
    const stopTokenSync = startOneSignalTokenSync();
    initializeNotificationOpenHandler();
    return stopTokenSync;
  }, []);

  return (
    <AppProviders>
      <AuthBootstrap />
      <RootNavigator />
    </AppProviders>
  );
};

export default App;
