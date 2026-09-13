import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import AuthInitializer from '../components/AuthInitializer';
import AppNavigator from '../navigation/AppNavigator';
import { requestPermissions } from '../utils/permissions';
import '../utils/i18n';
import { AppProviders } from './providers/AppProviders';

library.add(fas as any);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const App = (): React.JSX.Element => {
  useEffect(() => {
    SplashScreen.hide();
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('634beb38-87ce-4fab-877e-cd57d766cb6e');
    requestPermissions();
  }, []);

  return (
    <AppProviders>
      <AuthInitializer />
      <AppNavigator />
    </AppProviders>
  );
};

export default App;
