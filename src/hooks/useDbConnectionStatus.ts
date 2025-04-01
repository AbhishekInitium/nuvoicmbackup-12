
import { useQuery } from '@tanstack/react-query';
import { checkDatabaseConnection, DatabaseConnectionStatus } from '@/services/database/kpiMappingService';
import { useState } from 'react';

export const useDbConnectionStatus = () => {
  const [isUsingInMemoryStorage, setIsUsingInMemoryStorage] = useState<boolean>(false);

  const { 
    data: connectionStatus, 
    isLoading: isCheckingConnection,
    error: connectionError,
    refetch: recheckConnection
  } = useQuery({
    queryKey: ['dbConnectionStatus'],
    queryFn: checkDatabaseConnection,
    meta: {
      onSettled: (data: DatabaseConnectionStatus | undefined) => {
        if (data) {
          setIsUsingInMemoryStorage(!data.connected);
        } else {
          setIsUsingInMemoryStorage(true);
        }
      },
      onError: () => {
        setIsUsingInMemoryStorage(true);
      }
    }
  });

  return {
    connectionStatus,
    isCheckingConnection,
    connectionError,
    recheckConnection,
    isUsingInMemoryStorage
  };
};
