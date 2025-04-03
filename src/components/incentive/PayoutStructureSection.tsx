
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { Tier } from '@/types/incentiveTypes';
import CommissionStructure from './CommissionStructure';
import { Badge } from '@/components/ui/badge';

interface PayoutStructureSectionProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
  isReadOnly?: boolean;
  hasConfigSelected?: boolean;
}

const PayoutStructureSection: React.FC<PayoutStructureSectionProps> = ({
  tiers,
  currency,
  updateCommissionStructure,
  isReadOnly = false,
  hasConfigSelected = false
}) => {
  return (
    <SectionPanel 
      title="4. Commission Structure and Payout Tiers"
      badge={hasConfigSelected ? <Badge variant="success">Configuration Selected</Badge> : undefined}
    >
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
      </div>
    </SectionPanel>
  );
};

export default PayoutStructureSection;
