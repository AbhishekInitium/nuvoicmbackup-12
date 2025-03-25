
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const QuotaAttainmentChart = () => {
  // SVG for the circular progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.8457; // 84.57%
  const strokeDashoffset = circumference * (1 - progress);
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Quota Attainment</h3>
        <div className="flex justify-center">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
              />
              <text
                x="70"
                y="70"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#374151"
              >
                134.57%
              </text>
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotaAttainmentChart;
