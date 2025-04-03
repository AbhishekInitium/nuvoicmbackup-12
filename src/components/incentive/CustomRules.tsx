
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { CustomRule } from '@/types/incentiveTypes';
import { useCustomRules } from '../incentive/useCustomRules';
import EmptyRulesState from './EmptyRulesState';
import CustomRuleCard from './CustomRuleCard';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

interface CustomRulesProps {
  customRules: CustomRule[];
  currency: string;
  updateCustomRules: (rules: CustomRule[]) => void;
  selectedScheme?: SchemeAdminConfig | null;
  kpiMetadata?: Record<string, KpiField>;
}

const CustomRules: React.FC<CustomRulesProps> = ({ 
  customRules, 
  currency, 
  updateCustomRules,
  selectedScheme,
  kpiMetadata
}) => {
  const {
    rules,
    getAvailableFields,
    addCustomRule,
    updateCustomRule,
    removeCustomRule
  } = useCustomRules(customRules, updateCustomRules);
  
  // Get fields from selectedScheme if available
  const getCustomFields = () => {
    if (!selectedScheme?.customRules?.length) return getAvailableFields();
    
    // Extract KPI names from custom rules
    return selectedScheme.customRules.map(rule => rule.kpi);
  };
  
  const customFields = getCustomFields();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-app-gray-700">
          Custom Rules
        </label>
        <ActionButton
          variant="outline"
          size="sm"
          onClick={addCustomRule}
        >
          <PlusCircle size={16} className="mr-1" /> Add Custom Rule
        </ActionButton>
      </div>
      
      {rules.length === 0 ? (
        <EmptyRulesState
          message="No custom rules defined"
          description="Add custom rules for special handling of specific cases"
          buttonText="Add Custom Rule"
          onAction={addCustomRule}
        />
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <CustomRuleCard
              key={index}
              rule={rule}
              availableFields={customFields}
              currency={currency}
              onUpdate={(field, value) => updateCustomRule(index, field, value)}
              onRemove={() => removeCustomRule(index)}
              selectedScheme={selectedScheme}
              kpiMetadata={kpiMetadata}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRules;
