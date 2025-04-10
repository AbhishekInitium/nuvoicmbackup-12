
import React from 'react';
import { Tier } from '@/types/incentiveTypes';
import TierRow from './TierRow';

interface TiersTableProps {
  tiers: Tier[];
  currencySymbol: string;
  updateTier: (index: number, field: keyof Tier, value: string | number) => void;
  removeTier: (index: number) => void;
}

const TiersTable: React.FC<TiersTableProps> = ({
  tiers,
  currencySymbol,
  updateTier,
  removeTier
}) => {
  // This function handles tier updates with progressive values
  const handleTierUpdate = (index: number, field: keyof Tier, value: string | number) => {
    // Convert value to number if it's a string
    const numValue = typeof value === 'string' ? parseInt(value) || 0 : value;
    
    // If we're updating the "to" value of a tier, update the "from" value of the next tier
    if (field === 'to' && index < tiers.length - 1) {
      updateTier(index + 1, 'from', numValue + 1);
    }
    
    // Update the current tier
    updateTier(index, field, numValue);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-app-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-app-gray-200">
          <thead>
            <tr className="bg-app-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">From ({currencySymbol})</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">To ({currencySymbol})</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Commission Rate (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-app-gray-200">
            {tiers.map((tier, index) => (
              <TierRow 
                key={index}
                tier={tier}
                index={index}
                currencySymbol={currencySymbol}
                updateTier={handleTierUpdate}
                removeTier={removeTier}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TiersTable;
