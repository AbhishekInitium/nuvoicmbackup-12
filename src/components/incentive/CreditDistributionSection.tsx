
import React from 'react';
import { CreditLevel } from '@/types/incentiveTypes';
import CreditRules from './CreditRules';

interface CreditDistributionSectionProps {
  levels: CreditLevel[];
  updateCreditRules: (levels: CreditLevel[]) => void;
  isReadOnly?: boolean;
}

const CreditDistributionSection: React.FC<CreditDistributionSectionProps> = ({ 
  levels, 
  updateCreditRules,
  isReadOnly = false
}) => {
  return (
    <div className="space-y-6">
      <CreditRules 
        levels={levels}
        updateCreditRules={updateCreditRules}
        isReadOnly={isReadOnly}
      />
    </div>
  );
};

export default CreditDistributionSection;
