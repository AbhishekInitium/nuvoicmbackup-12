/**
 * SAP BTP and S/4 HANA Configuration
 * This file contains configuration for SAP BTP deployment and S/4 HANA API integration
 */

export const SAP_CONFIG = {
  // BTP Environment Configuration
  btp: {
    region: 'eu10', // Change to your BTP region
    subaccount: 'incentivemanagement',
  },
  
  // HANA Cloud Configuration
  hanaCloud: {
    schemaPrefix: 'NOVO_ICM_',
    tables: {
      incentivePlans: 'INCENTIVE_PLANS',
      participants: 'PARTICIPANTS',
      commissionRules: 'COMMISSION_RULES',
      salesData: 'SALES_DATA',
      payouts: 'PAYOUTS'
    }
  },
  
  // S/4 HANA API Configuration
  s4hana: {
    apiBasePath: '/sap/opu/odata/sap', // Base path for S/4 HANA OData services
    services: {
      salesOrders: 'API_SALES_ORDER_SRV',
      businessPartners: 'API_BUSINESS_PARTNER',
      employees: 'API_EMPLOYEE',
      financialDocuments: 'API_FINANCIAL_DOCUMENT',
      productMaster: 'API_PRODUCT_SRV',
      salesOrganization: 'API_SALESORGANIZATION_SRV'
    }
  }
};

// API endpoints for incentive management
export const API_ENDPOINTS = {
  // Sales data endpoints
  sales: {
    getSalesData: '/getSalesData',
    getSalesOrdersByEmployee: '/getSalesOrdersByEmployee',
    getSalesPerformance: '/getSalesPerformance',
    getSalesOrganizations: '/getSalesOrganizations'
  },
  
  // Incentive plan endpoints
  incentives: {
    getIncentivePlans: '/getIncentivePlans',
    getIncentivePlanDetails: '/getIncentivePlanDetails',
    saveIncentivePlan: '/saveIncentivePlan'
  },
  
  // Employee and participant endpoints
  employees: {
    getEmployees: '/getEmployees',
    getEmployeeDetails: '/getEmployeeDetails',
    getEmployeeAssignments: '/getEmployeeAssignments'
  },
  
  // Commission and payment endpoints
  commissions: {
    calculateCommission: '/calculateCommission',
    getPayoutHistory: '/getPayoutHistory',
    simulateIncentive: '/simulateIncentive'
  }
};
