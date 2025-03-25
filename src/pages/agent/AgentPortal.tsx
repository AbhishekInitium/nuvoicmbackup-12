
import React, { useEffect, useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { useToast } from '@/hooks/use-toast';
import AgentDashboardHeader from '@/components/agent/AgentDashboardHeader';
import AgentProfile from '@/components/agent/AgentProfile';
import QuotaAttainmentChart from '@/components/agent/QuotaAttainmentChart';
import BookingsProduction from '@/components/agent/BookingsProduction';
import CurrentPeriodPayment from '@/components/agent/CurrentPeriodPayment';
import QuarterlyBookingsChart from '@/components/agent/QuarterlyBookingsChart';
import TopSellers from '@/components/agent/TopSellers';
import RecentBookings from '@/components/agent/RecentBookings';
import Reminder from '@/components/agent/Reminder';

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

  return (
    <div className="min-h-screen bg-app-gray-50">
      <NavBar />
      
      <div className="py-6">
        <Container maxWidth="full">
          <AgentDashboardHeader 
            employeeData={employeeData} 
            empLoading={empLoading} 
            salesLoading={salesLoading}
            period={period}
            setPeriod={setPeriod}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <AgentProfile employeeData={employeeData} />
            <QuotaAttainmentChart />
            <BookingsProduction />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CurrentPeriodPayment />
            <QuarterlyBookingsChart />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TopSellers />
            <RecentBookings />
            <Reminder />
          </div>
        </Container>
      </div>
    </div>
  );
};

export default AgentPortal;
