
import axios, { AxiosRequestConfig } from 'axios';
import { createAuthenticatedRequest } from '@/utils/sapAuth';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * Base Service
 * Common utilities for service interactions
 */

// Base URL for API - configuring the proxy correctly
export const S4_API_BASE_URL = '/api/proxy';
export const SAP_API_URL = 'https://my418390-api.s4hana.cloud.sap';

// Timeout for API requests in milliseconds (15 seconds - increased to handle slower connections)
const API_TIMEOUT = 15000;

/**
 * Create full API URL for endpoints
 */
export const getS4Url = (service: string, entity: string): string => {
  const targetUrl = `${SAP_API_URL}${SAP_CONFIG.s4hana.apiBasePath}/${service}/${entity}`;
  return `${S4_API_BASE_URL}?targetUrl=${encodeURIComponent(targetUrl)}`;
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
    
    // Add the proxy support for all URLs
    let fullUrl = url;
    
    // If the URL is not already a full proxy URL with targetUrl parameter
    if (!url.includes('/api/proxy?targetUrl=')) {
      // If the URL is a full URL (starts with http), use it with the proxy
      if (url.startsWith('http')) {
        fullUrl = `${S4_API_BASE_URL}?targetUrl=${encodeURIComponent(url)}`;
      } 
      // If it's a relative URL, prepend the SAP API URL
      else {
        const targetUrl = `${SAP_API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
        fullUrl = `${S4_API_BASE_URL}?targetUrl=${encodeURIComponent(targetUrl)}`;
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
      } else if (typeof response.data === 'string') {
        // Check if the response is HTML (sometimes the proxy returns HTML even with right headers)
        if (response.data.trim().startsWith('<!DOCTYPE html>') || response.data.trim().startsWith('<html')) {
          console.error('Received HTML response instead of JSON');
          throw new Error('Received HTML response instead of JSON. This may indicate an authentication issue or invalid endpoint.');
        }
        // Try to parse string response as JSON
        try {
          return JSON.parse(response.data) as T;
        } catch (e) {
          console.log('Response is not JSON:', response.data.substring(0, 200) + '...');
          return response.data as unknown as T;
        }
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
