import { DataSourceType, KpiField } from './schemeAdminTypes';

export interface RuleCondition {
  field: string;
  operator: string;
  value: string | number;
  description?: string;
  // Added metadata fields
  sourceType?: DataSourceType;
  sourceField?: string;
  dataType?: string;
}

export interface PrimaryMetric extends RuleCondition {
  // PrimaryMetric already extends RuleCondition, so it inherits the new fields
}

export interface Adjustment {
  type: 'percentage' | 'fixed';
  value: number;
  description?: string;
  condition: RuleCondition;
}

export interface Exclusion {
  description?: string;
  condition: RuleCondition;
}

export interface CustomRule {
  name?: string;
  description?: string;
  condition: RuleCondition;
  active?: boolean;
  action?: string;
  factor?: number;
}

export interface MeasurementRules {
  primaryMetrics: PrimaryMetric[];
  minQualification: number;
  adjustments: Adjustment[];
  exclusions: Exclusion[];
}

export interface CreditRule {
  level: number;
  role: string;
  percent: number;
  name?: string; // Added for processing module compatibility
}

// Added missing types
export interface Tier {
  from: number;
  to: number;
  rate: number;
  description?: string;
}

export interface CreditLevel {
  name: string;
  percentage: number;
}

export interface CommissionTier {
  id: string;
  from: number;
  to?: number;
  rate: number;
  base?: 'revenue' | 'margin' | 'quantity';
}

export interface CommissionStructure {
  tiers: Tier[];
}

export interface IncentivePlan {
  _id?: string; // MongoDB document ID
  schemeId: string;
  name: string;
  description: string;
  effectiveStart?: string;
  effectiveEnd?: string;
  currency: string;
  revenueBase: string;
  sourceType?: DataSourceType; // Added field for source type
  participants: string[];
  salesQuota: number | string;
  commissionStructure: {
    tiers: CommissionTier[];
  };
  measurementRules: MeasurementRules;
  creditRules: {
    levels: CreditRule[];
  };
  customRules: CustomRule[];
  metadata?: PlanMetadata;
  kpiMetadata?: Record<string, KpiField>; // Added field to store KPI metadata
}

export interface PlanMetadata {
  createdAt: string;
  updatedAt?: string;
  version?: number;
  status?: string;
}
