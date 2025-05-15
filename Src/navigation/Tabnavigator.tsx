// src/navigation/TabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/home/HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import HomeScreen from '../screens/HomeScreen';
// import ExploreScreen from '../screens/ExploreScreen';
// import CourseDetailScreen from '../screens/CourseDetailScreen';
// import VideoPlayerScreen from '../screens/VideoPlayerScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import EditProfileScreen from '../screens/EditProfileScreen';
// import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Home Stack
const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
    {/* <HomeStack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <HomeStack.Screen name="VideoPlayer" component={VideoPlayerScreen} /> */}
  </HomeStack.Navigator>
);

// Explore Stack
// const ExploreStackNavigator = () => (
//   <ExploreStack.Navigator screenOptions={{ headerShown: false }}>
//     <ExploreStack.Screen name="ExploreScreen" component={ExploreScreen} />
//     <ExploreStack.Screen name="CourseDetail" component={CourseDetailScreen} />
//     <ExploreStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
//   </ExploreStack.Navigator>
// );

// Profile Stack
// const ProfileStackNavigator = () => (
//   <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
//     <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
//     <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
//     <ProfileStack.Screen name="Settings" component={SettingsScreen} />
//   </ProfileStack.Navigator>
// );

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName = 'home';
          if (route.name === 'Explore') iconName = 'explore';
          else if (route.name === 'Profile') iconName = 'person';
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      {/* <Tab.Screen name="Explore" component={ExploreStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;
