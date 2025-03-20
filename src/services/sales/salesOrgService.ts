
import { s4Request, SAP_API_URL } from '../base/s4BaseService';

export interface SalesOrganization {
  SalesOrganization: string;
  SalesOrganizationName: string;
  CompanyCode?: string;
  Country?: string;
}

/**
 * Fetch sales organizations from SAP S/4 HANA
 */
export const getSalesOrganizations = async (): Promise<SalesOrganization[]> => {
  try {
    const endpoint = `${SAP_API_URL}/api/API_SALESORGANIZATION_SRV/A_SalesOrganization`;
    const response = await s4Request<{ d: { results: SalesOrganization[] } }>(
      'GET',
      endpoint,
      undefined,
      {
        $select: 'SalesOrganization,SalesOrganizationName,CompanyCode,Country',
        $format: 'json'
      }
    );
    
    return response.d.results;
  } catch (error) {
    console.error('Error fetching sales organizations:', error);
    return [];
  }
};
