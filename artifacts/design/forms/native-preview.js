import React from 'react';
import { AppRegistry, View, LogBox } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from 'react-native-splash-screen';
import { useTheme } from '../../../src/theme';
import { AppProviders } from '../../../src/app/providers/AppProviders';
import AccountTypeScreen from '../../../src/features/auth/ui/AccountTypeScreen';
import ForgetPassword from '../../../src/features/auth/ui/ForgetPassword';
import { SignIn } from '../../../src/features/auth/ui/SignIn';
import { RegisterScreen } from '../../../src/features/auth/ui/RegisterScreen';
import { store } from '../../../src/store';
import { api } from '../../../src/store/api/baseApi';
import i18n from '../../../src/utils/i18n';
// Visual-preview-only: the toast dependency uses deprecated RN SafeAreaView.
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);
i18n.changeLanguage('fr');
const Stack=createNativeStackNavigator();
function PreviewTheme(){const {setThemeMode}=useTheme();React.useEffect(()=>setThemeMode('light'),[setThemeMode]);return null;}
function Preview(){
 const [ready,setReady]=React.useState(false);
 React.useEffect(()=>{SplashScreen.hide(); store.dispatch(api.util.upsertQueryData('getServices',{lang:'fr'},{success:true,data:[]})).then(()=>setReady(true));},[]);
 return <AppProviders><SafeAreaView style={{flex:1,alignItems:'center',backgroundColor:'white'}}><View style={{width:390,flex:1}}><SafeAreaProvider>{ready?<><PreviewTheme /><NavigationContainer initialState={{index:1,routes:[{name:"PreviewStart"},{name:"SignIn",params:{role:"professional"}}]}}><Stack.Navigator screenOptions={{headerShown:false}}><Stack.Screen name="PreviewStart" component={View} /><Stack.Screen name="AccountType" component={AccountTypeScreen} /><Stack.Screen name="ForgetPassword" component={ForgetPassword} /><Stack.Screen name="SignIn" component={SignIn} /><Stack.Screen name="RegisterScreen" component={RegisterScreen} initialParams={{role:'professional'}} /></Stack.Navigator></NavigationContainer></>:null}</SafeAreaProvider></View></SafeAreaView></AppProviders>;
}
AppRegistry.registerComponent('Pro24Home',()=>Preview);
