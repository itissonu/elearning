import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView
} from 'react-native-webrtc';

// WebRTC & WebSocket connection management
export const WebRTCManager = ({ roomId, onError }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [connected, setConnected] = useState(false);
  
  // References
  const wsRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const localStreamRef = useRef(null);
  
  // Parse and handle WebSocket messages
  const handleWebSocketMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log('Received message:', message.type);
      
      switch (message.type) {
        case 'wsRoomJoin': // Handle room join acknowledgment
          console.log('Joined room successfully:', message);
          setConnected(true);
          Alert.alert('Joined room successfully');
          
          
          break;
        
        case 'peerJoin': // A new peer has joined
          console.log('Peer joined:', message.payload && message.payload.peerId);
          if (message.payload && message.payload.peerId) {
            createPeerConnection(message.payload.peerId, true); // Create as initiator
          }
          break;
          
        case 'peerLeave': // A peer has left
          console.log('Peer left:', message.payload && message.payload.peerId);
          if (message.payload && message.payload.peerId) {
            const peerId = message.payload.peerId;
            if (peerConnectionsRef.current[peerId]) {
              peerConnectionsRef.current[peerId].close();
              delete peerConnectionsRef.current[peerId];
              
              // Remove from remote streams
              setRemoteStreams(prev => {
                const updated = {...prev};
                delete updated[peerId];
                return updated;
              });
            }
          }
          break;
        
        case 'signal': // WebRTC signaling message
          if (message.payload) {
            handleSignal(message.payload);
          }
          break;
          
        case 'error': // Error message from server
          console.error('Server error:', message.payload);
          onError && onError(`Server error: ${message.payload || 'Unknown error'}`);
          break;
          
        default:
          console.log('Unhandled message type:', message.type);
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
      onError && onError('Failed to process message from server');
    }
  };
  
  // Handle WebRTC signaling messages
  const handleSignal = async (payload) => {
    if (!payload || !payload.peerId || !payload.data) {
      console.warn('Invalid signal payload:', payload);
      return;
    }
    
    const { peerId, data } = payload;
    
    try {
      // Create peer connection if it doesn't exist
      if (!peerConnectionsRef.current[peerId]) {
        createPeerConnection(peerId, false);
      }
      
      const pc = peerConnectionsRef.current[peerId];
      
      if (data.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        // Send answer back
        sendSignal(peerId, pc.localDescription);
      } 
      else if (data.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(data));
      } 
      else if (data.candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(data));
      }
    } catch (err) {
      console.error('Error handling signal:', err);
      onError && onError('Failed to process signaling message');
    }
  };
  
  // Create and configure a peer connection for a specific user
  const createPeerConnection = async (peerId, isInitiator) => {
    try {
      console.log(`Creating peer connection with ${peerId}, initiator: ${isInitiator}`);
      
      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      };
      
      const pc = new RTCPeerConnection(configuration);
      peerConnectionsRef.current[peerId] = pc;
      
      // Add all local tracks to the connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          pc.addTrack(track, localStreamRef.current);
        });
      }
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal(peerId, { candidate: event.candidate });
        }
      };
      
      // Handle connection state changes
      pc.onconnectionstatechange = () => {
        console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
      };
      
      // Handle remote tracks
      pc.ontrack = (event) => {
        console.log(`Received track from ${peerId}`);
        
        if (event.streams && event.streams[0]) {
          setRemoteStreams(prev => ({
            ...prev,
            [peerId]: event.streams[0]
          }));
        }
      };
      
      // If we're the initiator, create and send offer
      if (isInitiator) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        sendSignal(peerId, pc.localDescription);
      }
      
      return pc;
    } catch (err) {
      console.error('Error creating peer connection:', err);
      onError && onError('Failed to create peer connection');
      return null;
    }
  };
  
  // Send signaling data through WebSocket
  const sendSignal = (peerId, data) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const message = {
        type: 'signal',
        payload: {
          peerId,
          data
        }
      };
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not open, cannot send signal');
      onError && onError('Connection to server lost');
    }
  };
  
  // Initialize local media and WebSocket connection
  useEffect(() => {
    let mounted = true;
    
    const initConnection = async () => {
      try {
        // Get local media stream
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });
        
        if (!mounted) {
          // Component unmounted during async operation
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        localStreamRef.current = stream;
        setLocalStream(stream);
        
        console.log("Connecting to room:", roomId);
        // Connect to WebSocket server
        const serverUrl = `ws://192.168.29.80:3000/ws/signaling/${roomId}`;
        console.log("WebSocket URL:", serverUrl);
        const ws = new WebSocket(serverUrl);
        
        ws.onopen = () => {
          console.log('WebSocket connection established');
          wsRef.current = ws;
          setConnected(true);
          
          // Join the room - send join message
          const joinMessage = {
            type: 'joinRoom',
            payload: {
              roomId: roomId,
              // Add any additional metadata if needed
              metadata: {
                name: 'React Native Client'
              }
            }
          };
          console.log("Sending join message:", joinMessage);
          ws.send(JSON.stringify(joinMessage));
        };
        
        ws.onmessage = handleWebSocketMessage;
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          onError && onError('Connection error');
        };
        
        ws.onclose = (event) => {
       
          console.log('WebSocket connection closed:', event.code, event.reason);
          setConnected(false);
          onError && onError(`Connection closed: ${event.reason || 'Unknown reason'}`);
        };
        
      } catch (err) {
        console.error('Failed to initialize connection:', err);
        if (err.name === 'NotAllowedError') {
          onError && onError('Camera and microphone permissions are required');
        } else {
          onError && onError('Failed to connect: ' + err.message);
        }
      }
    };
    
    initConnection();
    
    // Clean up on unmount
    return () => {
      mounted = false;
      
      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach(pc => {
        pc.close();
      });
      
      // Close WebSocket
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      // Stop local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);
  
  return {
    localStream,
    remoteStreams,
    connected
  };
};

