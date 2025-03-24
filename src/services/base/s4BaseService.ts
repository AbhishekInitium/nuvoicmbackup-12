
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * Base Service
 * Common utilities for service interactions
 */

// Base URL for the SAP API proxy
export const S4_API_BASE_URL = '/api/sap';
export const SAP_API_URL = 'https://my418390-api.s4hana.cloud.sap';

// Timeout for API requests in milliseconds (15 seconds)
const API_TIMEOUT = 15000;

/**
 * Create full API URL for endpoints using the proxy
 */
export const getS4Url = (service: string, entity: string): string => {
  return `${S4_API_BASE_URL}${SAP_CONFIG.s4hana.apiBasePath}/${service}/${entity}`;
};

/**
 * Generic API request function using the proxy
 */
export const s4Request = async <T>(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    console.log(`Making ${method} request to: ${url}`);
    
    // Format the URL to use the proxy
    let fullUrl = url;
    
    // If the URL doesn't already start with /api/sap
    if (!url.startsWith(S4_API_BASE_URL)) {
      // If it's an absolute URL (with http), extract the path
      if (url.startsWith('http')) {
        try {
          const urlObj = new URL(url);
          // Extract the path from the full URL and prepend the proxy path
          fullUrl = `${S4_API_BASE_URL}${urlObj.pathname}${urlObj.search}`;
        } catch (e) {
          console.error('Error parsing URL:', e);
          fullUrl = url; // Keep the original URL if parsing fails
        }
      } 
      // If it's a relative URL without the proxy prefix
      else {
        // Make sure it starts with a slash
        const relativePath = url.startsWith('/') ? url : `/${url}`;
        fullUrl = `${S4_API_BASE_URL}${relativePath}`;
      }
    }
    
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
        'Content-Type': 'application/json',
        // The proxy will add SAP-specific headers
      }
    });
    
    console.log('Request headers:', config.headers);
    console.log('Request parameters:', params);
    
    const response = await axios(config);
    console.log('Response status:', response.status);
    
    if (response.status >= 200 && response.status < 300) {
      return response.data as T;
    } else {
      throw new Error(`Request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    throw error;
  }
};
