import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { LocationPermissionScreen } from '../screens/onboarding/LocationPermissionScreen';
import { InterestsScreen } from '../screens/onboarding/InterestsScreen';
import { LookingForScreen } from '../screens/onboarding/LookingForScreen';

const Stack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OnboardingLocation" component={LocationPermissionScreen} />
      <Stack.Screen name="OnboardingInterests" component={InterestsScreen} />
      <Stack.Screen name="OnboardingLookingFor" component={LookingForScreen} />
    </Stack.Navigator>
  );
};
