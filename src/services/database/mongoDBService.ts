
import { IncentivePlan } from '@/types/incentiveTypes';

// We'll use this base URL for API requests
const API_BASE_URL = '/api';  // This would point to your backend server

/**
 * Save an incentive scheme via API
 */
export const saveIncentiveScheme = async (scheme: IncentivePlan): Promise<string> => {
  try {
    // Prepare the timestamp for unique ID
    const timestamp = Date.now();
    const schemeName = scheme.name || 'Unnamed_Scheme';
    
    // Format the name with timestamp
    const formattedName = `${schemeName.replace(/\s+/g, '_')}_${timestamp}`;
    
    // Create a mock response with ID since we can't connect to MongoDB directly from browser
    const mockId = `local_${timestamp}`;
    
    // Store in localStorage as a fallback
    const schemeToSave = {
      ...scheme,
      originalName: scheme.name,
      name: formattedName,
      createdAt: new Date(timestamp).toISOString(),
      _id: mockId
    };
    
    // Save to localStorage
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    schemes.push(schemeToSave);
    localStorage.setItem('incentiveSchemes', JSON.stringify(schemes));
    
    console.log(`Saved scheme with mock ID: ${mockId} (using localStorage fallback)`);
    console.log(`Note: MongoDB connections require a server-side implementation`);
    
    return mockId;
  } catch (error) {
    console.error("Error saving incentive scheme:", error);
    throw error;
  }
};

/**
 * Get all incentive schemes from localStorage
 */
export const getIncentiveSchemes = async (): Promise<any[]> => {
  try {
    // Get from localStorage
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    return existingSchemes ? JSON.parse(existingSchemes) : [];
  } catch (error) {
    console.error("Error fetching incentive schemes:", error);
    return [];
  }
};

/**
 * Get a specific incentive scheme by ID from localStorage
 */
export const getIncentiveSchemeById = async (id: string): Promise<any | null> => {
  try {
    // Get from localStorage
    const existingSchemes = localStorage.getItem('incentiveSchemes');
    const schemes = existingSchemes ? JSON.parse(existingSchemes) : [];
    
    return schemes.find((scheme: any) => scheme._id === id) || null;
  } catch (error) {
    console.error(`Error fetching incentive scheme with ID ${id}:`, error);
    return null;
  }
};

// No need for connect or close functions in the browser version
