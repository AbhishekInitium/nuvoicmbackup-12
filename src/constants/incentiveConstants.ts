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
  { value: 'SalesOrder', label: 'Sales Order Number' },
  { value: 'SalesRepId', label: 'Sales Rep ID' }
];

// DB fields based on revenue base
export const DB_FIELDS = {
  salesOrders: DATABASE_FIELDS,
  invoices: DATABASE_FIELDS,
  paidInvoices: DATABASE_FIELDS
};

// Credit rule levels
export const DEFAULT_CREDIT_LEVELS = [
  {
    name: 'Primary Sales Rep',
    percentage: 100,
    description: 'Full credit to primary sales representative'
  }
];

// Currency options
export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { code: 'CNY', label: 'Chinese Yuan', symbol: '¥' }
];

// Time periods for rule conditions
export const TIME_PERIODS = [
  { value: 'current', label: 'Current Period' },
  { value: 'previous', label: 'Previous Period' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'rolling3', label: 'Rolling 3 Months' },
  { value: 'rolling6', label: 'Rolling 6 Months' },
  { value: 'rolling12', label: 'Rolling 12 Months' }
];

// Available metrics for rule conditions
export const METRICS = [
  { value: 'sales', label: 'Sales Amount' },
  { value: 'quota', label: 'Quota Attainment' },
  { value: 'orders', label: 'Order Count' },
  { value: 'customers', label: 'Customer Count' },
  { value: 'productMix', label: 'Product Mix %' }
];

// Mock schemes for testing
export const MOCK_SCHEMES = [
  {
    name: 'Standard Sales Commission',
    description: 'Standard commission scheme for sales representatives',
    status: 'APPROVED',
    hasBeenExecuted: false
  },
  {
    name: 'Premium Product Incentive',
    description: 'Special incentives for premium product sales',
    status: 'APPROVED',
    hasBeenExecuted: false
  },
  {
    name: 'Q4 Accelerator Program',
    description: 'Enhanced commission rates for Q4 sales push',
    status: 'APPROVED',
    hasBeenExecuted: false
  }
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
