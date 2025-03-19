
import { getS4Url, s4Request } from '../base/s4BaseService';
import { SAP_CONFIG } from '@/config/sapConfig';

/**
 * S/4 HANA Employee Service
 * Service for retrieving employee data from S/4 HANA
 */

/**
 * Get employee data from S/4 HANA
 */
export const getEmployeeData = async (employeeId?: string) => {
  const params: any = {
    '$select': 'PersonWorkAgreement,PersonExternalID,FirstName,LastName,OrganizationalUnit'
  };
  
  if (employeeId) {
    params['$filter'] = `PersonExternalID eq '${employeeId}'`;
  }
  
  return s4Request<any>(
    'GET',
    getS4Url(SAP_CONFIG.s4hana.services.employees, 'A_WorkforcePersonAssignment'),
    undefined,
    params
  );
};
