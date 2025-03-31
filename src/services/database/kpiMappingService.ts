
import axios from 'axios';

// Base URL for API requests - Use a relative URL to make it work in all environments
const API_BASE_URL = '/api';

export interface KPIFieldMapping {
  _id?: string;
  section: string; // Added section field (BASE_DATA, QUAL_CRI, etc.)
  kpiName: string;
  description: string; // Added description field
  sourceType: 'System' | 'External';
  sourceField: string;
  sourceFileHeader?: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'Char4' | '';
  api?: string; // Added API endpoint information
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

export interface DatabaseConnectionStatus {
  connected: boolean;
  message: string;
  details?: any;
}

// Predefined KPI section options
export const KPI_SECTIONS = [
  'BASE_DATA',
  'QUAL_CRI',
  'ADJ_CRI',
  'EX_CRI',
  'CUSTOM_RULES'
];

// In-memory storage as fallback when API fails
let inMemoryKpiMappings: KPIFieldMapping[] = [];
let nextId = 1;

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
    
    // Update in-memory storage with API data
    if (Array.isArray(response.data) && response.data.length > 0) {
      inMemoryKpiMappings = response.data;
      
      // Update next ID based on existing mappings
      const maxId = inMemoryKpiMappings
        .map(kpi => kpi._id ? parseInt(kpi._id.replace(/\D/g, '')) : 0)
        .reduce((max, current) => Math.max(max, current), 0);
      nextId = maxId + 1;
    }
    
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : inMemoryKpiMappings;
  } catch (error) {
    console.error('Error fetching KPI field mappings:', error);
    // Return in-memory data as fallback
    return inMemoryKpiMappings;
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
    return Array.isArray(response.data) ? response.data : 
           inMemoryKpiMappings.filter(kpi => kpi.availableToDesigner);
  } catch (error) {
    console.error('Error fetching available KPI fields:', error);
    // Return filtered in-memory data as fallback
    return inMemoryKpiMappings.filter(kpi => kpi.availableToDesigner);
  }
};

/**
 * Save a new KPI field mapping
 */
export const saveKpiFieldMapping = async (kpiMapping: KPIFieldMapping): Promise<KPIFieldMapping> => {
  try {
    console.log('Saving KPI field mapping:', kpiMapping);
    const response = await axios.post(`${API_BASE_URL}/kpi-fields`, kpiMapping);
    
    // Update in-memory storage with new KPI
    const savedKpi = response.data.kpi || response.data;
    
    // Add to in-memory storage
    if (!savedKpi._id) {
      savedKpi._id = `local-${nextId++}`;
    }
    inMemoryKpiMappings.push(savedKpi);
    
    return savedKpi;
  } catch (error) {
    console.error('Error saving KPI field mapping:', error);
    
    // Create fallback local entry
    const localKpi = {
      ...kpiMapping,
      _id: `local-${nextId++}`,
      createdAt: new Date().toISOString()
    };
    
    // Add to in-memory storage
    inMemoryKpiMappings.push(localKpi);
    
    return localKpi;
  }
};

/**
 * Update an existing KPI field mapping
 */
export const updateKpiFieldMapping = async (id: string, kpiMapping: KPIFieldMapping): Promise<KPIFieldMapping> => {
  try {
    console.log(`Updating KPI field mapping with ID: ${id}`, kpiMapping);
    const response = await axios.put(`${API_BASE_URL}/kpi-fields/${id}`, kpiMapping);
    
    // Update in-memory storage
    const updatedKpi = response.data.kpi || response.data;
    const index = inMemoryKpiMappings.findIndex(kpi => kpi._id === id);
    if (index !== -1) {
      inMemoryKpiMappings[index] = { ...updatedKpi };
    }
    
    return updatedKpi;
  } catch (error) {
    console.error('Error updating KPI field mapping:', error);
    
    // Update in-memory storage as fallback
    const index = inMemoryKpiMappings.findIndex(kpi => kpi._id === id);
    if (index !== -1) {
      inMemoryKpiMappings[index] = { 
        ...kpiMapping, 
        _id: id
      };
      return inMemoryKpiMappings[index];
    }
    
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
    return response.data.scheme;
  } catch (error) {
    console.error('Error fetching scheme master:', error);
    throw new Error(`Failed to fetch scheme master: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Delete a KPI field mapping by ID
 */
export const deleteKpiFieldMapping = async (id: string): Promise<boolean> => {
  try {
    console.log('Deleting KPI field mapping:', id);
    await axios.delete(`${API_BASE_URL}/kpi-fields/${id}`);
    
    // Update in-memory storage
    inMemoryKpiMappings = inMemoryKpiMappings.filter(kpi => kpi._id !== id);
    
    return true;
  } catch (error) {
    console.error('Error deleting KPI field mapping:', error);
    
    // Remove from in-memory storage as fallback
    const initialLength = inMemoryKpiMappings.length;
    inMemoryKpiMappings = inMemoryKpiMappings.filter(kpi => kpi._id !== id);
    
    // Return true if we were able to remove it from memory
    return inMemoryKpiMappings.length < initialLength;
  }
};
