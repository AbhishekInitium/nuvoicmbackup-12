export interface CommissionStructure {
  tiers: CommissionTier[];
}

export interface CommissionTier {
  from: number;
  to: number;
  rate: number;
  description?: string;
}

export interface MeasurementRules {
  primaryMetrics: PrimaryMetric[];
  minQualification: number;
  adjustments: Adjustment[];
  exclusions: Exclusion[];
}

export interface PrimaryMetric {
  field: string;
  operator: string;
  value: any;
  description?: string;
}

export interface Adjustment {
  id: string;
  description: string;
  impact: number;
  type: 'ADDITION' | 'PERCENTAGE_BOOST' | 'REDUCTION';
}

export interface Exclusion {
  field: string;
  operator: string;
  value: any;
  description: string;
}

export interface CreditRules {
  levels: CreditLevel[];
}

export interface CreditLevel {
  name: string;
  percentage: number;
  description?: string;
}

export interface CustomRule {
  name: string;
  description?: string;
  conditions: RuleCondition[];
  action: string;
  factor?: number;
  value?: number;
  active: boolean;
}

export interface RuleCondition {
  field?: string;
  metric?: string;
  operator: string;
  value: any;
}

export interface IncentivePlan {
  name: string;
  schemeId: string;
  description: string;
  effectiveStart: string;
  effectiveEnd: string;
  currency: string;
  revenueBase: string;
  participants: string[];
  salesQuota: number;
  commissionStructure: CommissionStructure;
  measurementRules: MeasurementRules;
  creditRules: CreditRules;
  customRules: CustomRule[];
  metadata?: PlanMetadata;
}

export interface PlanMetadata {
  createdAt: string;
  updatedAt: string;
  version: number;
  status: string;
}
