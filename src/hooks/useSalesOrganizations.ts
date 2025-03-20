
import { useQuery } from '@tanstack/react-query';
import { getSalesOrganizations, SalesOrganization } from '@/services/sales/salesOrgService';

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
    queryFn: getSalesOrganizations,
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
