import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';


import AuthNavigator from './AuthNavigator';

import { useAuth } from '../contex/AuthContex';
import TabNavigator from './Tabnavigator';
import GetStartedScreen from '../screens/GetStartedScreen';
import OnboardingNavigator from './OnboardingNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


const AppNavigator = () => {
    const { isLoggedIn } = useAuth(); // Mocked for now
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

    // if (isFirstLaunch === null) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //             <ActivityIndicator size="large" />
    //         </View>
    //     );
    // }


    return (
        <NavigationContainer>
            {isFirstLaunch ? (
                <OnboardingNavigator />
            ) : isLoggedIn ? (
                <TabNavigator />
            ) : (
                <AuthNavigator />
            )}

        </NavigationContainer>


        //  <NavigationContainer>
           
        //         <OnboardingNavigator />
          

        // </NavigationContainer>
    );
};

export default AppNavigator;
