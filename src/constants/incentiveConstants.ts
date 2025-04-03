
// Add this to the existing file 
export const ADJUSTMENT_TYPES = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed Amount' }
];

// Add other missing constants
export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'C$' }
];

export const OPERATORS = [
  { value: '=', label: '=' },
  { value: '>', label: '>' },
  { value: '<', label: '<' },
  { value: '>=', label: '>=' },
  { value: '<=', label: '<=' },
  { value: '!=', label: '!=' }
];

export const DB_FIELDS = {
  salesOrders: [
    { value: 'SoAmount', label: 'Sales Order Amount' },
    { value: 'SoQuantity', label: 'Sales Order Quantity' },
    { value: 'SoCustomer', label: 'Customer' }
  ],
  billingInvoices: [
    { value: 'InvoiceAmount', label: 'Invoice Amount' },
    { value: 'InvoiceQuantity', label: 'Invoice Quantity' },
    { value: 'InvoiceCustomer', label: 'Customer' }
  ],
  deliveries: [
    { value: 'DeliveryAmount', label: 'Delivery Amount' },
    { value: 'DeliveryQuantity', label: 'Delivery Quantity' },
    { value: 'DeliveryCustomer', label: 'Customer' }
  ]
};

export const DEFAULT_PLAN = {
  name: '',
  schemeId: '',
  description: '',
  effectiveStart: '',
  effectiveEnd: '',
  currency: 'USD',
  revenueBase: 'salesOrders',
  participants: [],
  salesQuota: 0,
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

export const MOCK_SCHEMES = [
  {
    name: 'Standard Sales Commission',
    description: 'Basic tiered commission structure for sales teams',
  },
  {
    name: 'Executive Bonus Plan',
    description: 'Performance-based incentives for leadership',
  },
  {
    name: 'Channel Partner Commission',
    description: 'Incentives for external sales partners',
  }
];
