const API_BASE_URL = 'http://192.168.29.80:3000/api';

/**
 * API service for interacting with peer-calls server
 */
export default {
  /**
   * Get list of available rooms
   * @returns {Promise<Array>} Array of room objects
   */
  getRooms: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/rooms`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.rooms || [];
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  /**
   * Check if a room exists
   * @param {string} roomId - Room identifier
   * @returns {Promise<boolean>} True if room exists
   */
  checkRoom: async (roomId) => {
    try {
      const rooms = await this.getRooms();
      return rooms.some(room => room.id === roomId);
    } catch (error) {
      console.error('Error checking room:', error);
      throw error;
    }
  },

  /**
   * Join a room (creates if doesn't exist)
   * @param {string} roomId - Room identifier
   * @returns {Promise<Object>} Room connection info
   */
  joinRoom: async (roomId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/room/${roomId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to join room: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },
  
  /**
   * Get WebSocket URL for a specific room
   * @param {string} roomId - Room identifier
   * @returns {string} WebSocket URL
   */
  getSignalingURL: (roomId) => {
    return `ws://192.168.29.80:3000/ws/signaling/${roomId}`;
  }
};