// // App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { Text } from 'react-native';
import { ThemeProvider } from './Src/context/contex/ThemeContex';
import { AuthProvider } from './Src/context/contex/AuthContex';
import AppNavigator from './Src/navigation/AppNavigator';
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
