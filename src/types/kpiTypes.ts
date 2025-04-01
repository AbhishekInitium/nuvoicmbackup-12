
export interface KpiField {
  kpi: string;
  description: string;
  sourceType: 'SAP' | 'External';
  sourceField: string;
  dataType: 'Number' | 'String' | 'Date' | 'Boolean' | 'Char4';
  api?: string;
}

export interface SchemeAdminConfig {
  adminId: string;
  adminName: string;
  calculationBase: string;
  baseField: string;
  baseData: KpiField[];
  qualificationFields: KpiField[];
  adjustmentFields: KpiField[];
  exclusionFields: KpiField[];
  customRules: KpiField[];
  createdAt: string;
}
