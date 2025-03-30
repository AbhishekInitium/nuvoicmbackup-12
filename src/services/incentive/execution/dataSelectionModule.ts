
import { IncentivePlan } from '@/types/incentiveTypes';
import { s4Request } from '../../base/s4BaseService';
import { SAP_CONFIG } from '@/config/sapConfig';
import { LogLevel, addSystemLogEntry } from './loggingModule';

export interface DataSelectionParams {
  planId: string;
  planStartDate: string;
  processingDate: string;
  salesOrgs?: string[];
  participants?: string[];
  salesOrderNumber?: string; // Added to filter by sales order number
  salesRepId?: string;       // Added to filter by sales rep ID
}

export interface SelectedData {
  records: any[];
  sourceType: string;
  metadata: {
    totalRecords: number;
    filterApplied: {
      dateRange: {
        from: string;
        to: string;
      },
      participants?: string[];
      salesOrgs?: string[];
      salesOrderNumber?: string;
      salesRepId?: string;
    }
  }
}

/**
 * Select primary data for processing based on revenue base
 */
export const selectPrimaryData = async (
  plan: IncentivePlan, 
  params: DataSelectionParams
): Promise<SelectedData> => {
  console.log(`Starting data selection for plan ${plan.name} with revenue base: ${plan.revenueBase}`);
  
  // Select the appropriate data based on the revenue base
  switch (plan.revenueBase) {
    case 'salesOrders':
      return selectSalesOrdersData(params);
    case 'invoices':
      return selectInvoiceData(params);
    case 'paidInvoices':
      return selectPaidInvoiceData(params);
    default:
      console.warn(`Unknown revenue base type: ${plan.revenueBase}, falling back to sales orders`);
      return selectSalesOrdersData(params);
  }
};

/**
 * Select sales orders data using the S/4HANA API
 */
