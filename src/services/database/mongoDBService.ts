
import axios from 'axios';
import { IncentivePlan } from '@/types/incentiveTypes';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:3001/api/incentives';

/**
 * Get all incentive schemes from the MongoDB database
 */
export const getIncentiveSchemes = async (): Promise<IncentivePlan[]> => {
  try {
    console.log('Fetching incentive schemes from MongoDB...');
    const response = await axios.get(API_BASE_URL);
    console.log(`Fetched ${response.data.length} schemes from MongoDB`);
    return response.data;
  } catch (error) {
    console.error('Error fetching incentive schemes:', error);
    throw new Error(`Failed to fetch incentive schemes: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Save a new incentive scheme to the MongoDB database
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan, status?: string): Promise<string> => {
  try {
    console.log('Saving new incentive scheme to MongoDB...');
    console.log('Scheme data:', JSON.stringify(scheme, null, 2));
    
    // Ensure required metadata fields are included
    const schemeToSave = {
      ...scheme,
      metadata: {
        ...(scheme.metadata || {}),
        createdAt: scheme.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: scheme.metadata?.version || 1,
        status: status || scheme.metadata?.status || 'DRAFT'
      }
    };
    
    const response = await axios.post(API_BASE_URL, schemeToSave);
    
    if (response.status === 201 && response.data._id) {
      console.log(`Successfully saved scheme with MongoDB ID: ${response.data._id}`);
      return response.data._id;
    } else {
      console.error("Unexpected response when saving scheme:", response.status, response.data);
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error('Error saving incentive scheme:', error);
    throw new Error(`Failed to save scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

export const updateIncentiveScheme = async (schemeId: string, updates: Partial<IncentivePlan>, status?: string): Promise<boolean> => {
  try {
    console.log(`Creating new version for scheme ${schemeId}`);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    const version = updates.metadata?.version || 1;
    
    const updatedScheme = {
      ...updates,
      schemeId: schemeId,
      metadata: {
        ...(updates.metadata || {}),
        createdAt: updates.metadata?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: version,
        status: status || updates.metadata?.status || 'DRAFT'
      }
    };
    
    console.log("Saving new version with metadata:", JSON.stringify(updatedScheme.metadata, null, 2));
    
    const response = await axios.post(`${API_BASE_URL}/${schemeId}/version`, updatedScheme);
    
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
