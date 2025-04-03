
export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'EUR', label: 'Euro', symbol: '€' },
  { code: 'GBP', label: 'British Pound', symbol: '£' },
  { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' }
];

export const OPERATORS = [
  { value: '>', label: 'Greater Than' },
  { value: '<', label: 'Less Than' },
  { value: '=', label: 'Equals' },
  { value: '>=', label: 'Greater Than or Equals' },
  { value: '<=', label: 'Less Than or Equals' },
  { value: '!=', label: 'Not Equals' }
];

export const DB_FIELDS = {
  salesOrders: [
    { value: 'TotalAmount', label: 'Total Amount' },
    { value: 'Quantity', label: 'Quantity' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'OrderDate', label: 'Order Date' },
    { value: 'ProductName', label: 'Product Name' }
  ],
  invoices: [
    { value: 'InvoiceAmount', label: 'Invoice Amount' },
    { value: 'InvoiceDate', label: 'Invoice Date' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'ProductName', label: 'Product Name' },
    { value: 'PaymentStatus', label: 'Payment Status' }
  ],
  collections: [
    { value: 'CollectionAmount', label: 'Collection Amount' },
    { value: 'CollectionDate', label: 'Collection Date' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'PaymentMethod', label: 'Payment Method' }
  ],
  contracts: [
    { value: 'ContractValue', label: 'Contract Value' },
    { value: 'ContractStartDate', label: 'Contract Start Date' },
    { value: 'ContractEndDate', label: 'Contract End Date' },
    { value: 'CustomerName', label: 'Customer Name' },
    { value: 'ContractType', label: 'Contract Type' }
  ]
};

export const DEFAULT_PLAN = {
  name: 'New Incentive Plan',
  description: 'Description of the incentive plan',
  effectiveStart: new Date().toISOString(),
  effectiveEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
  currency: 'USD',
  revenueBase: 'salesOrders',
  salesQuota: 100000,
  participants: [],
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

export const REVENUE_BASES = [
  'Sales Orders',
  'Invoices',
  'Collections',
  'Contracts'
];

// Add the missing MOCK_SCHEMES constant
export const MOCK_SCHEMES = [
  {
    name: 'Sales Representatives Plan',
    description: 'Standard commission plan for sales representatives',
  },
  {
    name: 'Account Executives Plan',
    description: 'Enhanced commission plan for account executives',
  },
  {
    name: 'Sales Managers Plan',
    description: 'Management-level incentive plan',
  }
];
