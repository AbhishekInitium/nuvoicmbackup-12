
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import axios from 'axios';
import { supabase } from "@/integrations/supabase/client";

// Base URL for API requests - use local server when in development
const API_BASE_URL = 'http://localhost:3001/api/incentives';
const ADMIN_API_URL = 'http://localhost:3001/api/admin';

// Check if MongoDB connection is working via Supabase
export const testMongoDBConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing MongoDB connection via Supabase...');
    const { data, error } = await supabase.functions.invoke('connect-mongodb');
    
    if (error) {
      console.error('Error connecting to MongoDB:', error);
      return false;
    }
    
    console.log('MongoDB connection test result:', data);
    return data?.status === 'Connected';
  } catch (error) {
    console.error('Error testing MongoDB connection:', error);
    return false;
  }
};

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
 * Get all versions of a specific incentive scheme
 * @param schemeId The unique identifier for the scheme family
 */
export const getSchemeVersions = async (schemeId: string): Promise<IncentivePlan[]> => {
  try {
    console.log(`Fetching all versions of scheme with ID: ${schemeId}`);
    const response = await axios.get(`${API_BASE_URL}/versions/${schemeId}`);
    console.log(`Fetched ${response.data.length} versions of scheme ${schemeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching scheme versions for ${schemeId}:`, error);
    throw new Error(`Failed to fetch scheme versions: ${error instanceof Error ? error.message : String(error)}`);
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

/**
 * Get all scheme administrator configurations
 */
export const getSchemeAdminConfigs = async (): Promise<SchemeAdminConfig[]> => {
  try {
    console.log('Fetching scheme admin configurations from MongoDB...');
    const response = await axios.get(ADMIN_API_URL);
    console.log(`Fetched ${response.data.length} admin configurations from MongoDB`);
    return response.data;
  } catch (error) {
    console.error('Error fetching scheme admin configurations:', error);
    throw new Error(`Failed to fetch admin configurations: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Save a scheme administrator configuration to MongoDB
 * For new configs, creates a new document
 * For existing configs, updates the existing document
 */
export const saveSchemeAdmin = async (config: SchemeAdminConfig): Promise<string> => {
  try {
    console.log('Saving scheme admin configuration to MongoDB...');
    
    // Ensure updated timestamp is set
    const configToSave = {
      ...config,
      updatedAt: new Date().toISOString()
    };
    
    // Check if this is an update or a new record
    if (config._id) {
      console.log(`Updating existing admin config with ID: ${config._id}`);
      const response = await axios.put(`${ADMIN_API_URL}/${config._id}`, configToSave);
      
      if (response.status === 200) {
        console.log(`Successfully updated admin config with ID: ${config._id}`);
        return config._id;
      } else {
        throw new Error(`Unexpected response when updating admin config: ${response.status}`);
      }
    } else {
      // This is a new config
      console.log('Creating new admin config');
      const response = await axios.post(ADMIN_API_URL, configToSave);
      
      if (response.status === 201 && response.data._id) {
        console.log(`Successfully created admin config with MongoDB ID: ${response.data._id}`);
        return response.data._id;
      } else {
        throw new Error(`Unexpected response when creating admin config: ${response.status}`);
      }
    }
  } catch (error) {
    console.error('Error saving scheme admin configuration:', error);
    throw new Error(`Failed to save admin configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get a specific scheme administrator configuration
 */
export const getSchemeAdminConfig = async (configId: string): Promise<SchemeAdminConfig> => {
  try {
    console.log(`Fetching scheme admin configuration with ID: ${configId}`);
    const response = await axios.get(`${ADMIN_API_URL}/${configId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching admin configuration ${configId}:`, error);
    throw new Error(`Failed to fetch admin configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
};
