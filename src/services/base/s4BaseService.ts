
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * Base Service
 * Common utilities for service interactions
 */

// Base URL for API - now using the proxy server for CORS handling
export const S4_API_BASE_URL = '/api/sap';
export const SAP_API_URL = '/api/sap';

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
      timeout: API_TIMEOUT,
      // CORS is now handled by our proxy server
      withCredentials: false
    });
    
    console.log('Request headers:', config.headers);
    
    const response = await axios(config);
    console.log('Request succeeded');
    return response.data as T;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    
    // Check for specific error types
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Server responded with error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server');
    }
    
    // Check for timeout
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out. The server might be slow or unavailable.');
    }
    
    throw error;
  }
};
