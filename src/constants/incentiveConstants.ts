
import { IncentivePlan } from "@/types/incentiveTypes";

// Incentive Types constants
export const DEFAULT_PLAN: IncentivePlan = {
  name: "",
  schemeId: "",
  description: "",
  effectiveStart: "",
  effectiveEnd: "",
  currency: "USD",
  revenueBase: "salesOrders",
  participants: [],
  salesQuota: 100000,
  commissionStructure: {
    tiers: []
  },
  measurementRules: {
    primaryMetrics: [],
    minQualification: 0,
    adjustments: [],
    exclusions: []
  },
  creditRules: {
    levels: []
  },
  customRules: []
};

// Available operators for conditions
export const OPERATORS = [
  { value: '==', label: 'Equal to (=)' },
  { value: '!=', label: 'Not equal to (≠)' },
  { value: '>', label: 'Greater than (>)' },
  { value: '>=', label: 'Greater than or equal to (≥)' },
  { value: '<', label: 'Less than (<)' },
  { value: '<=', label: 'Less than or equal to (≤)' },
];

// SAP S/4HANA database fields available for selection
export const DATABASE_FIELDS = [
  { value: 'SalesOrganization', label: 'Sales Organization' },
  { value: 'DistributionChannel', label: 'Distribution Channel' },
  { value: 'SalesOrderType', label: 'Sales Order Type' },
  { value: 'SoldToParty', label: 'Sold To Party' },
  { value: 'TotalNetAmount', label: 'Net Amount' },
  { value: 'CreationDate', label: 'Creation Date' },
  { value: 'ProductCategory', label: 'Product Category' },
  { value: 'MaterialCode', label: 'Material Code' },
  { value: 'SalesOrder', label: 'Sales Order Number' }, // Added as requested
  { value: 'SalesRepId', label: 'Sales Rep ID' }        // Added as requested
];

// Credit rule levels
export const DEFAULT_CREDIT_LEVELS = [
  {
    name: 'Primary Sales Rep',
    percentage: 100,
    description: 'Full credit to primary sales representative'
  }
];

// Measurement rules
export const DEFAULT_PRIMARY_METRIC = {
  field: 'TotalNetAmount',
  operator: '>=',
  value: 1000,
  description: 'Minimum order value'
};

// Rule actions
export const RULE_ACTIONS = [
  { value: 'boost', label: 'Boost Value' },
  { value: 'cap', label: 'Cap Value' },
  { value: 'qualify', label: 'Force Qualify' },
  { value: 'disqualify', label: 'Disqualify' }
];

export const SAMPLE_TIERS = [
  {
    from: 0,
    to: 100000,
    rate: 1.5,
    description: "Base tier"
  },
  {
    from: 100001,
    to: 250000,
    rate: 2.0,
    description: "Mid tier"
  },
  {
    from: 250001,
    to: 500000,
    rate: 3.0,
    description: "High tier"
  },
  {
    from: 500001,
    to: 99999999,
    rate: 5.0,
    description: "Premium tier"
  }
];

// Revenue base options
export const REVENUE_BASE_OPTIONS = [
  {
    value: 'salesOrders',
    label: 'Sales Orders',
    description: 'Commission based on sales order value regardless of payment status'
  },
  {
    value: 'invoices',
    label: 'Invoices',
    description: 'Commission based on invoice value regardless of payment status'
  },
  {
    value: 'paidInvoices',
    label: 'Paid Invoices',
    description: 'Commission based only on paid invoices'
  }
];
