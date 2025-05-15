
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartedScreen from '../screens/GetStartedScreen';


const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GetStarted" component={GetStartedScreen} />
  </Stack.Navigator>
);

export default OnboardingNavigator;
