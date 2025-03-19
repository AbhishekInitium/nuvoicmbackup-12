
import React from 'react';
import { BadgeDollarSign, TrendingUp, Target, Users, CalendarDays } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';

const DashboardMetricCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <GlassCard className="bg-blue-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-app-gray-600">YTD Earnings</h3>
            <BadgeDollarSign className="h-5 w-5 text-app-blue" />
          </div>
          <p className="text-2xl font-bold text-app-gray-900">$128,450</p>
          <p className="text-xs text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> +12.3% from last year
          </p>
        </div>
      </GlassCard>
      
      <GlassCard className="bg-green-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-app-gray-600">Quota Attainment</h3>
            <Target className="h-5 w-5 text-app-green" />
          </div>
          <p className="text-2xl font-bold text-app-gray-900">84%</p>
          <p className="text-xs text-app-gray-500 mt-1">
            $420,000 of $500,000 target
          </p>
        </div>
      </GlassCard>
      
      <GlassCard className="bg-purple-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-app-gray-600">Leaderboard Rank</h3>
            <Users className="h-5 w-5 text-app-purple" />
          </div>
          <p className="text-2xl font-bold text-app-gray-900">#3 of 28</p>
          <p className="text-xs text-blue-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" /> Up 2 positions this month
          </p>
        </div>
      </GlassCard>
      
      <GlassCard className="bg-amber-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-app-gray-600">Next Payout</h3>
            <CalendarDays className="h-5 w-5 text-app-orange" />
          </div>
          <p className="text-2xl font-bold text-app-gray-900">Oct 15</p>
          <p className="text-xs text-app-gray-500 mt-1">
            Estimated: $14,250
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default DashboardMetricCards;
