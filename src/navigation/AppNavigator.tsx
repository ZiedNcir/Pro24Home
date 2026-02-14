import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import { AppStackType } from './constant/core';


import Welcome from '@screens/Welcome';
import { RegisterScreen } from '@screens/Auth/RegisterScreen';



// Create navigators
const Stack = createNativeStackNavigator<AppStackType>();
//const Tab = createBottomTabNavigator<BottomTabType>();




// Main App Navigator Component
const AppNavigator: React.FC = () => {



  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',

        }}
      >
        {/* Auth Stack */}
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />

        {/* Main Tabs */}

        {/* Profile Screens

                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
                <Stack.Screen name="RecoverPassword" component={RecoverPassword} />
                <Stack.Screen name="VerifyEmail" component={VerifyAccountScreen} />
                <Stack.Screen name="VerifyDocument" component={VerifyDocument} />

                <Stack.Screen name="EditProfile" component={EditProfileScreen} />

                {/* Vehicle & Documents 
                <Stack.Screen name="AddVehicle" component={StepAddVehicle} />
                <Stack.Screen name="Documents" component={DocumentsScreen} />
                <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />

                {/* Address Screens 
                <Stack.Screen name="AddLocation" component={AddAdress} />
                <Stack.Screen name="SelectLocationScreen" component={SelectLocationScreen} />
                <Stack.Screen name="Locations" component={TypeBatiment} />

                {/* Intervention Screens 
                <Stack.Screen name="HelpMeOut" component={AddIntervention} />
                <Stack.Screen name="InterventionDetail" component={InterventionDetail} />
                <Stack.Screen name="PrixIntervention" component={PrixIntervention} />

                {/* Professional Screens 
                <Stack.Screen name="ProfitionalPosition" component={ProfitionalPosition} />
                <Stack.Screen name="ProfessionnelHome" component={ProfessionenlhomePage} />
                */
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;