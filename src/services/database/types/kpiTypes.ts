
// Common types for KPI mapping service

export interface KPIFieldMapping {
  _id?: string;
  section: string; // (BASE_DATA, QUAL_CRI, etc.)
  kpiName: string;
  description: string;
  sourceType: 'System' | 'External';
  sourceField: string;
  sourceFileHeader?: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'Char4' | '';
  api?: string;
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
