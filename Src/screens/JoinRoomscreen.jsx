import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import VideoCallScreen from './VideoCall'; // Import the component we created earlier

const JoinRoomScreen = () => {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [inCall, setInCall] = useState(false);

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      Alert.alert('Error', 'Please enter a room ID');
      return;
    }

    // Start the video call
    setInCall(true);
  };

  const handleEndCall = () => {
    setInCall(false);
  };

  if (inCall) {
    return <VideoCallScreen roomId={roomId} onEndCall={handleEndCall} serverUrl = 'http://192.168.29.80:3000' />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join Video Call</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your Name (optional)</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Room ID</Text>
        <TextInput
          style={styles.input}
          value={roomId}
          onChangeText={setRoomId}
          placeholder="Enter room ID"
          autoCapitalize="none"
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Join Room"
          onPress={handleJoinRoom}
          color="#007AFF"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Enter a room ID to join an existing call or create a new one.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
  },
  buttonContainer: {
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#E8F0FE',
    borderRadius: 8,
  },
  infoText: {
    color: '#555',
    textAlign: 'center',
  },
});

export default JoinRoomScreen;