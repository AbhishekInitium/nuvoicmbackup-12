
// KPI Sections Enum
export const KPI_SECTIONS = {
  QUAL_CRI: 'QUAL_CRI',
  ADJ_CRI: 'ADJ_CRI',
  EX_CRI: 'EX_CRI',
  CUSTOM_RULES: 'CUSTOM_RULES',
} as const;

export type KPISectionKey = keyof typeof KPI_SECTIONS;

// KPI Field Mapping Type
export interface KPIFieldMapping {
  _id?: string;
  section: string;
  kpiName: string;
  description?: string;
  sourceType: 'System' | 'External';
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
  createdAt: string;
  updatedAt?: string;
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
