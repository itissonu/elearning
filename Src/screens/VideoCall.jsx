import 'react-native-get-random-values';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  mediaDevices,
  RTCView,
} from 'react-native-webrtc';

// Improved function to create a room via /call endpoint
const createRoom = async (serverUrl, roomId) => {
  try {
    console.log(`Creating room with ID: ${roomId} at ${serverUrl}/call`);
    const response = await fetch(`${serverUrl}/call`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `call=${roomId}`,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.status}`);
    }
    console.log(response.url)
    const redirectUrl = response.url;
    const callId = redirectUrl.split('/').pop();
    console.log(`Room created successfully. Call ID: ${callId}`);
    return callId;
  } catch (err) {
    console.error('Failed to create room:', err);
    throw new Error(`Failed to create room: ${err.message}`);
  }
};

// Improved function to fetch ICE servers
const fetchICEServers = async (serverUrl, callId) => {
  try {
    // Based on the logs, the actual endpoint might be different
    // Try the directly observed URL from the logs first
    const configUrl = `${serverUrl}/call/${callId}`;
    console.log(`Fetching ICE servers from: ${configUrl}`);
    
    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      console.warn(`Failed to fetch ICE servers: ${response.status}. Using default STUN server.`);
      // Even though we get a 404, the connection seems to continue with default STUN server
      // This is what we see in the logs
      return [{ urls: 'stun:stun.l.google.com:19302' }];
    }
    
    try {
      //const config = await response.json();
     // console.log('ICE servers received:', config);
      console.log(JSON.parse(response))
      //return config.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }];
        return  [{ urls: 'stun:stun.l.google.com:19302' }];
    } catch (jsonError) {
      console.error('Failed to parse ICE servers response:', jsonError);
      const text = await response.text();
      console.log('Raw response text:', text);
      
      // Try to parse the text if it might be JSON with incorrect Content-Type
      try {
        if (text && text.includes('urls')) {
          const parsedFromText = JSON.parse(text);
          return parsedFromText.iceServers || [{ urls: 'stun:stun.l.google.com:19302' }];
        }
      } catch (e) {
        console.error('Failed secondary parsing attempt:', e);
      }
      
      return [{ urls: 'stun:stun.l.google.com:19302' }]; // Fallback
    }
  } catch (err) {
    console.error('Network error fetching ICE servers:', err);
    return [{ urls: 'stun:stun.l.google.com:19302' }]; // Fallback
  }
};

const generateClientId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// WebRTC & WebSocket connection management
export const WebRTCManager = ({ roomId, onError, serverUrl = 'http://192.168.29.80:3000' }) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [connected, setConnected] = useState(false);
  const [iceServers, setIceServers] = useState([{ urls: 'stun:stun.l.google.com:19302' }]);
  const [callId, setCallId] = useState(null);

  // References
  const wsRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const localStreamRef = useRef(null);
  const clientIdRef = useRef(generateClientId());

  // Parse and handle WebSocket messages
  const handleWebSocketMessage = (event) => {
    try {
      // Log raw data for debugging
      console.log('Raw WebSocket message received:', event.data);
      
      // Handle potential non-JSON responses
      if (typeof event.data !== 'string' || !event.data.trim().startsWith('{')) {
        console.log('Received non-JSON message:', event.data);
        return;
      }
      
      const message = JSON.parse(event.data);
      console.log('Received message:', message.type, message.payload);

      switch (message.type) {
        case 'wsRoomJoin': // Another client joined
          console.log('Peer joined:', message.payload);
          if (message.payload?.peerId && message.payload.peerId !== clientIdRef.current) {
            console.log(`Creating peer connection with ${message.payload.peerId} as initiator`);
            createPeerConnection(message.payload.peerId, true); // Initiate connection
          }
          break;
        case 'ready': // Server confirms room join and sends user list
          console.log('Joined room successfully:', message.payload);
          setConnected(true);
          Alert.alert('Connected', 'Joined room successfully');
          // Handle existing users in the room
          if (message.payload?.users) {
            console.log(`Room has ${Object.keys(message.payload.users).length} existing users`);
            Object.keys(message.payload.users).forEach((peerId) => {
              if (peerId !== clientIdRef.current) {
                console.log(`Creating connection with existing peer ${peerId}`);
                createPeerConnection(peerId, true); // Initiate connection to existing peers
              }
            });
          }
          break;

        case 'wsRoomLeave': // A client left
          console.log('Peer left:', message.payload);
          if (message.payload) {
            const peerId = message.payload; // RoomLeave is just clientID
            if (peerConnectionsRef.current[peerId]) {
              console.log(`Closing connection with peer ${peerId} who left`);
              peerConnectionsRef.current[peerId].close();
              delete peerConnectionsRef.current[peerId];
              setRemoteStreams((prev) => {
                const updated = { ...prev };
                delete updated[peerId];
                return updated;
              });
            }
          }
          break;
        case 'users': // Update on users joining/leaving
          console.log('Users update:', message.payload);
          if (message.payload?.initiator?.clientId && message.payload.initiator.clientId !== clientIdRef.current) {
            console.log(`Received users update with initiator ${message.payload.initiator.clientId}`);
            createPeerConnection(message.payload.initiator.clientId, false); // Non-initiator
          }
          break;

        case 'signal': // WebRTC signaling message
          if (message.payload) {
            console.log(`Received signal message for client ${message.payload.clientId}`);
            handleSignal(message.payload);
          }
          break;

        case 'hangUp': // A peer has left
          console.log('Peer left:', message.payload?.clientId);
          if (message.payload?.clientId) {
            const peerId = message.payload.clientId;
            if (peerConnectionsRef.current[peerId]) {
              console.log(`Closing connection with peer ${peerId} who hung up`);
              peerConnectionsRef.current[peerId].close();
              delete peerConnectionsRef.current[peerId];
              setRemoteStreams((prev) => {
                const updated = { ...prev };
                delete updated[peerId];
                return updated;
              });
            }
          }
          break;
          
        case 'error': // Server error message
          console.error('Server error:', message.payload);
          onError && onError(`Server error: ${message.payload || 'Unknown error'}`);
          break;
          
        case 'ping':
          // Server sent a ping, respond with pong
          console.log('Received ping from server, sending pong');
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'pong' }));
          }
          break;
          
        case 'pong':
          // Server responded to our ping
          console.log('Received pong from server');
          break;

        default:
          console.log('Unhandled message type:', message.type);
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err, event.data);
      onError && onError('Failed to process message from server');
    }
  };

  // Handle WebRTC signaling messages
  const handleSignal = async (payload) => {
    if (!payload || !payload.clientId || !payload.data) {
      console.warn('Invalid signal payload:', payload);
      return;
    }

    const { clientId, data } = payload;

    try {
      if (!peerConnectionsRef.current[clientId]) {
        console.log(`Creating new peer connection for ${clientId} (not initiator) to handle signal`);
        createPeerConnection(clientId, false);
      }

      const pc = peerConnectionsRef.current[clientId];

      if (data.type === 'offer') {
        console.log(`Received offer from ${clientId}`, data);
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        
        // Create and set local answer
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        
        // Send the answer back
        console.log(`Sending answer to ${clientId}`, answer);
        sendSignal(clientId, pc.localDescription);
        
        // After sending answer, explicitly send any existing ice candidates
        // This can help establish connection more reliably
        console.log('Checking for any pending ICE candidates to send');
      } else if (data.type === 'answer') {
        console.log(`Received answer from ${clientId}`, data);
        await pc.setRemoteDescription(new RTCSessionDescription(data));
        console.log(`Set remote description from ${clientId}`);
      } else if (data.candidate) {
        console.log(`Received ICE candidate from ${clientId}`, data.candidate);
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data));
          console.log(`Added ICE candidate from ${clientId}`);
        } catch (icErr) {
          // This can happen if we try to add an ICE candidate before setting remote description
          console.error(`Failed to add ICE candidate from ${clientId}:`, icErr);
          // Store the candidate for later if needed
        }
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
      console.log('Using ICE servers:', iceServers);

      // Close existing connection if any
      if (peerConnectionsRef.current[peerId]) {
        peerConnectionsRef.current[peerId].close();
      }

      const pc = new RTCPeerConnection({ iceServers });
      peerConnectionsRef.current[peerId] = pc;

      // Add local tracks to the connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          console.log(`Adding track to peer connection: ${track.kind}`);
          pc.addTrack(track, localStreamRef.current);
        });
      } else {
        console.warn('No local stream available when creating peer connection');
      }

      // ICE candidate handling
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`Generated ICE candidate for ${peerId}`, event.candidate);
          sendSignal(peerId, { candidate: event.candidate });
        }
      };

      // Connection state monitoring
      pc.onconnectionstatechange = () => {
        console.log(`Connection state with ${peerId}: ${pc.connectionState}`);
        if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
          console.warn(`Connection with ${peerId} is ${pc.connectionState}`);
        }
      };

      // ICE connection state monitoring
      pc.oniceconnectionstatechange = () => {
        console.log(`ICE connection state with ${peerId}: ${pc.iceConnectionState}`);
      };

      // Remote track handling
      pc.ontrack = (event) => {
        console.log(`Received track from ${peerId}: ${event.track.kind}`);
        if (event.streams && event.streams[0]) {
          console.log(`Setting remote stream for ${peerId}`);
          setRemoteStreams((prev) => ({
            ...prev,
            [peerId]: event.streams[0],
          }));
        }
      };

      // If initiator, create and send offer
      if (isInitiator) {
        console.log(`Creating offer as initiator for ${peerId}`);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log(`Sending offer to ${peerId}`, pc.localDescription);
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
          clientId: peerId,
          data,
        },
      };
      console.log(`Sending signal to ${peerId}:`, message.type);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not open, cannot send signal. ReadyState:', wsRef.current?.readyState);
      onError && onError('Connection to server lost');
    }
  };

  // Connect to WebSocket server
  const connectWebSocket = (cId) => {
    if (!cId) {
      console.error('Cannot connect WebSocket: No call ID available');
      return;
    }

    try {
      const wsUrl = `ws://192.168.29.80:3000/ws/${cId}`;
      console.log(`Connecting to WebSocket at ${wsUrl}`);
      
      const ws = new WebSocket(wsUrl);
      
      // Add ping function to keep connection alive
      const pingInterval = {
        current: null
      };
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        wsRef.current = ws;
        
        // Send join message
        const joinMessage = {
          type: 'join',
          payload: {
            room: cId,
            clientId: clientIdRef.current,
          },
        };
        console.log('Sending join message:', joinMessage);
        ws.send(JSON.stringify(joinMessage));
        
        // Set up ping interval to keep connection alive
        // Send a ping every 15 seconds to prevent timeout
        pingInterval.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log('Sending ping to keep connection alive');
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 15000);
      };

      ws.onmessage = (event) => {
        // Handle any potential pong messages first
        if (event.data === 'pong' || (typeof event.data === 'string' && event.data.includes('pong'))) {
          console.log('Received pong from server');
          return;
        }
        
        // Process regular messages
        handleWebSocketMessage(event);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError && onError('Connection error');
        
        // Clear ping interval on error
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
        }
        
        // Attempt to reconnect after a delay if connection is lost
        setTimeout(() => {
          if (wsRef.current !== ws) return; // Skip if a new connection was already created
          console.log('Attempting to reconnect WebSocket...');
          connectWebSocket(cId);
        }, 5000);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setConnected(false);
        
        // Clear ping interval
        if (pingInterval.current) {
          clearInterval(pingInterval.current);
        }
        
        if (event.code === 1000) {
          console.log('Server closed connection normally. This may be due to inactivity or session timeout.');
          onError && onError('Connection closed by server. This may be due to inactivity.');
          
          // Attempt to reconnect after a delay for normal closures
          setTimeout(() => {
            if (wsRef.current !== ws) return; // Skip if a new connection was already created
            console.log('Attempting to reconnect WebSocket after normal closure...');
            connectWebSocket(cId);
          }, 2000);
        } else {
          onError && onError(`Connection closed: ${event.reason || 'Unknown reason'} (Code: ${event.code})`);
        }
      };
      
      return ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      onError && onError(`Failed to connect: ${err.message}`);
      return null;
    }
  };

  // Initialize local media, fetch ICE servers, create room, and connect WebSocket
  useEffect(() => {
    let mounted = true;

    const initConnection = async () => {
      try {
        console.log('Initializing connection...');
        
        // Step 1: Get local media stream
        console.log('Requesting media permissions...');
        const stream = await mediaDevices.getUserMedia({
          audio: true,
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (!mounted) {
          console.log('Component unmounted, cleaning up media stream');
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        console.log('Media stream obtained successfully');
        localStreamRef.current = stream;
        setLocalStream(stream);

        // Step 2: Create room via /call endpoint
        console.log('Creating room...');
        const cId = await createRoom(serverUrl, roomId);
        console.log(`Room created with call ID: ${cId}`);
        setCallId(cId);

        // Step 3: Fetch ICE servers
        console.log('Fetching ICE servers...');
        const iceServerList = await fetchICEServers(serverUrl, cId);
        console.log('ICE servers received:', iceServerList);
        setIceServers(iceServerList);

        // Step 4: Connect to WebSocket with the obtained call ID
        console.log('Connecting to WebSocket...');
        connectWebSocket(cId || roomId);
        
      } catch (err) {
        console.error('Failed to initialize connection:', err);
        if (err.name === 'NotAllowedError') {
          onError && onError('Camera and microphone permissions are required');
        } else {
          onError && onError(`Failed to connect: ${err.message}`);
        }
      }
    };

    initConnection();

    return () => {
      mounted = false;
      console.log('Cleaning up resources...');
      
      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach((pc) => {
        if (pc && typeof pc.close === 'function') {
          pc.close();
        }
      });
      
      // Close WebSocket connection
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      
      // Stop local media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomId, serverUrl]);

  return {
    localStream,
    remoteStreams,
    connected,
  };
};

// Main video call component
const VideoCallScreen = ({ roomId, onEndCall, serverUrl = 'http://192.168.29.80:3000' }) => {
  const [error, setError] = useState(null);

  const { localStream, remoteStreams, connected } = WebRTCManager({
    roomId,
    onError: (msg) => setError(msg),
    serverUrl,
  });

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Text style={styles.roomTitle}>Room: {roomId}</Text>
      <Text style={styles.connectionStatus}>
        Status: {connected ? 'Connected' : 'Disconnected'}
      </Text>

      {/* Local stream display */}
      <View style={styles.localStreamContainer}>
        {localStream ? (
          <RTCView streamURL={localStream.toURL()} style={styles.localStream} objectFit="cover" />
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
              <RTCView streamURL={stream.toURL()} style={styles.remoteStream} objectFit="cover" />
              <Text style={styles.userLabel}>User: {userId.substring(0, 8)}</Text>
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
    aspectRatio: 4 / 3,
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