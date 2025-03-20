
import { useQuery } from '@tanstack/react-query';
import { getSalesOrganizations, SalesOrganization } from '@/services/sales/salesOrgService';

export function useSalesOrganizations() {
  const {
    data: salesOrgs,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['salesOrganizations'],
    queryFn: getSalesOrganizations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    salesOrgs: salesOrgs || [],
    isLoading,
    error,
    refetch
  };
}
