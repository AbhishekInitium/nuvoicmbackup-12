
import axios from 'axios';

// Constants for SAP S/4HANA connection
const S4HANA_BASE_URL = "https://my418390-api.s4hana.cloud.sap/sap/opu";
const S4HANA_USERNAME = "S4HANA_BASIC";
const S4HANA_PASSWORD = "GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi";

/**
 * Function to make API calls to SAP S/4HANA in Node.js style
 * Similar to the Python requests.get() approach
 */
export const callS4HanaApi = async (endpoint: string, params?: Record<string, any>) => {
  try {
    // Construct the full URL
    const url = `${S4HANA_BASE_URL}${endpoint}`;
    
    console.log(`Making API call to: ${url}`);
    
    // Make the request with axios (similar to Python requests)
    const response = await axios({
      method: 'GET',
      url: url,
      params: params,
      // Provide basic auth credentials without encoding
      auth: {
        username: S4HANA_USERNAME,
        password: S4HANA_PASSWORD
      },
      // Set appropriate headers
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Similar to response.raise_for_status() in Python
    if (response.status >= 400) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    console.log('Response status:', response.status);
    
    // Return the JSON data (similar to response.json() in Python)
    return response.data;
  } catch (error) {
    console.error('Error calling S4HANA API:', error);
    throw error;
  }
};

/**
 * Example usage:
 * 
 * // To call an OData service
 * const businessPartners = await callS4HanaApi('/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner', {
 *   '$format': 'json',
 *   '$top': 10
 * });
 * 
 * // To call a different endpoint
 * const productData = await callS4HanaApi('/odata/sap/API_PRODUCT_SRV/Products', {
 *   '$format': 'json'
 * });
 */
