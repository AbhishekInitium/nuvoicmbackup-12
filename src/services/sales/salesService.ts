
import { S4_API_BASE_URL, getS4Url, s4Request } from '../base/s4BaseService';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * S/4 HANA Sales Service
 * Service for retrieving sales-related data from S/4 HANA
 */

/**
 * Get sales data from S/4 HANA
 */
export const getSalesData = async (
  employeeId?: string,
  startDate?: string,
  endDate?: string
) => {
  const params: any = {};
  
  if (employeeId) params['$filter'] = `EmployeeID eq '${employeeId}'`;
  if (startDate) params['$filter'] = (params['$filter'] ? `${params['$filter']} and ` : '') + `CreationDate ge datetime'${startDate}'`;
  if (endDate) params['$filter'] = (params['$filter'] ? `${params['$filter']} and ` : '') + `CreationDate le datetime'${endDate}'`;
  
  return s4Request<any>(
    'GET',
    getS4Url(SAP_CONFIG.s4hana.services.salesOrders, 'A_SalesOrder'),
    undefined,
    {
      ...params,
      '$select': 'SalesOrder,SalesOrganization,TotalNetAmount,SalesOrderType,CreationDate,SoldToParty',
      '$expand': 'to_Item'
    }
  );
};
