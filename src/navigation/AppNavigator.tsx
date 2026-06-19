import React, { FunctionComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { AppStackType, BottomTabType } from './constant/core';
import Text from '@components/Text';
import { Welcome, VerifyAccountScreen, RegisterScreen, SignIn } from '@screens/index';
import styled from 'styled-components/native';
import { Platform, View } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { horizontalScale, moderateScale, verticalScale } from '@utils/normalizedCss';
import { AccountPendingScreen } from '@screens/Home';
import { Button } from '@components/index';
import { colors } from '@theme/index';
import { IconName } from '@components/Icon';
import ClientHome from '@screens/Home/client/screens/HomeClient';
import { NotificationsScreen } from '@screens/Notification';
import {
  AddAddressScreen, InterventionSuccessScreen, NewInterventionScreen, PaymentTravelFeeScreen, PriceEstimationScreen

} from '@screens/Intervention/index';

const { Navigator: BottomTabNavigator, Screen: BottomTabScreen } =
  createBottomTabNavigator<BottomTabType>();



const BottomTabsWrapper = styled(View) <{ insets: EdgeInsets }>`
position: absolute;
bottom: ${({ insets }) => Platform.OS === 'ios' ? 0 : insets.bottom}px;
left: 0;
right: 0;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.96);
  border-radius: ${moderateScale(16)}px;

  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.08;
  shadow-radius: ${moderateScale(16)}px;
  elevation: 12;
  height: ${verticalScale(60)}px;
  margin: ${horizontalScale(19)}px;

`;

const TabItem = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const ActiveIndicator = styled.View<{ isSelected: boolean }>`
  width: ${horizontalScale(34)}px;
  height: ${verticalScale(2)}px;
  border-radius: ${moderateScale(4)}px;
  background-color: ${({ isSelected }) =>
    isSelected ? colors.primary : 'transparent'};

`;


const BottomTabBar: FunctionComponent<BottomTabBarProps> = ({
  navigation,
  state,
}) => {
  const insets = useSafeAreaInsets();

  const navigate = (index: number) => {
    const routeName = state.routeNames[index];

    if (routeName) {
      navigation.navigate(routeName);
    }
  };

  const bottomTabs: {
    index: number;
    icon: IconName;
    title: string;
  }[] = [
      {
        index: 0,
        icon: 'fa-home',
        title: 'Home',
      },
      {
        index: 1,
        icon: 'fa-list',
        title: 'Intervention',
      },
      {
        index: 2,
        icon: 'fa-cog',
        title: 'Params',
      },
    ];

  return (
    <BottomTabsWrapper insets={insets}>
      {bottomTabs.map(({ icon, index, title }) => {
        const isSelected = index === state.index;

        return (
          <TabItem
            key={`bottom-tab-${index}`}
            activeOpacity={0.85}
            onPress={() => navigate(index)}
          >
            <ActiveIndicator isSelected={isSelected} />

            <Button
              icon={icon}
              color={isSelected ? colors.primary : colors.gray600}
              type="icon"
              variant="ghost"
              iconSize={moderateScale(24)}
              onPress={() => navigate(index)}

              style={{ marginBottom: -verticalScale(8) }}
            />

            <Text
              variant="regularSmall"
              color={isSelected ? colors.primary : colors.gray700}
              fontSize={12}
              lineHeight={16}

            >
              {title}
            </Text>
          </TabItem>
        );
      })}
    </BottomTabsWrapper>
  );
};




const TabNavigator = () => {
  return (
    <BottomTabNavigator
      initialRouteName="Home"
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <BottomTabScreen name="Home" component={ClientHome} />
      <BottomTabScreen name="ListIntervention" component={NewInterventionScreen} />
      <BottomTabScreen name="SettingPage" component={ClientHome} />
    </BottomTabNavigator>
  );
};

// Create navigators
const Stack = createNativeStackNavigator<AppStackType>();




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
        <Stack.Screen name="VerifyScreen" component={VerifyAccountScreen} />
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="AccountPendingScreen" component={AccountPendingScreen} />

        <Stack.Screen name="AddAddress" component={AddAddressScreen} />


        {/* Main Tabs */}
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="NewIntervention" component={NewInterventionScreen} />
        <Stack.Screen name="PriceEstimation" component={PriceEstimationScreen} />
        <Stack.Screen name="PaymentTravelFee" component={PaymentTravelFeeScreen} />
        <Stack.Screen name="InterventionSuccess" component={InterventionSuccessScreen} />





        {/* Profile Screens

              
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