
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * Service to handle database operations for incentive schemes
 * This implementation follows MongoDB schema structure but uses localStorage as a fallback
 * since direct MongoDB connections can't be made from the browser
 */

// Generate a MongoDB-like ObjectId
const generateObjectId = (): string => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16);
  const machineId = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  const processId = Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
  const counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  
  return timestamp + machineId + processId + counter;
};

/**
 * Save an incentive scheme in MongoDB-compatible format 
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan): Promise<string> => {
  try {
    // Generate MongoDB-like _id
    const objectId = generateObjectId();
    
    // Create MongoDB-style document
    const document = {
      _id: objectId,
      ...scheme,
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1,
        status: 'active'
      }
    };
    
    // For browser storage, use localStorage
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    schemes.push(document);
    localStorage.setItem('incentiveSchemes', JSON.stringify(schemes));
    
    console.log(`Saved scheme document with ID: ${objectId}`);
    console.log('Scheme stored in MongoDB-compatible format');
    
    return objectId;
  } catch (error) {
    console.error("Error saving incentive scheme:", error);
    throw new Error(`Failed to save scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get all incentive schemes in MongoDB collection format
 */
export const getIncentiveSchemes = async (): Promise<any[]> => {
  try {
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    return existingSchemes ? JSON.parse(existingSchemes) : [];
  } catch (error) {
    console.error("Error fetching incentive schemes:", error);
    return [];
  }
};

/**
 * Get a specific incentive scheme by ID (similar to MongoDB findOne)
 */
export const getIncentiveSchemeById = async (id: string): Promise<any | null> => {
  try {
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    
    return schemes.find((scheme: any) => scheme._id === id) || null;
  } catch (error) {
    console.error(`Error fetching incentive scheme with ID ${id}:`, error);
    return null;
  }
};

/**
 * Delete an incentive scheme by ID (similar to MongoDB deleteOne)
 */
export const deleteIncentiveScheme = async (id: string): Promise<boolean> => {
  try {
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    
    const filteredSchemes = schemes.filter((scheme: any) => scheme._id !== id);
    
    if (filteredSchemes.length === schemes.length) {
      return false;
    }
    
    localStorage.setItem('incentiveSchemes', JSON.stringify(filteredSchemes));
    return true;
  } catch (error) {
    console.error(`Error deleting incentive scheme with ID ${id}:`, error);
    return false;
  }
};

/**
 * Update an incentive scheme (similar to MongoDB updateOne)
 */
export const updateIncentiveScheme = async (id: string, updates: Partial<IncentivePlan>): Promise<boolean> => {
  try {
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    
    const schemeIndex = schemes.findIndex((scheme: any) => scheme._id === id);
    
    if (schemeIndex === -1) {
      return false;
    }
    
    schemes[schemeIndex] = {
      ...schemes[schemeIndex],
      ...updates,
      metadata: {
        ...schemes[schemeIndex].metadata,
        updatedAt: new Date().toISOString(),
        version: schemes[schemeIndex].metadata.version + 1
      }
    };
    
    localStorage.setItem('incentiveSchemes', JSON.stringify(schemes));
    return true;
  } catch (error) {
    console.error(`Error updating incentive scheme with ID ${id}:`, error);
    return false;
  }
};
