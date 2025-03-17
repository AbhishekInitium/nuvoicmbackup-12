
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Apr', quota: 450000, achieved: 425000 },
  { month: 'May', quota: 450000, achieved: 475000 },
  { month: 'Jun', quota: 500000, achieved: 510000 },
  { month: 'Jul', quota: 500000, achieved: 520000 },
  { month: 'Aug', quota: 500000, achieved: 480000 },
  { month: 'Sep', quota: 550000, achieved: 580000 },
];

export const TeamPerformanceChart = () => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => `$${value.toLocaleString()}`}
            labelStyle={{ fontWeight: 'bold' }}
            contentStyle={{
              borderRadius: '8px',
              border: 'none',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Legend />
          <Bar dataKey="quota" name="Sales Quota" fill="#94A3B8" barSize={20} radius={[4, 4, 0, 0]} />
          <Bar dataKey="achieved" name="Revenue Achieved" fill="#3B82F6" barSize={20} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
