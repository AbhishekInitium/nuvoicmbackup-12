
import React from 'react';
import { CalendarDays } from 'lucide-react';

interface AgentDashboardHeaderProps {
  employeeData: any;
  empLoading: boolean;
  salesLoading: boolean;
  period: string;
  setPeriod: (period: string) => void;
}

const AgentDashboardHeader: React.FC<AgentDashboardHeaderProps> = ({ 
  employeeData, 
  empLoading, 
  salesLoading,
  period,
  setPeriod
}) => {
  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-gray-900">Dashboard</h1>
          <p className="text-app-gray-600 text-sm">
            for Account Executive
          </p>
        </div>
        
        <div className="inline-flex items-center border border-app-gray-200 rounded px-3 py-2 bg-white">
          <span className="text-sm text-app-gray-600 mr-2">
            <CalendarDays className="inline mr-2 h-4 w-4" />
            Sep 1, 2019 - Sep 30, 2019
          </span>
          <button className="text-app-blue text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
          </button>
        </div>
      </div>
      {(empLoading || salesLoading) && (
        <p className="text-sm text-app-gray-500 mt-1">
          Loading data from SAP S/4 HANA...
        </p>
      )}
    </header>
  );
};

export default AgentDashboardHeader;
