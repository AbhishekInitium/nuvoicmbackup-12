
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import ParticipantsSection from './ParticipantsSection';
import MeasurementRules from './MeasurementRules';
import CreditRules from './CreditRules';
import CustomRules from './CustomRules';
import SchemeAdministrator from './SchemeAdministrator';

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
        {/* 1. Revenue base for Calculation */}
        <RevenueBaseSelector
          revenueBase={plan.revenueBase}
          updateRevenueBase={(value) => updatePlan('revenueBase', value)}
        />
        
        {/* Scheme Administrator for technical configuration */}
        <SchemeAdministrator 
          revenueBase={plan.revenueBase}
          schemeId={plan.schemeId}
          name={plan.name}
        />
        
        {/* Participants section remains before the main metrics */}
        <ParticipantsSection 
          participants={plan.participants} 
          updatePlan={updatePlan} 
        />
        
        {/* 2. Qualifying Criteria, 3. Adjustments + Exclusions */}
        <MeasurementRules 
          measurementRules={plan.measurementRules}
          revenueBase={plan.revenueBase}
          currency={plan.currency}
          updateMeasurementRules={(updatedRules) => updatePlan('measurementRules', updatedRules)}
        />
        
        {/* 4. Custom Rules - moved to come after exclusions (which are part of MeasurementRules) */}
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
