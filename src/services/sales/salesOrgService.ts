
import { s4Request, S4_API_BASE_URL } from '../base/s4BaseService';

export interface SalesOrganization {
  SalesOrganization: string;
  SalesOrganizationName: string;
  CompanyCode?: string;
  Country?: string;
}

export interface SalesArea {
  SalesOrganization: string;
  DistributionChannel: string;
  Division: string;
  SalesAreaID?: string;
  SalesOrgName?: string;
  DistributionChannelName?: string;
  DivisionName?: string;
}

// Response type for OData V4 format
interface ODataResponse<T> {
  "@odata.context": string;
  "@odata.metadataEtag"?: string;
  "value": T[];
}

// Fallback data in case the API is not available
const FALLBACK_SALES_ORGS: SalesOrganization[] = [
  { SalesOrganization: "1000", SalesOrganizationName: "North America Sales", CompanyCode: "1000", Country: "US" },
  { SalesOrganization: "2000", SalesOrganizationName: "EMEA Sales", CompanyCode: "2000", Country: "DE" },
  { SalesOrganization: "3000", SalesOrganizationName: "APAC Sales", CompanyCode: "3000", Country: "SG" },
  { SalesOrganization: "4000", SalesOrganizationName: "LATAM Sales", CompanyCode: "4000", Country: "BR" },
  { SalesOrganization: "5000", SalesOrganizationName: "Global Enterprise", CompanyCode: "5000", Country: "US" }
];

/**
 * Fetch sales areas from backend system
 */
export const getSalesOrganizations = async (): Promise<SalesOrganization[]> => {
  try {
    // Using the SalesArea API endpoint through our proxy
    const endpoint = '/sap/opu/odata4/sap/api_salesarea/srvd_a2x/sap/salesarea/0001/SalesArea';
    
    console.log('Fetching sales areas from endpoint:', endpoint);
    
    // Match Postman request format exactly with proper headers and parameters
    const response = await s4Request<ODataResponse<SalesArea>>(
      'GET',
      endpoint,
      undefined,
      {
        '$format': 'json'
      }
    );
    
    console.log('Sales areas response:', response);
    
    if (!response || !response.value || !Array.isArray(response.value)) {
      console.warn('Invalid response format from API, using fallback data');
      return FALLBACK_SALES_ORGS;
    }
    
    // Transform the sales areas to the expected SalesOrganization format
    const salesOrgs: SalesOrganization[] = response.value.map(area => ({
      SalesOrganization: area.SalesOrganization,
      SalesOrganizationName: area.SalesOrgName || `${area.SalesOrganization} (${area.DistributionChannel}/${area.Division})`,
      CompanyCode: `${area.DistributionChannel} / ${area.Division}`,
      Country: area.SalesAreaID || 'N/A'
    }));
    
    // Remove duplicates based on SalesOrganization
    const uniqueSalesOrgs = Array.from(new Map(
      salesOrgs.map(item => [item.SalesOrganization, item])
    ).values());
    
    return uniqueSalesOrgs.length > 0 ? uniqueSalesOrgs : FALLBACK_SALES_ORGS;
  } catch (error) {
    console.error('Error fetching sales areas:', error);
    console.log('Using fallback sales organization data');
    return FALLBACK_SALES_ORGS;
  }
};
