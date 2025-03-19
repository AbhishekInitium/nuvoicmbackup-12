
import React from 'react';

interface AgentDashboardHeaderProps {
  employeeData: any;
  empLoading: boolean;
  salesLoading: boolean;
}

const AgentDashboardHeader: React.FC<AgentDashboardHeaderProps> = ({ 
  employeeData, 
  empLoading, 
  salesLoading 
}) => {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-app-gray-900">Agent Dashboard</h1>
        <div className="chip-label">Q3 2025</div>
      </div>
      <p className="text-app-gray-600">
        Welcome back, {employeeData ? `${employeeData.FirstName} ${employeeData.LastName}` : 'Alex Morgan'}
      </p>
      {(empLoading || salesLoading) && (
        <p className="text-sm text-app-gray-500 mt-1">
          Loading data from SAP S/4 HANA...
        </p>
      )}
    </header>
  );
};

export default AgentDashboardHeader;
