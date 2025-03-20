
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * SAP Authentication Utilities
 * Handles authentication with SAP systems including backend services
 */

// Authentication types supported by SAP systems
export type SAPAuthType = 'basic' | 'oauth' | 'principal' | 'samlBearer';

// Authentication configuration
interface SAPAuthConfig {
  type: SAPAuthType;
  username?: string;
  password?: string;
  clientId?: string;
  clientSecret?: string;
  tokenUrl?: string;
}

// Default auth configuration with user provided credentials
const defaultAuthConfig: SAPAuthConfig = {
  type: 'basic',
  username: 'S4HANA_BASIC',
  password: 'GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi'
};

// Auth token storage
let authToken: string | null = null;
let tokenExpiry: Date | null = null;

/**
 * Get authentication token for SAP API calls
 */
export const getSAPAuthToken = async (config: SAPAuthConfig = defaultAuthConfig): Promise<string> => {
  // Check if we have a valid token
  if (authToken && tokenExpiry && tokenExpiry > new Date()) {
    return authToken;
  }
  
  // Get new token
  try {
    switch (config.type) {
      case 'oauth': {
        if (!config.clientId || !config.clientSecret || !config.tokenUrl) {
          throw new Error('Missing OAuth configuration');
        }
        
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', config.clientId);
        params.append('client_secret', config.clientSecret);
        
        const response = await axios.post(config.tokenUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        
        authToken = response.data.access_token;
        // Set expiry time (subtract 5 minutes for safety margin)
        const expiresIn = response.data.expires_in || 3600;
        tokenExpiry = new Date(Date.now() + (expiresIn - 300) * 1000);
        
        return authToken;
      }
      
      case 'basic': {
        if (!config.username || !config.password) {
          throw new Error('Missing Basic Auth configuration');
        }
        
        // Ensure we're creating the Basic Auth header correctly
        const base64Credentials = btoa(`${config.username}:${config.password}`);
        authToken = `Basic ${base64Credentials}`;
        
        // Basic auth doesn't expire, but we'll refresh it periodically anyway
        tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        console.log('Created Basic Auth token:', config.username);
        return authToken;
      }
      
      default:
        throw new Error(`Auth type ${config.type} not implemented`);
    }
  } catch (error) {
    console.error('Failed to obtain authentication token:', error);
    throw new Error('Authentication failed');
  }
};

/**
 * Create authenticated request config for SAP API calls
 */
export const createAuthenticatedRequest = async (
  config: AxiosRequestConfig = {}
): Promise<AxiosRequestConfig> => {
  const token = await getSAPAuthToken();
  
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  };
};

/**
 * Clear authentication token (for logout or token refresh)
 */
export const clearAuthToken = (): void => {
  authToken = null;
  tokenExpiry = null;
};
