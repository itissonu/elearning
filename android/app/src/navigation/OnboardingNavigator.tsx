
import React from 'react';

import GetStartedScreen from '../screens/GetStartedScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const OnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GetStarted" component={GetStartedScreen} />
  </Stack.Navigator>
);

export default OnboardingNavigator;
