import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/contex/AuthContex';

import OnboardingNavigator from './OnboardingNavigator';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './Tabnavigator';
import ExampleScreen from '../screens/ExampleScreen';

const Stack = createNativeStackNavigator();

const LoggedInNavigator = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
        <Stack.Screen name="ExampleScreen" component={ExampleScreen} />
    </Stack.Navigator>
);

const AppNavigator = () => {
    const { isLoggedIn } = useAuth();
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem('hasLaunched').then((value) => {
            if (value === null) {
                AsyncStorage.setItem('hasLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        });
    }, []);

    if (isFirstLaunch === null) {
        // Optional: show loading while AsyncStorage is checked
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isFirstLaunch ? (
                <OnboardingNavigator />
            ) : isLoggedIn ? (
                <LoggedInNavigator />
            ) : (
                <AuthNavigator />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
