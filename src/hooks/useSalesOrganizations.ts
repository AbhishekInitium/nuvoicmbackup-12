
import { useQuery } from '@tanstack/react-query';
import { SalesOrganization } from '@/services/sales/salesOrgService';
import axios from 'axios';

export function useSalesOrganizations() {
  const {
    data: salesOrgs,
    isLoading,
    error,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['salesOrganizations'],
    queryFn: fetchSalesOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once to avoid excessive failed requests
    refetchOnWindowFocus: false // Prevent refetching when window regains focus
  });

  // Determine if we're using fallback data
  const isUsingFallback = isError || (salesOrgs && salesOrgs.length > 0 && salesOrgs[0].SalesOrganization === "1000");

  return {
    salesOrgs: salesOrgs || [],
    isLoading,
    isFetching,
    error,
    refetch,
    isUsingFallback
  };
}

// Fallback data in case the API is not available
const FALLBACK_SALES_ORGS: SalesOrganization[] = [
  { SalesOrganization: "1000", SalesOrganizationName: "North America Sales", CompanyCode: "1000", Country: "US" },
  { SalesOrganization: "2000", SalesOrganizationName: "EMEA Sales", CompanyCode: "2000", Country: "DE" },
  { SalesOrganization: "3000", SalesOrganizationName: "APAC Sales", CompanyCode: "3000", Country: "SG" },
  { SalesOrganization: "4000", SalesOrganizationName: "LATAM Sales", CompanyCode: "4000", Country: "BR" },
  { SalesOrganization: "5000", SalesOrganizationName: "Global Enterprise", CompanyCode: "5000", Country: "US" }
];

// Function to fetch sales organizations directly without proxy and without relying on other services
async function fetchSalesOrganizations(): Promise<SalesOrganization[]> {
  try {
    // Direct API call to SAP system - the exact endpoint provided by the user
    const endpoint = 'https://my418390-api.s4hana.cloud.sap/sap/opu/odata4/sap/api_salesarea/srvd_a2x/sap/salesarea/0001/SalesArea';
    
    console.log('Fetching sales areas from endpoint:', endpoint);
    
    // Basic auth credentials
    const username = 'S4HANA_BASIC';
    const password = 'GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi';
    const base64Credentials = btoa(`${username}:${password}`);
    
    // Make the direct API call with necessary headers
    const response = await axios({
      method: 'GET',
      url: endpoint,
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'sap-usercontext=sap-client=080'
        // Removed CORS headers as they are not needed for direct browser calls
      },
      params: {
        '$format': 'json',
        '$select': 'SalesOrganization,DistributionChannel,Division,SalesOrgName'
      }
    });
    
    console.log('Raw sales areas response:', JSON.stringify(response.data).substring(0, 500));
    
    // Check if response is valid
    if (!response.data || typeof response.data !== 'object') {
      console.warn('Invalid response format - not an object');
      return FALLBACK_SALES_ORGS;
    }
    
    // Check for OData structure
    if (!response.data["@odata.context"] && !response.data.value) {
      console.warn('Response is not in OData format, missing @odata.context or value array');
      return FALLBACK_SALES_ORGS;
    }
    
    // Ensure value is an array
    if (!Array.isArray(response.data.value)) {
      console.warn('Response value is not an array');
      return FALLBACK_SALES_ORGS;
    }
    
    console.log(`Found ${response.data.value.length} sales areas in response`);
    
    // Transform the sales areas to the expected SalesOrganization format
    const salesOrgs: SalesOrganization[] = response.data.value.map((area: any) => ({
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
}
