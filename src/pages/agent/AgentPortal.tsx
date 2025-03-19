
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { useToast } from '@/hooks/use-toast';
import AgentDashboardHeader from '@/components/agent/AgentDashboardHeader';
import DashboardMetricCards from '@/components/agent/DashboardMetricCards';
import CommissionChartSection from '@/components/agent/CommissionChartSection';
import PerformanceSection from '@/components/agent/PerformanceSection';
import IncentivePlanCard from '@/components/agent/IncentivePlanCard';
import LeaderboardCard from '@/components/agent/LeaderboardCard';
import GoalProgressCard from '@/components/agent/GoalProgressCard';

const AgentPortal = () => {
  const [period, setPeriod] = useState('quarter');
  const [employeeData, setEmployeeData] = useState<any>(null);
  const [salesData, setSalesData] = useState<any>(null);
  const { toast } = useToast();
  
  const { 
    incentivePlans,
    loadingPlans,
    fetchEmployeeData,
    fetchSalesData
  } = useS4HanaData();
  
  const employeeId = "EMP001";
  
  const {
    data: empData,
    isLoading: empLoading,
    error: empError
  } = fetchEmployeeData(employeeId);
  
  const {
    data: salesResult,
    isLoading: salesLoading,
    error: salesError
  } = fetchSalesData(
    employeeId,
    new Date(new Date().getFullYear(), 0, 1).toISOString(),
    new Date().toISOString()
  );
  
  useEffect(() => {
    if (empData && !empLoading) {
      setEmployeeData(empData.value?.[0] || null);
    }
    
    if (empError) {
      console.error('Error loading employee data:', empError);
      toast({
        title: "Connection Error",
        description: "Unable to fetch employee data from SAP S/4 HANA",
        variant: "destructive"
      });
    }
  }, [empData, empLoading, empError, toast]);
  
  useEffect(() => {
    if (salesResult && !salesLoading) {
      setSalesData(salesResult.value || []);
    }
    
    if (salesError) {
      console.error('Error loading sales data:', salesError);
      toast({
        title: "Connection Error",
        description: "Unable to fetch sales data from SAP S/4 HANA",
        variant: "destructive"
      });
    }
  }, [salesResult, salesLoading, salesError, toast]);

  const agentPlan = incentivePlans && incentivePlans.length > 0 
    ? incentivePlans.find(plan => 
        plan.participants.includes('USA') || 
        plan.participants.includes('ALL')
      ) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-8">
        <Container>
          <AgentDashboardHeader 
            employeeData={employeeData} 
            empLoading={empLoading} 
            salesLoading={salesLoading} 
          />
          
          <DashboardMetricCards />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <CommissionChartSection />
              <PerformanceSection period={period} setPeriod={setPeriod} />
            </div>
            
            <div className="space-y-8">
              <IncentivePlanCard agentPlan={agentPlan} />
              <LeaderboardCard />
              <GoalProgressCard />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AgentPortal;
