
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * Service to handle database operations for incentive schemes
 * Note: Since MongoDB can't be directly accessed from browser,
 * this implementation uses localStorage as a fallback
 */

// Generate a unique ID for a scheme based on name and timestamp
const generateSchemeId = (scheme: IncentivePlan): string => {
  const timestamp = Date.now();
  const schemeName = scheme.name || 'Unnamed_Scheme';
  
  // Format name for storage ID
  return `${schemeName.replace(/\s+/g, '_')}_${timestamp}`;
};

/**
 * Save an incentive scheme 
 * In a real implementation, this would connect to MongoDB via an API
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan): Promise<string> => {
  try {
    // Generate ID and formatted name
    const timestamp = Date.now();
    const formattedId = generateSchemeId(scheme);
    
    // Prepare the scheme for storage
    const schemeToSave = {
      ...scheme,
      originalName: scheme.name,
      name: scheme.name, // Keep original name intact
      createdAt: new Date(timestamp).toISOString(),
      _id: formattedId
    };
    
    // Store in localStorage
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    schemes.push(schemeToSave);
    localStorage.setItem('incentiveSchemes', JSON.stringify(schemes));
    
    console.log(`Saved scheme with ID: ${formattedId}`);
    console.log(`Note: For true MongoDB persistence, implement API endpoints on a backend server`);
    
    return formattedId;
  } catch (error) {
    console.error("Error saving incentive scheme:", error);
    throw new Error(`Failed to save scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get all incentive schemes 
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
 * Get a specific incentive scheme by ID
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
 * Delete an incentive scheme by ID
 */
export const deleteIncentiveScheme = async (id: string): Promise<boolean> => {
  try {
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    
    const filteredSchemes = schemes.filter((scheme: any) => scheme._id !== id);
    
    // If lengths are the same, nothing was deleted
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
