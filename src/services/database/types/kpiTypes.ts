
// Common types for KPI mapping service

export interface KPIFieldMapping {
  _id?: string;
  section: string; // (QUAL_CRI, etc.)
  kpiName: string;
  description: string;
  sourceType: 'System' | 'External' | 'SAP';
  sourceField: string;
  sourceFileHeader?: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'Char4' | '';
  api?: string;
  availableToDesigner: boolean;
  createdAt?: string;
}

export interface SchemeAdministrator {
  adminId: string;
  adminName: string;
  calculationBase: string;
  qualificationFields: KPIField[];
  adjustmentFields: KPIField[];
  exclusionFields: KPIField[];
  customRules: any[];
  createdAt: string;
}

export interface KPIField {
  kpi: string;
  description: string;
  sourceType: 'System' | 'External' | 'SAP';
  sourceField: string;
  dataType: string;
  api?: string;
}

export interface SchemeMaster {
  _id?: string;
  schemeId: string;
  kpiFields: string[]; // Array of kpiNames selected
  createdAt?: string;
  updatedAt?: string;
}

export interface CalculationBase {
  adminId: string;
  adminName: string;
  calculationBase: string;
  createdAt: string;
}

export interface DatabaseConnectionStatus {
  connected: boolean;
  message: string;
  details?: any;
}

// Predefined KPI section options - removed BASE_DATA
export const KPI_SECTIONS = [
  'QUAL_CRI',
  'ADJ_CRI',
  'EX_CRI',
  'CUSTOM_RULES'
];

// Map from section code to human-readable name for UI display
export const SECTION_DISPLAY_MAP = {
  'BASE_DATA': 'Base Data', // Kept for backward compatibility
  'QUAL_CRI': 'Qualification Criteria',
  'ADJ_CRI': 'Adjustment Criteria',
  'EX_CRI': 'Exclusion Criteria',
  'CUSTOM_RULES': 'Custom Rules'
};

// Map from section code to the corresponding field in the SchemeAdministrator
export const SECTION_TO_FIELD_MAP = {
  'BASE_DATA': 'baseData', // Kept for backward compatibility
  'QUAL_CRI': 'qualificationFields',
  'ADJ_CRI': 'adjustmentFields',
  'EX_CRI': 'exclusionFields',
  'CUSTOM_RULES': 'customRules'
};
