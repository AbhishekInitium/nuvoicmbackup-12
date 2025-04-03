
import React from 'react';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { useCommissionTiers } from '@/hooks/useCommissionTiers';
import TierEditor from './TierEditor';
import { Tier } from '@/types/incentiveTypes';
import ActionButton from '../ui-custom/ActionButton';
import EmptyRulesState from './EmptyRulesState';
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { tiers: localTiers, addTier, removeTier, updateTier, hasOverlappingTiers } = useCommissionTiers(
    { tiers: tiers || [] },
    (structure) => updateCommissionStructure(structure.tiers)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-app-gray-700">Commission Tiers</h3>
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

      {hasOverlappingTiers() && !isReadOnly && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Tier ranges overlap. Please adjust the 'From' and 'To' values to ensure tiers don't overlap.
          </AlertDescription>
        </Alert>
      )}

      {localTiers.length === 0 ? (
        <EmptyRulesState
          message="No commission tiers defined"
          description="Define how commissions are calculated for different sales levels"
          buttonText="Add Commission Tier"
          onAction={!isReadOnly ? addTier : undefined}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="text-left border-b border-app-gray-200">
                <th className="px-4 py-3 text-app-gray-600 font-medium text-sm">From</th>
                <th className="px-4 py-3 text-app-gray-600 font-medium text-sm">To</th>
                <th className="px-4 py-3 text-app-gray-600 font-medium text-sm">Rate (%)</th>
                <th className="px-4 py-3 text-app-gray-600 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {localTiers.map((tier, index) => (
                <TierEditor
                  key={index}
                  tier={tier}
                  index={index}
                  updateTier={updateTier}
                  removeTier={removeTier}
                  currency={currency}
                  isReadOnly={isReadOnly}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CommissionStructure;
