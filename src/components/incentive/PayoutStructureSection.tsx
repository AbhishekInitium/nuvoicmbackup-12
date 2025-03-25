
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { Tier } from '@/types/incentiveTypes';
import CommissionStructure from './CommissionStructure';

interface PayoutStructureSectionProps {
  tiers: Tier[];
  currency: string;
  updateCommissionStructure: (tiers: Tier[]) => void;
}

const PayoutStructureSection: React.FC<PayoutStructureSectionProps> = ({
  tiers,
  currency,
  updateCommissionStructure
}) => {
  return (
    <SectionPanel title="3. Rates and Payout Structure">
      <CommissionStructure 
        tiers={tiers} 
        currency={currency}
        updateCommissionStructure={updateCommissionStructure} 
      />
    </SectionPanel>
  );
};

export default PayoutStructureSection;
