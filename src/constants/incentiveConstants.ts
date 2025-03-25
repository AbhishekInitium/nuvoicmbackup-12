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
  name: 'New Sales Incentive Plan',
  description: 'Describe the purpose and goals of this incentive plan',
  effectiveStart: new Date().toISOString().substring(0, 10), // Today's date in YYYY-MM-DD format
  effectiveEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10), // One year from today
  currency: 'USD',
  revenueBase: 'salesOrders',
  participants: ['ALL'], // Default to 'ALL' participants
  commissionStructure: {
    tiers: [
      {
        lowerBound: 0,
        upperBound: 100000,
        rate: 1
      },
      {
        lowerBound: 100001,
        upperBound: 250000,
        rate: 2
      },
      {
        lowerBound: 250001,
        upperBound: null, // No upper bound for the last tier
        rate: 3
      }
    ]
  },
  measurementRules: {
    primaryMetric: 'Net Revenue',
    minQualification: 50000, // Minimum qualification threshold
    adjustments: [],
    exclusions: []
  },
  creditRules: {
    levels: [
      {
        name: 'Primary Sales Rep',
        percentage: 100
      }
    ]
  },
  customRules: [],
  salesQuota: 1000000 // Default sales quota of 1M
};
