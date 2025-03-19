
import React from 'react';
import { Target } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';

const GoalProgressCard = () => {
  return (
    <GlassCard className="bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Target className="h-5 w-5 text-app-blue mr-2" />
          <h2 className="text-lg font-semibold">Goal Progress</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-app-gray-700">Quarterly Target</span>
              <span className="text-sm font-medium">84%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5">
              <div className="bg-app-blue h-2.5 rounded-full" style={{ width: '84%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-app-gray-700">New Accounts</span>
              <span className="text-sm font-medium">60%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5">
              <div className="bg-app-green h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-app-gray-700">Deal Size</span>
              <span className="text-sm font-medium">92%</span>
            </div>
            <div className="w-full bg-white rounded-full h-2.5">
              <div className="bg-app-purple h-2.5 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default GoalProgressCard;
