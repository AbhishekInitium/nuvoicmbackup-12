
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { CreditLevel } from '@/types/incentiveTypes';
import CreditRules from './CreditRules';

interface CreditDistributionSectionProps {
  levels: CreditLevel[];
  updateCreditRules: (levels: CreditLevel[]) => void;
}

const CreditDistributionSection: React.FC<CreditDistributionSectionProps> = ({ 
  levels, 
  updateCreditRules 
}) => {
  return (
    <SectionPanel title="3. Credit Distribution">
      <div className="space-y-6">
        <CreditRules 
          levels={levels}
          updateCreditRules={updateCreditRules}
        />
      </div>
    </SectionPanel>
  );
};

export default CreditDistributionSection;
