import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Platform, PermissionsAndroid } from 'react-native';
import JoinRoomScreen from './JoinRoomscreen';


const JoinRoomScreenMain = () => {
  // Request permissions on Android when the app loads
  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
          
          if (
            granted[PermissionsAndroid.PERMISSIONS.CAMERA] !== PermissionsAndroid.RESULTS.GRANTED ||
            granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] !== PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Camera or audio permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    
    requestPermissions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <JoinRoomScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
});

export default JoinRoomScreenMain;