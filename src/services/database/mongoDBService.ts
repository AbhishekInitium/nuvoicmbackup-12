
import { IncentivePlan } from '@/types/incentiveTypes';
import { IncentivePlanWithStatus } from '@/services/incentive/types/incentiveServiceTypes';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';
import { testMongoDBConnection, invokeMongoDBFunction } from './mongoDBProxy';

// Export the connection test function
export { testMongoDBConnection };

/**
 * Get all incentive schemes from the MongoDB database
 */
export const getIncentiveSchemes = async (): Promise<IncentivePlan[]> => {
  try {
    console.log('Fetching incentive schemes from MongoDB...');
    const result = await invokeMongoDBFunction<IncentivePlan[]>('getIncentiveSchemes');
    console.log(`Fetched ${result.length} schemes from MongoDB`);
    return result;
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
    const result = await invokeMongoDBFunction<IncentivePlan[]>('getSchemeVersions', {
      schemeId
    });
    console.log(`Fetched ${result.length} versions of scheme ${schemeId}`);
    return result;
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
    
    const result = await invokeMongoDBFunction<{ _id: string; success: boolean }>('saveIncentiveScheme', {
      scheme,
      status
    });
    
    if (result.success && result._id) {
      console.log(`Successfully saved scheme with MongoDB ID: ${result._id}`);
      return result._id;
    } else {
      console.error("Unexpected response when saving scheme:", result);
      throw new Error('Unexpected response from server');
    }
  } catch (error) {
    console.error('Error saving incentive scheme:', error);
    throw new Error(`Failed to save scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Update an incentive scheme by creating a new version
 */
export const updateIncentiveScheme = async (schemeId: string, updates: Partial<IncentivePlan>, status?: string): Promise<boolean> => {
  try {
    console.log(`Creating new version for scheme ${schemeId}`);
    console.log('Updates:', JSON.stringify(updates, null, 2));
    
    const result = await invokeMongoDBFunction<{ _id: string; success: boolean }>('updateIncentiveScheme', {
      schemeId,
      updates,
      status
    });
    
    if (result.success && result._id) {
      console.log(`Successfully created new version with MongoDB ID: ${result._id}`);
      return true;
    } else {
      console.error("Failed to create new version: Unexpected response", result);
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
    const result = await invokeMongoDBFunction<SchemeAdminConfig[]>('getSchemeAdminConfigs');
    console.log(`Fetched ${result.length} admin configurations from MongoDB`);
    return result;
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
    
    const result = await invokeMongoDBFunction<{ _id: string; success: boolean }>('saveSchemeAdmin', {
      config
    });
    
    if (result.success && result._id) {
      console.log(`Successfully ${config._id ? 'updated' : 'created'} admin config with ID: ${result._id}`);
      return result._id;
    } else {
      throw new Error(`Unexpected response when ${config._id ? 'updating' : 'creating'} admin config`);
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
    const result = await invokeMongoDBFunction<SchemeAdminConfig>('getSchemeAdminConfig', {
      configId
    });
    return result;
  } catch (error) {
    console.error(`Error fetching admin configuration ${configId}:`, error);
    throw new Error(`Failed to fetch admin configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
};
