
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', revenue: 42000, commission: 1680 },
  { month: 'Feb', revenue: 38000, commission: 1520 },
  { month: 'Mar', revenue: 51000, commission: 2040 },
  { month: 'Apr', revenue: 63000, commission: 2520 },
  { month: 'May', revenue: 58000, commission: 2320 },
  { month: 'Jun', revenue: 72000, commission: 2880 },
  { month: 'Jul', revenue: 85000, commission: 3700 },
  { month: 'Aug', revenue: 93000, commission: 4180 },
  { month: 'Sep', revenue: 87000, commission: 3910 },
];

export const SalesCommissionChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
          <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <Tooltip />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#3B82F6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            name="Revenue ($)"
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="commission"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCommission)"
            name="Commission ($)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
