
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * Base Service
 * Common utilities for service interactions
 */

// Base URL for API - configuring the proxy correctly
export const S4_API_BASE_URL = '/api/sap';
export const SAP_API_URL = '/api/sap';

// Timeout for API requests in milliseconds (15 seconds - increased to handle slower connections)
const API_TIMEOUT = 15000;

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
    
    // Create the full URL to ensure we're correctly targeting the SAP system
    const fullUrl = url.startsWith('http') ? url : `${S4_API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
    console.log('Full URL for request:', fullUrl);
    
    // Get the authenticated request config
    const config: AxiosRequestConfig = await createAuthenticatedRequest({
      method,
      url: fullUrl,
      data,
      params,
      timeout: API_TIMEOUT,
      // CORS is now handled by our proxy server
      withCredentials: false,
      // Add proper headers to ensure we get the right response format
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Request headers:', config.headers);
    console.log('Request parameters:', params);
    
    const response = await axios(config);
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (response.status >= 200 && response.status < 300) {
      console.log('Request succeeded - response data type:', typeof response.data);
      // Log a small preview of the response data to debug
      if (typeof response.data === 'object') {
        console.log('Response data preview:', JSON.stringify(response.data).substring(0, 200) + '...');
      }
      return response.data as T;
    } else {
      console.error('Non-success status code:', response.status);
      throw new Error(`Request failed with status ${response.status}`);
    }
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
