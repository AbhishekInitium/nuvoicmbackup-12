
import React from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { PerformanceMetrics } from '@/components/agent/PerformanceMetrics';

interface PerformanceSectionProps {
  period: string;
  setPeriod: (period: string) => void;
}

const PerformanceSection: React.FC<PerformanceSectionProps> = ({ period, setPeriod }) => {
  return (
    <GlassCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Performance</h2>
          <div className="flex items-center text-sm">
            <span className="text-app-gray-600 mr-2">Period:</span>
            <select 
              className="text-app-gray-800 bg-app-gray-100 rounded px-2 py-1"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="lastQuarter">Last Quarter</option>
            </select>
          </div>
        </div>
        <PerformanceMetrics />
      </div>
    </GlassCard>
  );
};

export default PerformanceSection;
