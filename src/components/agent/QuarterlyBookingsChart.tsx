
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { month: 'July 2019', totalBookings: 120000, monthlyQuota: 90000 },
  { month: 'August 2019', totalBookings: 130000, monthlyQuota: 90000 },
  { month: 'September 2019', totalBookings: 95000, monthlyQuota: 90000 },
];

const QuarterlyBookingsChart = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quarterly Bookings vs. Quota</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" />
              <YAxis 
                tickFormatter={(value) => {
                  if (value === 0) return "$0.00";
                  return `$${value / 1000}k`;
                }}
              />
              <Tooltip 
                formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Bar 
                dataKey="totalBookings" 
                name="Total Bookings" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar 
                dataKey="monthlyQuota" 
                name="Monthly Quota" 
                fill="#fbbf24" 
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuarterlyBookingsChart;
