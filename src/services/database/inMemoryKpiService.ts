
import { KPIFieldMapping, SchemeMaster } from './types/kpiTypes';

// In-memory storage for KPI mappings when MongoDB is not available
let inMemoryKpiMappings: KPIFieldMapping[] = [];
let inMemorySchemeMasters: SchemeMaster[] = [];
let nextInMemoryId = 1;

/**
 * Get all KPI field mappings from in-memory storage
 */
export const getInMemoryKpiMappings = (): KPIFieldMapping[] => {
  return [...inMemoryKpiMappings];
};

/**
 * Get available KPI fields for scheme designers from in-memory storage
 */
export const getInMemoryAvailableKpiFields = (): KPIFieldMapping[] => {
  return inMemoryKpiMappings.filter(field => field.availableToDesigner);
};

/**
 * Save a new KPI field mapping to in-memory storage
 */
export const saveInMemoryKpiMapping = (kpiMapping: KPIFieldMapping): KPIFieldMapping => {
  const newMapping = {
    ...kpiMapping,
    _id: String(nextInMemoryId++),
    createdAt: new Date().toISOString()
  };
  inMemoryKpiMappings.push(newMapping);
  console.log('KPI mapping saved to in-memory storage:', newMapping);
  return newMapping;
};

/**
 * Update an existing KPI field mapping in in-memory storage
 */
export const updateInMemoryKpiMapping = (id: string, kpiMapping: KPIFieldMapping): KPIFieldMapping => {
  const index = inMemoryKpiMappings.findIndex(field => field._id === id);
  
  if (index === -1) {
    throw new Error('KPI field mapping not found in memory storage');
  }

  inMemoryKpiMappings[index] = {
    ...inMemoryKpiMappings[index],
    ...kpiMapping
  };

  console.log('KPI mapping updated in in-memory storage:', inMemoryKpiMappings[index]);
  return inMemoryKpiMappings[index];
};

/**
 * Delete a KPI field mapping from in-memory storage
 */
export const deleteInMemoryKpiMapping = (id: string): boolean => {
  const initialLength = inMemoryKpiMappings.length;
  inMemoryKpiMappings = inMemoryKpiMappings.filter(field => field._id !== id);
  
  const deleted = initialLength > inMemoryKpiMappings.length;
  console.log(deleted ? `KPI mapping deleted from in-memory storage: ${id}` : `KPI mapping not found in memory: ${id}`);
  
  return deleted;
};

/**
 * Get scheme master by schemeId from in-memory storage
 */
export const getInMemorySchemeMaster = (schemeId: string): SchemeMaster | null => {
  const schemeMaster = inMemorySchemeMasters.find(master => master.schemeId === schemeId);
  return schemeMaster || null;
};

/**
 * Assign KPI fields to a scheme master in in-memory storage
 */
export const assignInMemoryKpiFieldsToScheme = (schemeId: string, kpiFields: string[]): SchemeMaster => {
  const existing = inMemorySchemeMasters.find(master => master.schemeId === schemeId);
  
  if (existing) {
    // Update existing
    existing.kpiFields = kpiFields;
    existing.updatedAt = new Date().toISOString();
    return existing;
  } else {
    // Create new
    const schemeMaster: SchemeMaster = {
      _id: String(nextInMemoryId++),
      schemeId,
      kpiFields,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemorySchemeMasters.push(schemeMaster);
    return schemeMaster;
  }
};

// Reset in-memory data (mostly for testing)
export const resetInMemoryStorage = (): void => {
  inMemoryKpiMappings = [];
  inMemorySchemeMasters = [];
  nextInMemoryId = 1;
};
