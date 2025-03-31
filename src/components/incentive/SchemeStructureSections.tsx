
import React from 'react';
import SectionPanel from '../ui-custom/SectionPanel';
import { IncentivePlan } from '@/types/incentiveTypes';
import MeasurementRules from './MeasurementRules';
import CustomRules from './CustomRules';
import RevenueBaseSelector from './RevenueBaseSelector';

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
        {/* 2.1 Base Data */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">2.1 Base Data</h3>
          
          {/* Calculation Base (Revenue Base moved here) */}
          <div className="mb-6">
            <h4 className="text-md font-medium mb-2">Calculation Base</h4>
            <RevenueBaseSelector 
              revenueBase={plan.revenueBase}
              updateRevenueBase={(value) => updatePlan('revenueBase', value)}
            />
          </div>
        </div>
        
        {/* 2.2 Qualification Criteria */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-medium mb-4">2.2 Qualification Criteria</h3>
          
          {/* Inclusion, Exclusion, and Adjustments */}
          <MeasurementRules 
            measurementRules={plan.measurementRules}
            revenueBase={plan.revenueBase}
            currency={plan.currency}
            updateMeasurementRules={(updatedRules) => updatePlan('measurementRules', updatedRules)}
          />
        </div>
        
        {/* 2.3 Custom Rules */}
        <div>
          <h3 className="text-lg font-medium mb-4">2.3 Custom Rules</h3>
          <CustomRules 
            customRules={plan.customRules}
            currency={plan.currency}
            updateCustomRules={(rules) => updatePlan('customRules', rules)}
          />
        </div>
      </div>
    </SectionPanel>
  );
};

export default SchemeStructureSections;
