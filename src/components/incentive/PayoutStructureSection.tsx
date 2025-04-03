
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { Tier } from '@/types/incentiveTypes';
import CommissionStructure from './CommissionStructure';

interface PayoutStructureSectionProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
  isReadOnly?: boolean;
}

const PayoutStructureSection: React.FC<PayoutStructureSectionProps> = ({
  tiers,
  currency,
  updateCommissionStructure,
  isReadOnly = false
}) => {
  return (
    <SectionPanel title="4. Commission Structure and Payout Tiers">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Define the commission rate tiers based on sales performance. Tiers should not overlap and must cover the full range of possible values.
        </p>
        
        <CommissionStructure 
          tiers={tiers} 
          currency={currency}
          updateCommissionStructure={updateCommissionStructure} 
          isReadOnly={isReadOnly}
        />
        
        {tiers.length === 0 && !isReadOnly && (
          <div className="bg-yellow-50 p-3 rounded-md border border-yellow-100">
            <p className="text-sm text-yellow-700">
              No commission tiers defined. Please add at least one tier to specify the commission structure.
            </p>
          </div>
        )}
      </div>
    </SectionPanel>
  );
};

export default PayoutStructureSection;
