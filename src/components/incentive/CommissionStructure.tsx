
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { Tier } from '@/types/incentiveTypes';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import TiersTable from './TiersTable';
import { useCommissionTiers } from '@/hooks/useCommissionTiers';
import EmptyRulesState from './EmptyRulesState';

interface CommissionStructureProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
  isReadOnly?: boolean;
}

const CommissionStructure: React.FC<CommissionStructureProps> = ({ 
  tiers, 
  currency,
  updateCommissionStructure,
  isReadOnly = false
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  const { tiers: tierState, addTier, removeTier, updateTier } = useCommissionTiers(
    { tiers }, // Wrap tiers in an object with tiers property
    (structure) => updateCommissionStructure(structure.tiers) // Extract tiers from structure
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium text-app-gray-700">Tiered Commission Structure</label>
          {!isReadOnly && (
            <ActionButton 
              variant="outline"
              size="sm"
              onClick={addTier}
            >
              <PlusCircle size={16} className="mr-1" /> Add Tier
            </ActionButton>
          )}
        </div>
        
        {tierState.length === 0 ? (
          <EmptyRulesState
            message="No commission tiers defined"
            description="Add tiers to define the commission structure"
            buttonText="Add Commission Tier"
            onAction={addTier}
          />
        ) : (
          <TiersTable 
            tiers={tierState}
            currencySymbol={currencySymbol}
            updateTier={updateTier}
            removeTier={removeTier}
          />
        )}
        
        {tierState.length > 0 && (
          <p className="text-sm text-app-gray-500 mt-3">
            Sales within each tier range will be commissioned at the corresponding rate.
          </p>
        )}
      </div>
    </div>
  );
};

export default CommissionStructure;
