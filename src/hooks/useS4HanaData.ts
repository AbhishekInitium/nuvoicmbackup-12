
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getIncentivePlans, saveIncentivePlan, simulateIncentivePlan } from '@/services/incentive/incentivePlanService';
import { getSalesData } from '@/services/sales/salesService';
import { getEmployeeData } from '@/services/hr/employeeService';
import { IncentivePlan } from '@/types/incentiveTypes';

/**
 * Custom hook for working with S/4 HANA data
 */
export const useS4HanaData = () => {
  // Fetch incentive plans from S/4 HANA
  const {
    data: incentivePlans,
    isLoading: loadingPlans,
    error: plansError,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['incentivePlans'],
    queryFn: getIncentivePlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Mutation for saving an incentive plan
  const savePlanMutation = useMutation({
    mutationFn: (plan: IncentivePlan) => saveIncentivePlan(plan),
    onSuccess: () => {
      refetchPlans();
    },
  });

  // Helper function to fetch sales data with optional filtering
  const fetchSalesData = (employeeId?: string, startDate?: string, endDate?: string) => {
    return useQuery({
      queryKey: ['salesData', employeeId, startDate, endDate],
      queryFn: () => getSalesData(employeeId, startDate, endDate),
      staleTime: 5 * 60 * 1000,
      enabled: !!employeeId, // Only run if employeeId is provided
    });
  };

  // Helper function to fetch employee data
  const fetchEmployeeData = (employeeId?: string) => {
    return useQuery({
      queryKey: ['employeeData', employeeId],
      queryFn: () => getEmployeeData(employeeId),
      staleTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!employeeId, // Only run if employeeId is provided
    });
  };

  // Mutation for simulating an incentive plan
  const simulatePlanMutation = useMutation({
    mutationFn: ({
      planId, 
      employeeId, 
      startDate, 
      endDate
    }: {
      planId: string;
      employeeId: string;
      startDate: string;
      endDate: string;
    }) => simulateIncentivePlan(planId, employeeId, startDate, endDate),
  });

  return {
    incentivePlans,
    loadingPlans,
    plansError,
    savePlan: savePlanMutation.mutate,
    isSaving: savePlanMutation.isPending,
    saveError: savePlanMutation.error,
    fetchSalesData,
    fetchEmployeeData,
    simulatePlan: simulatePlanMutation.mutate,
    isSimulating: simulatePlanMutation.isPending,
    simulationError: simulatePlanMutation.error,
    simulationResult: simulatePlanMutation.data,
  };
};
