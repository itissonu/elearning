// // App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { Text } from 'react-native';
import { ThemeProvider } from './android/app/src/contex/ThemeContex';
import { AuthProvider } from './android/app/src/contex/AuthContex';
import AppNavigator from './android/app/src/navigation/AppNavigator';
enableScreens();

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>

    </ThemeProvider>
  );
}

const HomeScreen = () => <Text>Home</Text>;
const DetailScreen = () => <Text>Details</Text>;
