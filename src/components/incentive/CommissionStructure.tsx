
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { Tier } from '@/types/incentiveTypes';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import TiersTable from './TiersTable';
import { useCommissionTiers } from './useCommissionTiers';

interface CommissionStructureProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
}

const CommissionStructure: React.FC<CommissionStructureProps> = ({ 
  tiers, 
  currency,
  updateCommissionStructure 
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  const { tiers: tierState, addTier, removeTier, updateTier } = useCommissionTiers(
    tiers, 
    updateCommissionStructure
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-app-gray-700">Tiered Commission Structure</label>
          <ActionButton 
            variant="outline"
            size="sm"
            onClick={addTier}
          >
            <PlusCircle size={16} className="mr-1" /> Add Tier
          </ActionButton>
        </div>
        
        <TiersTable 
          tiers={tierState}
          currencySymbol={currencySymbol}
          updateTier={updateTier}
          removeTier={removeTier}
        />
        
        <p className="text-sm text-app-gray-500 mt-3">
          Sales within each tier range will be commissioned at the corresponding rate.
        </p>
      </div>
    </div>
  );
};

export default CommissionStructure;