// Main video call component
const VideoCallScreen = ({ roomId, onEndCall }) => {
  const [error, setError] = useState(null);
  
  const { localStream, remoteStreams, connected } = WebRTCManager({
    roomId,
    onError: (msg) => setError(msg)
  });
  
  useEffect(() => {
    
  }, [error,connected]);
  
  return (
    <View style={styles.container}>
      <Text style={styles.roomTitle}>Room: {roomId}</Text>
      <Text style={styles.connectionStatus}>
        Status: {connected ? 'Connected' : 'Disconnected'}
      </Text>
      
      {/* Local stream display */}
      <View style={styles.localStreamContainer}>
        {localStream ? (
          <RTCView
            streamURL={localStream.toURL()}
            style={styles.localStream}
            objectFit="cover"
          />
        ) : (
          <View style={styles.loadingStream}>
            <Text>Setting up camera...</Text>
          </View>
        )}
      </View>
      
      {/* Remote streams display */}
      <View style={styles.remoteStreamsContainer}>
        {Object.entries(remoteStreams).length > 0 ? (
          Object.entries(remoteStreams).map(([userId, stream]) => (
            <View key={userId} style={styles.remoteStreamWrapper}>
              <RTCView
                streamURL={stream.toURL()}
                style={styles.remoteStream}
                objectFit="cover"
              />
              <Text style={styles.userLabel}>User: {userId}</Text>
            </View>
          ))
        ) : (
          <View style={styles.noRemoteStreams}>
            <Text>No participants yet</Text>
          </View>
        )}
      </View>
      
      <Button title="End Call" onPress={onEndCall} color="#FF3B30" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  connectionStatus: {
    fontSize: 14,
    marginBottom: 10,
    color: '#555',
  },
  localStreamContainer: {
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#DDD',
  },
  localStream: {
    flex: 1,
  },
  loadingStream: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteStreamsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  remoteStreamWrapper: {
    width: '48%',
    aspectRatio: 4/3,
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#DDD',
  },
  remoteStream: {
    flex: 1,
  },
  userLabel: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 3,
    borderRadius: 5,
    fontSize: 12,
  },
  noRemoteStreams: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VideoCallScreen;