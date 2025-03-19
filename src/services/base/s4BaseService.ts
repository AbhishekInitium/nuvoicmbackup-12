
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * S/4 HANA Base Service
 * Common utilities for S/4 HANA service interactions
 */

// Base URL for S/4 HANA API - using a constant instead of process.env
export const S4_API_BASE_URL = 'https://s4hana.example.com';

/**
 * Create full API URL for S/4 HANA endpoints
 */
export const getS4Url = (service: string, entity: string): string => {
  return `${S4_API_BASE_URL}${SAP_CONFIG.s4hana.apiBasePath}/${service}/${entity}`;
};

/**
 * Generic API request function for S/4 HANA
 */
export const s4Request = async <T>(
  method: string,
  url: string,
  data?: any,
  params?: any
): Promise<T> => {
  try {
    const config: AxiosRequestConfig = await createAuthenticatedRequest({
      method,
      url,
      data,
      params
    });
    
    const response = await axios(config);
    return response.data as T;
  } catch (error) {
    console.error(`S/4 HANA API Error (${url}):`, error);
    throw error;
  }
};