const selectSalesOrdersData = async (params: DataSelectionParams): Promise<SelectedData> => {
  console.log('Selecting sales orders data');
  
  try {
    // Build filter for date range
    let filter = `CreationDate ge datetime'${params.planStartDate}' and CreationDate le datetime'${params.processingDate}'`;
    
    // Add sales org filter if specified
    if (params.salesOrgs && params.salesOrgs.length > 0) {
      const salesOrgFilter = params.salesOrgs.map(org => `SalesOrganization eq '${org}'`).join(' or ');
      filter += ` and (${salesOrgFilter})`;
    }
    
    // Add sales order filter if specified
    if (params.salesOrderNumber) {
      filter += ` and SalesOrder eq '${params.salesOrderNumber}'`;
    }
    
    // Add sales rep filter if specified
    if (params.salesRepId) {
      filter += ` and SalesRepId eq '${params.salesRepId}'`;
    }
    
    // Make API call to S/4HANA
    const response = await s4Request<any>(
      'GET',
      `${SAP_CONFIG.s4hana.apiBasePath}/${SAP_CONFIG.s4hana.services.salesOrders}/A_SalesOrder`,
      undefined,
      {
        '$filter': filter,
        '$select': 'SalesOrder,SalesOrganization,CreationDate,TotalNetAmount,SoldToParty,SalesOrderType,DistributionChannel,SalesRepId',
        '$expand': 'to_Item'
      }
    );
    
    // Process API response
    const records = response.value || [];
    console.log(`Retrieved ${records.length} sales order records`);
    
    return {
      records,
      sourceType: 'salesOrders',
      metadata: {
        totalRecords: records.length,
        filterApplied: {
          dateRange: {
            from: params.planStartDate,
            to: params.processingDate
          },
          participants: params.participants,
          salesOrgs: params.salesOrgs,
          salesOrderNumber: params.salesOrderNumber,
          salesRepId: params.salesRepId
        }
      }
    };
  } catch (error) {
    console.error('Error selecting sales order data:', error);
    throw new Error(`Failed to select sales order data: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Select invoice data using the S/4HANA API
 */
const selectInvoiceData = async (params: DataSelectionParams): Promise<SelectedData> => {
  console.log('Selecting invoice data');
  
  try {
    // Build filter for date range
    let filter = `BillingDocumentDate ge datetime'${params.planStartDate}' and BillingDocumentDate le datetime'${params.processingDate}'`;
    
    // Add sales org filter if specified
    if (params.salesOrgs && params.salesOrgs.length > 0) {
      const salesOrgFilter = params.salesOrgs.map(org => `SalesOrganization eq '${org}'`).join(' or ');
      filter += ` and (${salesOrgFilter})`;
    }
    
    // Add sales order filter if specified (assuming BillingDocument can be filtered by SalesOrder)
    if (params.salesOrderNumber) {
      filter += ` and SalesOrder eq '${params.salesOrderNumber}'`;
    }
    
    // Add sales rep filter if specified
    if (params.salesRepId) {
      filter += ` and SalesRepId eq '${params.salesRepId}'`;
    }
    
    // Make API call to S/4HANA
    const response = await s4Request<any>(
      'GET',
      `${SAP_CONFIG.s4hana.apiBasePath}/${SAP_CONFIG.s4hana.services.financialDocuments}/A_BillingDocument`,
      undefined,
      {
        '$filter': filter,
        '$select': 'BillingDocument,SalesOrganization,BillingDocumentDate,TotalNetAmount,SoldToParty,PaymentStatus,DistributionChannel,SalesOrder,SalesRepId',
        '$expand': 'to_Item'
      }
    );
    
    // Process API response
    const records = response.value || [];
    console.log(`Retrieved ${records.length} invoice records`);
    
    return {
      records,
      sourceType: 'invoices',
      metadata: {
        totalRecords: records.length,
        filterApplied: {
          dateRange: {
            from: params.planStartDate,
            to: params.processingDate
          },
          participants: params.participants,
          salesOrgs: params.salesOrgs,
          salesOrderNumber: params.salesOrderNumber,
          salesRepId: params.salesRepId
        }
      }
    };
  } catch (error) {
    console.error('Error selecting invoice data:', error);
    throw new Error(`Failed to select invoice data: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Select paid invoice data using the S/4HANA API
 */
const selectPaidInvoiceData = async (params: DataSelectionParams): Promise<SelectedData> => {
  console.log('Selecting paid invoice data');
  
  try {
    // For now, this is similar to invoice data but with a payment status filter
    // We'll need to add a payment status filter once the API details are confirmed
    let filter = `BillingDocumentDate ge datetime'${params.planStartDate}' and BillingDocumentDate le datetime'${params.processingDate}' and PaymentStatus eq 'PAID'`;
    
    // Add sales org filter if specified
    if (params.salesOrgs && params.salesOrgs.length > 0) {
      const salesOrgFilter = params.salesOrgs.map(org => `SalesOrganization eq '${org}'`).join(' or ');
      filter += ` and (${salesOrgFilter})`;
    }
    
    // Add sales order filter if specified
    if (params.salesOrderNumber) {
      filter += ` and SalesOrder eq '${params.salesOrderNumber}'`;
    }
    
    // Add sales rep filter if specified
    if (params.salesRepId) {
      filter += ` and SalesRepId eq '${params.salesRepId}'`;
    }
    
    // Make API call to S/4HANA
    const response = await s4Request<any>(
      'GET',
      `${SAP_CONFIG.s4hana.apiBasePath}/${SAP_CONFIG.s4hana.services.financialDocuments}/A_BillingDocument`,
      undefined,
      {
        '$filter': filter,
        '$select': 'BillingDocument,SalesOrganization,BillingDocumentDate,TotalNetAmount,SoldToParty,PaymentStatus,DistributionChannel,SalesOrder,SalesRepId',
        '$expand': 'to_Item'
      }
    );
    
    // Process API response
    const records = response.value || [];
    console.log(`Retrieved ${records.length} paid invoice records`);
    
    return {
      records,
      sourceType: 'paidInvoices',
      metadata: {
        totalRecords: records.length,
        filterApplied: {
          dateRange: {
            from: params.planStartDate,
            to: params.processingDate
          },
          participants: params.participants,
          salesOrgs: params.salesOrgs,
          salesOrderNumber: params.salesOrderNumber,
          salesRepId: params.salesRepId
        }
      }
    };
  } catch (error) {
    console.error('Error selecting paid invoice data:', error);
    throw new Error(`Failed to select paid invoice data: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Apply initial qualifying criteria to raw data
 */
export const applyQualifyingCriteria = (
  data: SelectedData, 
  plan: IncentivePlan,
  executionId?: string
): SelectedData => {
  console.log('Applying qualifying criteria to raw data');
  
  if (!plan.measurementRules || !plan.measurementRules.primaryMetrics || plan.measurementRules.primaryMetrics.length === 0) {
    console.log('No qualifying criteria found, using all data');
    if (executionId) {
      addSystemLogEntry(executionId, 'Qualifying Criteria', 'No qualifying criteria defined, all records pass', 'INFO');
    }
    return data;
  }

  // Log start of qualification
  if (executionId) {
    addSystemLogEntry(
      executionId, 
      'Qualifying Criteria', 
      `Applying ${plan.measurementRules.primaryMetrics.length} qualifying criteria to ${data.records.length} records`, 
      'INFO'
    );
  }

  // Apply primary metrics as qualifying criteria
  const qualifiedRecords = data.records.filter(record => {
    // Check each primary metric
    const meetsAllCriteria = plan.measurementRules.primaryMetrics.every(metric => {
      const recordValue = record[metric.field];
      let passes = false;
      
      if (recordValue === undefined) {
        console.log(`Field ${metric.field} not found in record`);
        if (executionId) {
          addSystemLogEntry(
            executionId, 
            'Qualification Error', 
            `Field ${metric.field} not found in record`, 
            'WARNING'
          );
        }
        return false;
      }
      
      // Apply the operator
      switch (metric.operator) {
        case '=':
        case '==':
          passes = recordValue === metric.value;
          break;
        case '!=':
          passes = recordValue !== metric.value;
          break;
        case '>':
          passes = recordValue > metric.value;
          break;
        case '>=':
          passes = recordValue >= metric.value;
          break;
        case '<':
          passes = recordValue < metric.value;
          break;
        case '<=':
          passes = recordValue <= metric.value;
          break;
        default:
          passes = false;
      }
      
      // Log result for each criterion if execution ID is provided
      if (executionId) {
        const status = passes ? 'PASS' : 'FAIL';
        const logLevel: LogLevel = passes ? 'INFO' : 'WARNING';
        
        addSystemLogEntry(
          executionId,
          'Criterion Evaluation',
          `Record ${record.SalesOrder || record.BillingDocument}: ${metric.description || metric.field} ${metric.operator} ${metric.value} => ${status}`,
          logLevel,
          {
            criterion: metric.description || metric.field,
            operator: metric.operator,
            expected: metric.value,
            actual: recordValue,
            result: status
          }
        );
      }
      
      return passes;
    });
    
    return meetsAllCriteria;
  });
  
  console.log(`Applied qualifying criteria: ${qualifiedRecords.length} out of ${data.records.length} records qualified`);
  
  // Log qualification summary
  if (executionId) {
    addSystemLogEntry(
      executionId,
      'Qualification Summary',
      `${qualifiedRecords.length} out of ${data.records.length} records qualified (${Math.round((qualifiedRecords.length / data.records.length) * 100)}%)`,
      'INFO',
      {
        totalRecords: data.records.length,
        qualifiedRecords: qualifiedRecords.length,
        percentage: `${Math.round((qualifiedRecords.length / data.records.length) * 100)}%`
      }
    );
  }
  
  return {
    ...data,
    records: qualifiedRecords,
    metadata: {
      ...data.metadata,
      totalRecords: qualifiedRecords.length
    }
  };
};
