import React from 'react';
import { AppRegistry, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { ThemeProvider } from '../../../src/theme';
import ServiceCategoryGrid from '../../../src/roles/client/home/ui/ServiceCategoryGrid';
import i18n from '../../../src/utils/i18n';
i18n.changeLanguage('fr');
function Preview() {
  React.useEffect(() => { SplashScreen.hide(); }, []);
  return <SafeAreaProvider><ThemeProvider><NavigationContainer>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
      <ScrollView style={{ width: 390 }} contentContainerStyle={{ padding: 14, paddingTop: 20 }}>
        <ServiceCategoryGrid />
      </ScrollView>
    </SafeAreaView>
  </NavigationContainer></ThemeProvider></SafeAreaProvider>;
}
AppRegistry.registerComponent('Pro24Home', () => Preview);
