// App.tsx
import React, { useEffect } from 'react';
import { LogBox, useColorScheme } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import { ToastProvider } from 'react-native-toast-notifications';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { Provider } from 'react-redux';
import { store } from './src/store';
import AuthInitializer from './src/components/AuthInitializer';

//import OneSignalListener from '@utils/oneSignalListner';
import AppNavigator from './src/navigation/AppNavigator';
import { IconRegistryProvider } from '@components/Icon';
import { ThemeMode, ThemeProvider } from '@theme/ThemeProvider';

// Initialize FontAwesome
library.add(fas as any);

// Ignore specific warnings (optional)
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

function App(): React.JSX.Element {

  const deviceColorScheme = useColorScheme();
  const initialTheme: ThemeMode = deviceColorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    // Hide splash screen
    SplashScreen.hide();

    // Initialize OneSignal
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    OneSignal.initialize('634beb38-87ce-4fab-877e-cd57d766cb6e');

    // Request permissions
  }, []);



  return (
    <ThemeProvider initialTheme={initialTheme}>
      <Provider store={store}>
        <AuthInitializer />

        <ToastProvider
          placement="top"
          duration={4000}
          animationType="slide-in"
          animationDuration={250}
          successColor="#4CAF50"
          dangerColor="#F44336"
          warningColor="#FF9800"
          normalColor="#FF6B00"
          textStyle={{
            fontFamily: 'Inter-Regular',
            fontSize: 14,
            color: '#FFFFFF'
          }}
          offset={50}
          offsetTop={30}
          offsetBottom={40}
          swipeEnabled={true}
        >
          <IconRegistryProvider>
            <SafeAreaProvider>


              <AppNavigator />
            </SafeAreaProvider>
          </IconRegistryProvider>
        </ToastProvider>

      </Provider>
    </ThemeProvider>
  );
}

export default App;