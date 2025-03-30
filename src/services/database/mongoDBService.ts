
import { IncentivePlan } from '@/types/incentiveTypes';
import axios from 'axios';

/**
 * Service to handle database operations for incentive schemes
 * This implementation makes API calls to a backend service that connects to MongoDB
 */

// Define the API base URL - replace with your actual backend URL when deployed
const API_BASE_URL = 'http://localhost:3001/api/incentives';

/**
 * Generate a scheme name with timestamp format ICM_DDMMYY_HHMMSS
 */
const generateSchemeTimestampId = () => {
  const now = new Date();
  
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).substring(2);
  
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `ICM_${day}${month}${year}_${hours}${minutes}${seconds}`;
};

/**
 * Save an incentive scheme in MongoDB
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan, status: string = 'DRAFT'): Promise<string> => {
  try {
    // Generate a scheme ID if not provided
    const schemeId = scheme.schemeId || generateSchemeTimestampId();
    
    // Prepare the scheme with required fields
    const schemeToSave = {
      ...scheme,
      schemeId: schemeId,
      metadata: {
        ...(scheme.metadata || {}),
        createdAt: scheme.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: scheme.metadata?.version || 1,
        status: status
      }
    };
    
    const response = await axios.post(API_BASE_URL, schemeToSave);
    
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
 * Update an incentive scheme by creating a new version
 * Creates a completely new document with the same schemeId but incremented version
 */
export const updateIncentiveScheme = async (schemeId: string, updates: Partial<IncentivePlan>, status?: string): Promise<boolean> => {
  try {
    console.log(`Creating new version of scheme ${schemeId}`);
    
    // Make sure we have the metadata with correct version
    const version = updates.metadata?.version || 1;
    
    // Create a new document with the updated data
    const updatedScheme = {
      ...updates,
      schemeId: schemeId, // Keep the same schemeId for versioning
      metadata: {
        ...(updates.metadata || {}),
        createdAt: updates.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: version,
        status: status || updates.metadata?.status || 'DRAFT'
      }
    };
    
    console.log("Saving new version with metadata:", JSON.stringify(updatedScheme.metadata));
    
    // Important: We use POST to create a new document, not PATCH/PUT to update existing one
    const response = await axios.post(API_BASE_URL, updatedScheme);
    
    if (response.status === 201 && response.data._id) {
      console.log(`Successfully created new version with MongoDB ID: ${response.data._id}`);
      return true;
    } else {
      console.error("Failed to create new version: Unexpected response", response.status, response.data);
      return false;
    }
  } catch (error) {
    console.error(`Error creating new version of scheme ${schemeId}:`, error);
    throw new Error(`Failed to update scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Update an incentive scheme status
 */
export const updateSchemeStatus = async (id: string, status: string): Promise<boolean> => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/${id}/status`, { status });
    return response.status === 200;
  } catch (error) {
    console.error(`Error updating scheme status with ID ${id}:`, error);
    return false;
  }
};

/**
 * Get all versions of a specific scheme by scheme ID
 */
export const getSchemeVersions = async (schemeId: string): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/versions/${schemeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching versions for scheme ${schemeId}:`, error);
    return [];
  }
};
