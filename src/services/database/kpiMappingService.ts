
import axios from 'axios';
import {
  KPIFieldMapping, 
  SchemeMaster, 
  DatabaseConnectionStatus,
  KPI_SECTIONS
} from './types/kpiTypes';

import * as inMemoryService from './inMemoryKpiService';

// Re-export KPI sections for convenience
export { KPI_SECTIONS };
export type { KPIFieldMapping, SchemeMaster, DatabaseConnectionStatus };

// Base URL for API requests - Use a relative URL to make it work in all environments
const API_BASE_URL = '/api';

/**
 * Check database connection status
 */
export const checkDatabaseConnection = async (): Promise<DatabaseConnectionStatus> => {
  try {
    console.log('Checking database connection status...');
    const response = await axios.get(`${API_BASE_URL}/db-status`);
    console.log('Database connection status:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking database connection:', error);
    return { 
      connected: false, 
      message: 'Failed to connect to database, using in-memory storage instead'
    };
  }
};

/**
 * Get all KPI field mappings
 */
export const getKpiFieldMappings = async (): Promise<KPIFieldMapping[]> => {
  try {
    console.log('Fetching KPI field mappings...');
    const response = await axios.get(`${API_BASE_URL}/kpi-fields`);
    console.log('KPI mappings response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching KPI field mappings:', error);
    // Fallback to in-memory service if API fails
    try {
      return await inMemoryService.getKpiFields();
    } catch (innerError) {
      console.error('In-memory fallback also failed:', innerError);
      return [];
    }
  }
};

/**
 * Get available KPI fields for scheme designers
 */
export const getAvailableKpiFields = async (): Promise<KPIFieldMapping[]> => {
  try {
    console.log('Fetching available KPI fields...');
    const response = await axios.get(`${API_BASE_URL}/kpi-fields/available`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error fetching available KPI fields:', error);
    // Fallback to in-memory service if API fails
    try {
      return await inMemoryService.getAvailableKpiFields();
    } catch (innerError) {
      console.error('In-memory fallback also failed:', innerError);
      return [];
    }
  }
};

/**
 * Save a new KPI field mapping
 */
export const saveKpiFieldMapping = async (kpiMapping: KPIFieldMapping): Promise<KPIFieldMapping> => {
  try {
    console.log('Saving KPI field mapping:', kpiMapping);
    const response = await axios.post(`${API_BASE_URL}/kpi-fields`, kpiMapping);
    console.log('Save KPI response:', response.data);
    
    // Return the KPI object from the response
    const savedKpi = response.data.kpi || response.data;
    return savedKpi;
  } catch (error) {
    console.error('Error saving KPI field mapping:', error);
    throw new Error(`Failed to save KPI mapping: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Update an existing KPI field mapping
 */
export const updateKpiFieldMapping = async (id: string, kpiMapping: KPIFieldMapping): Promise<KPIFieldMapping> => {
  try {
    console.log(`Updating KPI field mapping with ID: ${id}`, kpiMapping);
    const response = await axios.put(`${API_BASE_URL}/kpi-fields/${id}`, kpiMapping);
    
    // Return the updated KPI object
    const updatedKpi = response.data.kpi || response.data;
    return updatedKpi;
  } catch (error) {
    console.error('Error updating KPI field mapping:', error);
    throw new Error(`Failed to update KPI mapping: ${error instanceof Error ? error.message : String(error)}`);
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
    
    console.log('FormData created:', formData);
    
    const response = await axios.post(`${API_BASE_URL}/upload-format`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('Excel upload response:', response.data);
    
    // Make sure we always return an array of strings
    if (response.data && Array.isArray(response.data.headers)) {
      return response.data.headers;
    } else {
      console.warn('Invalid headers format from server:', response.data);
      return [];
    }
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
    return response.data.scheme || null;
  } catch (error) {
    console.error('Error fetching scheme master:', error);
    // Return null instead of throwing to handle missing schemes gracefully
    return null;
  }
};

/**
 * Delete a KPI field mapping by ID
 */
export const deleteKpiFieldMapping = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting KPI field mapping:', id);
    await axios.delete(`${API_BASE_URL}/kpi-fields/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting KPI field mapping:', error);
    throw new Error(`Failed to delete KPI mapping: ${error instanceof Error ? error.message : String(error)}`);
  }
};
