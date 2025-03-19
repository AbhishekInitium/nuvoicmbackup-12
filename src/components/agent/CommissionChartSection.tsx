
import React from 'react';
import GlassCard from '@/components/ui-custom/GlassCard';
import { SalesCommissionChart } from '@/components/agent/SalesCommissionChart';

const CommissionChartSection = () => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Commission Trends</h2>
        <SalesCommissionChart />
      </div>
    </GlassCard>
  );
};

export default CommissionChartSection;
