// src/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import MyCoursesScreen from '../screens/course/MyCourses';
import ProfileScreen from '../screens/profile/ProfileScreen';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ----- Home Stack -----
const HomeStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeScreen" component={HomeScreen} />
 
  </Stack.Navigator>
);

// ----- Search Stack -----
const SearchStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
  </Stack.Navigator>
);

// ----- My Courses Stack -----
const MyCoursesStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MyCoursesScreen" component={MyCoursesScreen} />
  </Stack.Navigator>
);

// ----- Profile Stack -----
const ProfileStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);


const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'MyCourses') iconName = 'play-circle-outline';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Search" component={SearchStackNavigator} />
      <Tab.Screen name="MyCourses" component={MyCoursesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
