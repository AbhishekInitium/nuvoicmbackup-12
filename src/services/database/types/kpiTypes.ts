
// KPI Sections Enum
export const KPI_SECTIONS = {
  BASE_DATA: 'BASE_DATA',
  QUAL_CRI: 'QUAL_CRI',
  ADJ_CRI: 'ADJ_CRI',
  EX_CRI: 'EX_CRI',
  CUSTOM_RULES: 'CUSTOM_RULES',
} as const;

export type KPISectionKey = keyof typeof KPI_SECTIONS;

// Section display names mapping
export const SECTION_DISPLAY_MAP = {
  BASE_DATA: 'Base Data',
  QUAL_CRI: 'Qualification Criteria',
  ADJ_CRI: 'Adjustment Criteria',
  EX_CRI: 'Exclusion Criteria',
  CUSTOM_RULES: 'Custom Rules',
} as const;

// Source types
export type SourceType = 'System' | 'External' | 'SAP';

// CalculationBase type for SchemeHeader
export interface CalculationBase {
  adminId: string;
  adminName: string;
  calculationBase: string;
  baseField?: string;
  createdAt: string;
  updatedAt?: string;
}

// KPI Field Mapping Type
export interface KPIFieldMapping {
  _id?: string;
  section: string;
  kpiName: string;
  description?: string;
  sourceType: SourceType;
  sourceField?: string;
  sourceFileHeader?: string;
  dataType?: string;
  api?: string;
  availableToDesigner?: boolean;
  createdAt?: string;
}

// Scheme Master Type
export interface SchemeMaster {
  _id?: string;
  schemeId: string;
  kpiFields: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Database Connection Status
export interface DatabaseConnectionStatus {
  connected: boolean;
  message: string;
}

// Scheme Administrator Configuration
export interface SchemeAdminConfig {
  adminId: string;
  adminName: string;
  calculationBase: string;
  baseField?: string;
  createdAt: string;
  updatedAt?: string;
  baseData: KPIFieldOutput[];
  qualificationFields: KPIFieldOutput[];
  adjustmentFields: KPIFieldOutput[];
  exclusionFields: KPIFieldOutput[];
  customRules: KPIFieldOutput[];
}

// KPI Field Output format (for JSON export)
export interface KPIFieldOutput {
  kpi: string;
  description?: string;
  sourceType: string;
  sourceField?: string;
  dataType?: string;
  api?: string;
}
