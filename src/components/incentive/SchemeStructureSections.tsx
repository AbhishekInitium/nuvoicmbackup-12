
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import ParticipantsSection from './ParticipantsSection';
import MeasurementRules from './MeasurementRules';
import CreditRules from './CreditRules';
import CustomRules from './CustomRules';

interface SchemeStructureSectionsProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
}

const SchemeStructureSections: React.FC<SchemeStructureSectionsProps> = ({ 
  plan, 
  updatePlan 
}) => {
  return (
    <SectionPanel title="2. Scheme Structure">
      <div className="space-y-8">
        <RevenueBaseSelector
          revenueBase={plan.revenueBase}
          updateRevenueBase={(value) => updatePlan('revenueBase', value)}
        />
        
        <ParticipantsSection 
          participants={plan.participants} 
          updatePlan={updatePlan} 
        />
        
        <MeasurementRules 
          measurementRules={plan.measurementRules}
          revenueBase={plan.revenueBase}
          currency={plan.currency}
          updateMeasurementRules={(updatedRules) => updatePlan('measurementRules', updatedRules)}
        />
        
        <CreditRules 
          levels={plan.creditRules.levels}
          updateCreditRules={(levels) => updatePlan('creditRules', { levels })}
        />
        
        <CustomRules 
          customRules={plan.customRules}
          currency={plan.currency}
          updateCustomRules={(rules) => updatePlan('customRules', rules)}
        />
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSections;
