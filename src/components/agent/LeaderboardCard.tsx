
import React, { useState } from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { LeaderboardTable } from '@/components/agent/LeaderboardTable';

const LeaderboardCard = () => {
  const [sortBy, setSortBy] = useState('revenue');
  
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Team Leaderboard</h2>
          <select 
            className="text-app-gray-800 bg-app-gray-100 rounded px-2 py-1 text-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="revenue">By Revenue</option>
            <option value="deals">By Deals</option>
          </select>
        </div>
        <LeaderboardTable />
      </div>
    </GlassCard>
  );
};

export default LeaderboardCard;
