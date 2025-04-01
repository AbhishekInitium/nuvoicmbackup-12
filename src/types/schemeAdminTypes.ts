
export interface KpiField {
  id: string;
  kpi: string;
  description: string;
  dataType: string;
  sourceField: string;
  sourceType: 'SAP' | 'Excel' | 'Custom';
  api?: string;
  category: 'qualification' | 'adjustment' | 'exclusion' | 'custom';
  formula?: string; // Optional formula for calculated fields
  validationRules?: string[];
}

export type DataSourceType = 'SAP' | 'Excel' | 'Custom';

export interface DataSourceMapping {
  sourceType: DataSourceType;
  sourceField: string;
  targetKpi: string;
  transformation?: string;
}

export interface SchemeAdminConfig {
  _id?: string; // MongoDB document ID
  schemeId?: string; // Optional reference to a specific scheme
  adminId: string; // ID of the administrator who created this configuration
  adminName: string; // Name of the administrator
  createdAt: string;
  updatedAt?: string;
  calculationBase: string; // Base for calculations (e.g., "Revenue", "Units", etc.)
  baseField: string; // Field in source system that contains the calculation base
  sourceFormat?: string; // Format details for Excel or other sources
  baseData: {
    source: DataSourceType;
    connectionDetails?: string; // Connection string or file format details
  };
  qualificationFields: KpiField[]; // Fields that can be used for qualification criteria
  adjustmentFields: KpiField[]; // Fields that can be used for adjustments
  exclusionFields: KpiField[]; // Fields that can be used for exclusions
  customRules: KpiField[]; // Fields for custom rules
  mappings?: DataSourceMapping[]; // Mappings between source fields and KPIs
}
