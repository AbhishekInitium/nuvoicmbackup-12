
import { IncentivePlan } from '@/types/incentiveTypes';
import axios from 'axios';

/**
 * Service to handle database operations for incentive schemes
 * This implementation makes API calls to a backend service that connects to MongoDB
 */

// Define the API base URL - replace with your actual backend URL when deployed
const API_BASE_URL = 'http://localhost:3001/api/incentives';

/**
 * Save an incentive scheme in MongoDB
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan): Promise<string> => {
  try {
    const response = await axios.post(API_BASE_URL, scheme);
    
    if (response.status === 201 && response.data._id) {
      console.log(`Saved scheme document with ID: ${response.data._id}`);
      return response.data._id;
    } else {
      throw new Error('Failed to save scheme: No ID returned from server');
    }
  } catch (error) {
    console.error("Error saving incentive scheme:", error);
    throw new Error(`Failed to save scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get all incentive schemes from MongoDB
 */
export const getIncentiveSchemes = async (): Promise<any[]> => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching incentive schemes:", error);
    return [];
  }
};

/**
 * Get a specific incentive scheme by ID
 */
export const getIncentiveSchemeById = async (id: string): Promise<any | null> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching incentive scheme with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete an incentive scheme by ID
 */
export const deleteIncentiveScheme = async (id: string): Promise<boolean> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting incentive scheme with ID ${id}:`, error);
    return false;
  }
};

/**
 * Update an incentive scheme
 */
export const updateIncentiveScheme = async (id: string, updates: Partial<IncentivePlan>): Promise<boolean> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updates);
    return response.status === 200;
  } catch (error) {
    console.error(`Error updating incentive scheme with ID ${id}:`, error);
    return false;
  }
};
