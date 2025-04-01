export const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'JPY', label: 'Japanese Yen' },
  { code: 'CAD', label: 'Canadian Dollar' },
  { code: 'AUD', label: 'Australian Dollar' }
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
