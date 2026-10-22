import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { ChatScreen } from '../screens/chat/ChatScreen';
import { CameraScreen } from '../screens/snaps/CameraScreen';
import { ActiveCallScreen } from '../screens/calls/ActiveCallScreen';
import { ViewProfileScreen } from '../screens/profile/ViewProfileScreen';
import { PrivacySettingsScreen } from '../screens/profile/PrivacySettingsScreen';

const RootStack = createNativeStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <RootStack.Screen name="Splash" component={SplashScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
        <RootStack.Screen name="ChatRoom" component={ChatScreen} />
        <RootStack.Screen
          name="Camera"
          component={CameraScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
        <RootStack.Screen
          name="ActiveCall"
          component={ActiveCallScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
        <RootStack.Screen name="ViewProfile" component={ViewProfileScreen} />
        <RootStack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
