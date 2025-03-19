
import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '@/components/ui-custom/GlassCard';
import { IncentivePlan } from '@/types/incentiveTypes';

interface IncentivePlanCardProps {
  agentPlan: IncentivePlan | null;
}

const IncentivePlanCard: React.FC<IncentivePlanCardProps> = ({ agentPlan }) => {
  return (
    <GlassCard>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Incentive Plan</h2>
        <div className="text-app-blue font-medium mb-3">
          {agentPlan ? agentPlan.name : 'North America Sales Plan'}
        </div>
        
        <div className="space-y-3">
          {agentPlan && agentPlan.commissionStructure.tiers.map((tier, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-app-gray-600">
                  {index === 0 ? 'Base Commission' : `Tier ${index} (${agentPlan.currency} ${tier.from.toLocaleString()}+)`}
                </span>
                <span className="font-medium">{tier.rate}%</span>
              </div>
            </div>
          ))}
          
          {!agentPlan && (
            <>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-gray-600">Base Commission</span>
                  <span className="font-medium">3%</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-app-gray-600">Tier 1 ($100k+)</span>
                  <span className="font-medium">4%</span>
                </div>
              </div>
            </>
          )}
          
          <div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-app-gray-600">Q3 Bonus Target</span>
              <span className="font-medium">$5,000</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-app-gray-200">
          <Link to="/agent/plan-details" className="text-app-blue text-sm hover:text-app-blue-dark">
            View full plan details →
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

export default IncentivePlanCard;
