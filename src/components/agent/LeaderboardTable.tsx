
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Sarah Johnson', revenue: 750000, change: 'up' },
  { rank: 2, name: 'Michael Chen', revenue: 685000, change: 'up' },
  { rank: 3, name: 'Alex Morgan', revenue: 642000, change: 'same' },
  { rank: 4, name: 'Jennifer Lee', revenue: 612000, change: 'down' },
  { rank: 5, name: 'David Williams', revenue: 584000, change: 'up' },
];

export const LeaderboardTable = () => {
  // Function to determine rank change icon
  const getRankChangeIcon = (change) => {
    switch (change) {
      case 'up':
        return <TrendingUp size={14} className="text-green-500" />;
      case 'down':
        return <TrendingDown size={14} className="text-red-500" />;
      default:
        return <Minus size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="overflow-hidden">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-app-gray-200">
            <th className="py-2 text-left text-xs font-medium text-app-gray-500 w-12">Rank</th>
            <th className="py-2 text-left text-xs font-medium text-app-gray-500">Agent</th>
            <th className="py-2 text-right text-xs font-medium text-app-gray-500">Revenue</th>
            <th className="py-2 text-center text-xs font-medium text-app-gray-500 w-12">Change</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((agent) => (
            <tr key={agent.rank} className="border-b border-app-gray-100 hover:bg-app-gray-50">
              <td className="py-3 text-sm">
                <div className="font-medium">#{agent.rank}</div>
              </td>
              <td className="py-3 text-sm">
                <div className="font-medium text-app-gray-900">
                  {agent.name}
                  {agent.rank === 3 && (
                    <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">You</Badge>
                  )}
                </div>
              </td>
              <td className="py-3 text-sm text-right">
                <div className="font-medium text-app-gray-900">${agent.revenue.toLocaleString()}</div>
              </td>
              <td className="py-3 text-center">
                {getRankChangeIcon(agent.change)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
