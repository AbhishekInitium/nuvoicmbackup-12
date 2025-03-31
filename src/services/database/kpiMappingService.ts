import axios from 'axios';

// Base URL for API requests - Use a relative URL to make it work in all environments
const API_BASE_URL = '/api';

export interface KPIFieldMapping {
  _id?: string;
  kpiName: string;
  sourceType: 'SAP' | 'EXCEL';
  sourceField: string;
  sourceFileHeader: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  availableToDesigner: boolean;
  createdAt?: string;
}

export interface SchemeMaster {
  _id?: string;
  schemeId: string;
  kpiFields: string[]; // Array of kpiNames selected
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get all KPI field mappings
 */
export const getKpiFieldMappings = async (): Promise<KPIFieldMapping[]> => {
  try {
    console.log('Fetching KPI field mappings...');
    const response = await axios.get(`${API_BASE_URL}/kpi-fields`);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching KPI field mappings:', error);
    // Return empty array on error
    return [];
  }
};

/**
 * Get available KPI fields for scheme designers
 */
export const getAvailableKpiFields = async (): Promise<KPIFieldMapping[]> => {
  try {
    console.log('Fetching available KPI fields...');
    const response = await axios.get(`${API_BASE_URL}/kpi-fields/available`);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching available KPI fields:', error);
    // Return empty array on error
    return [];
  }
};

/**
 * Save a new KPI field mapping
 */
export const saveKpiFieldMapping = async (kpiMapping: KPIFieldMapping): Promise<KPIFieldMapping> => {
  try {
    console.log('Saving KPI field mapping:', kpiMapping);
    const response = await axios.post(`${API_BASE_URL}/kpi-fields`, kpiMapping);
    return response.data.kpi;
  } catch (error) {
    console.error('Error saving KPI field mapping:', error);
    throw new Error(`Failed to save KPI field mapping: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Upload Excel file to extract headers
 */
export const uploadExcelFormat = async (file: File): Promise<string[]> => {
  try {
    console.log('Uploading Excel file:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload-format`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Excel upload response:', response.data);
    return response.data.headers;
  } catch (error) {
    console.error('Error uploading Excel format:', error);
    throw new Error(`Failed to upload Excel format: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Assign KPI fields to a scheme master
 */
export const assignKpiFieldsToScheme = async (schemeId: string, kpiFields: string[]): Promise<SchemeMaster> => {
  try {
    console.log('Assigning KPI fields to scheme:', schemeId, kpiFields);
    const response = await axios.post(`${API_BASE_URL}/schemes/${schemeId}/master`, { kpiFields });
    return response.data.scheme;
  } catch (error) {
    console.error('Error assigning KPI fields to scheme:', error);
    throw new Error(`Failed to assign KPI fields to scheme: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Get scheme master by schemeId
 */
export const getSchemeMaster = async (schemeId: string): Promise<SchemeMaster | null> => {
  try {
    console.log('Fetching scheme master for schemeId:', schemeId);
    const response = await axios.get(`${API_BASE_URL}/schemes/${schemeId}/master`);
    return response.data.scheme;
  } catch (error) {
    console.error('Error fetching scheme master:', error);
    return null;
  }
};
