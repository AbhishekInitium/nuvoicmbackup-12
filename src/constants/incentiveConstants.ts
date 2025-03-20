// Mock data for existing schemes
export const MOCK_SCHEMES = [
  { id: 1, name: 'Enterprise Sales Plan 2024', description: 'For enterprise sales team' },
  { id: 2, name: 'SMB Commission Structure', description: 'For small and medium business sales' },
  { id: 3, name: 'APAC Regional Sales Plan', description: 'For Asia Pacific region' },
  { id: 4, name: 'Partner Channel Incentive', description: 'For partner sales channel' }
];

// Currency options
export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

// Database field options based on the revenue base
export const DB_FIELDS = {
  salesOrders: [
    'DiscountPercent', 'TotalAmount', 'ProductCategory', 'CustomerSegment', 
    'SalesRegion', 'DealSize', 'ContractTerm', 'PaymentTerms'
  ],
  invoices: [
    'InvoiceAmount', 'PaymentStatus', 'DueDate', 'DiscountApplied', 
    'TaxAmount', 'CustomerType', 'PaymentMethod', 'Currency'
  ],
  collections: [
    'CollectionAmount', 'CollectionDate', 'PaymentDelay', 'PaymentSource', 
    'CustomerCredit', 'LatePaymentFee', 'SettlementType', 'BankAccount'
  ]
};

// Operator options for conditions (removed starts_with and ends_with)
export const OPERATORS = [
  { value: '=', label: 'Equals (=)' },
  { value: '!=', label: 'Not Equals (≠)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '>=', label: 'Greater Than or Equal (≥)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '<=', label: 'Less Than or Equal (≤)' },
  { value: 'contains', label: 'Contains' }
];

// Time periods for custom rules
export const TIME_PERIODS = [
  { value: 'current', label: 'Current Period' },
  { value: 'past1month', label: 'Past Month' },
  { value: 'past3months', label: 'Past 3 Months' },
  { value: 'past6months', label: 'Past 6 Months' },
  { value: 'pastyear', label: 'Past Year' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'qtd', label: 'Quarter to Date' }
];

// Metrics for custom rules
export const METRICS = [
  { value: 'sales', label: 'Sales Amount' },
  { value: 'units', label: 'Units Sold' },
  { value: 'deals', label: 'Number of Deals' },
  { value: 'monthlySales', label: 'Monthly Sales' },
  { value: 'averageDealSize', label: 'Average Deal Size' },
  { value: 'customerRetention', label: 'Customer Retention' },
  { value: 'newCustomers', label: 'New Customers' }
];

// Default plan data structure
export const DEFAULT_PLAN = {
  name: 'North America Sales Incentive Plan',
  description: 'Commission plan for North America sales team',
  effectiveStart: '2025-01-01',
  effectiveEnd: '2025-12-31',
  currency: 'USD',
  revenueBase: 'salesOrders',
  participants: [], // Empty by default, will be populated from SAP API
  commissionStructure: {
    tiers: [
      { from: 0, to: 100000, rate: 3 },
      { from: 100001, to: 250000, rate: 4 }
    ]
  },
  measurementRules: {
    primaryMetric: 'revenue',
    minQualification: 50000,
    adjustments: [
      { field: 'DiscountPercent', operator: '>', value: 20, factor: 0.8, description: 'High discount adjustment' }
    ],
    exclusions: [
      { field: 'PaymentTerms', operator: '>', value: 60, description: 'Exclude long payment terms' }
    ]
  },
  creditRules: {
    levels: [
      { name: 'Sales Representative', percentage: 80 },
      { name: 'Sales Manager', percentage: 20 }
    ]
  },
  customRules: [
    {
      name: 'Consistent Sales Qualification',
      description: 'Sales rep must have minimum sales for past 3 consecutive months',
      conditions: [
        { period: 'past3months', metric: 'monthlySales', operator: '>=', value: 10000 }
      ],
      action: 'qualify',
      active: true
    }
  ]
};
