
/**
 * MongoDB Proxy Service
 * This service routes MongoDB requests through Supabase Edge Functions
 * to allow MongoDB connections from within the browser environment
 */

import { supabase } from "@/integrations/supabase/client";

// Base URL for API requests if we need to fall back to direct API calls
const FALLBACK_API_BASE_URL = 'http://localhost:3001/api/incentives';
const FALLBACK_ADMIN_API_URL = 'http://localhost:3001/api/admin';

/**
 * Test the MongoDB connection via Supabase Edge Function
 */
export const testMongoDBConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing MongoDB connection via Supabase Edge Function...');
    const { data, error } = await supabase.functions.invoke('connect-mongodb');
    
    if (error) {
      console.error('Error connecting to MongoDB via Supabase:', error);
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
 * Generic function to invoke Supabase edge functions for MongoDB operations
 */
export const invokeMongoDBFunction = async <T>(
  functionName: string, 
  payload: any = {}
): Promise<T> => {
  try {
    console.log(`Invoking MongoDB function ${functionName} with payload:`, payload);
    
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    
    if (error) {
      console.error(`Error invoking ${functionName}:`, error);
      throw new Error(`Failed to execute MongoDB operation: ${error.message}`);
    }
    
    return data as T;
  } catch (error) {
    console.error(`Error in MongoDB operation ${functionName}:`, error);
    throw new Error(`MongoDB operation failed: ${error instanceof Error ? error.message : String(error)}`);
  }
};
