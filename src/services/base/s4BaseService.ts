
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * Base Service
 * Common utilities for service interactions
 */

// Base URL for API - using updated URL from user credentials
export const S4_API_BASE_URL = 'https://my418390-api.s4hana.cloud.sap';
export const SAP_API_URL = 'https://api.sap.com';

// Timeout for API requests in milliseconds (10 seconds)
const API_TIMEOUT = 10000;

/**
 * Create full API URL for endpoints
 */
export const getS4Url = (service: string, entity: string): string => {
  return `${S4_API_BASE_URL}${SAP_CONFIG.s4hana.apiBasePath}/${service}/${entity}`;
};

/**
 * Generic API request function
 */
export const s4Request = async <T>(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    console.log(`Making ${method} request to: ${url}`);
    
    // Get the authenticated request config
    const config: AxiosRequestConfig = await createAuthenticatedRequest({
      method,
      url,
      data,
      params,
      timeout: API_TIMEOUT, // Add timeout to prevent hanging requests
      // Enable proxy options for CORS handling in dev environment
      proxy: false
    });
    
    console.log('Request headers:', config.headers);
    
    const response = await axios(config);
    console.log('Request succeeded');
    return response.data as T;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    
    // Check if the error is related to CORS
    if (error.message && error.message.includes('Network Error')) {
      console.warn('This may be a CORS issue. Check the server configuration or use a proxy.');
    }
    
    // Check for timeout
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out. The server might be slow or unavailable.');
    }
    
    throw error;
  }
};
