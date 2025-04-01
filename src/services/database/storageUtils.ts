
import axios from 'axios';

/**
 * Checks if the MongoDB connection is available
 * @returns Promise resolving to true if MongoDB is connected, false otherwise
 */
export const isMongoConnected = async (): Promise<boolean> => {
  try {
    const response = await axios.get('/api/db-status');
    return response.data.connected;
  } catch (error) {
    console.error('Error checking MongoDB connection status:', error);
    return false;
  }
};
