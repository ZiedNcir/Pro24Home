import { startOneSignalTokenSync } from '../core/notifications/startOneSignalTokenSync';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

import AuthBootstrap from './providers/AuthBootstrap';
import RootNavigator from './navigation/RootNavigator';
import i18n from '../utils/i18n';
import { readLanguagePreference } from '@utils/language-preference';
import { AppProviders } from './providers/AppProviders';
import { initializeOneSignal } from '../core/notifications/oneSignalSubscription';
import { initializeNotificationOpenHandler } from '../core/notifications/notification-open';

library.add(fas as any);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

const App = (): React.JSX.Element => {
  const [isLanguageReady, setIsLanguageReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    initializeOneSignal();
    const stopTokenSync = startOneSignalTokenSync();
    initializeNotificationOpenHandler();

    const restoreLanguage = async () => {
      try {
        const savedLanguage = await readLanguagePreference();
        if (savedLanguage) await i18n.changeLanguage(savedLanguage);
      } catch {
        // Keep the device locale already selected by i18n when storage is unavailable.
      } finally {
        if (mounted) {
          SplashScreen.hide();
          setIsLanguageReady(true);
        }
      }
    };

    restoreLanguage().catch(() => undefined);
    return () => {
      mounted = false;
      stopTokenSync();
    };
  }, []);

  return (
    <AppProviders>
      <AuthBootstrap />
      {isLanguageReady ? <RootNavigator /> : null}
    </AppProviders>
  );
};

export default App;
