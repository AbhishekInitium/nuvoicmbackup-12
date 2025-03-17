
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, ChevronRight } from 'lucide-react';

export const IncentivePlansList = () => {
  const incentivePlans = [
    {
      id: 1,
      name: 'North America Sales Plan',
      users: 8,
      status: 'active',
      effectiveDate: '2025-01-01',
      endDate: '2025-12-31',
    },
    {
      id: 2,
      name: 'EMEA Regional Plan',
      users: 6,
      status: 'active',
      effectiveDate: '2025-01-01',
      endDate: '2025-12-31',
    },
    {
      id: 3,
      name: 'APAC Q4 Accelerator',
      users: 5,
      status: 'draft',
      effectiveDate: '2025-10-01',
      endDate: '2025-12-31',
    },
  ];

  return (
    <div className="space-y-4">
      {incentivePlans.map((plan) => (
        <Link key={plan.id} to={`/manager/plans/${plan.id}`}>
          <div className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-app-gray-50 transition-colors">
            <div>
              <div className="font-medium text-app-gray-900">{plan.name}</div>
              <div className="flex items-center text-sm text-app-gray-600 mt-1">
                <div className="flex items-center mr-4">
                  <Users size={14} className="mr-1" /> {plan.users} agents
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" /> {plan.effectiveDate.substring(5)} - {plan.endDate.substring(5)}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`px-2 py-1 rounded text-xs font-medium mr-3 ${
                plan.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
              </div>
              <ChevronRight size={18} className="text-app-gray-400" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
