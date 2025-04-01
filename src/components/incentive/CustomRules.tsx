
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { CustomRule } from '@/types/incentiveTypes';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { useCustomRules } from './useCustomRules';
import CustomRuleCard from './CustomRuleCard';
import { SchemeAdminConfig } from '@/types/schemeAdminTypes';

interface CustomRulesProps {
  customRules: CustomRule[];
  currency: string;
  updateCustomRules: (rules: CustomRule[]) => void;
  selectedScheme?: SchemeAdminConfig | null;
}

const CustomRules: React.FC<CustomRulesProps> = ({ 
  customRules, 
  currency,
  updateCustomRules,
  selectedScheme
}) => {
  const currencySymbol = getCurrencySymbol(currency);
  const { 
    rules, 
    addCustomRule, 
    removeCustomRule,
    addCustomRuleCondition,
    removeCustomRuleCondition,
    updateCustomRule,
    updateCustomRuleCondition
  } = useCustomRules(customRules, updateCustomRules);

  // Get available fields from the selected scheme configuration
  const getAvailableFields = () => {
    if (!selectedScheme) return [];
    
    // Gather KPIs from all categories
    const qualificationKpis = selectedScheme.qualificationFields?.map(field => field.kpi) || [];
    const adjustmentKpis = selectedScheme.adjustmentFields?.map(field => field.kpi) || [];
    const exclusionKpis = selectedScheme.exclusionFields?.map(field => field.kpi) || [];
    const customKpis = selectedScheme.customRules?.map(field => field.kpi) || [];
    
    // Merge all KPIs and remove duplicates
    return [...new Set([...qualificationKpis, ...adjustmentKpis, ...exclusionKpis, ...customKpis])];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium text-app-gray-700">Custom Rules</h3>
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={addCustomRule}
        >
          <PlusCircle size={16} className="mr-1" /> Add Rule
        </ActionButton>
      </div>
      
      {rules.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-app-gray-500">No custom rules defined yet</p>
          <ActionButton
            variant="outline"
            size="sm"
            onClick={addCustomRule}
            className="mx-auto mt-4"
          >
            <PlusCircle size={16} className="mr-1" /> Add Rule
          </ActionButton>
        </div>
      ) : (
        <div className="space-y-8">
          {rules.map((rule, ruleIndex) => (
            <CustomRuleCard
              key={ruleIndex}
              rule={rule}
              ruleIndex={ruleIndex}
              currencySymbol={currencySymbol}
              availableFields={getAvailableFields()}
              onUpdateRule={(field, value) => updateCustomRule(ruleIndex, field, value)}
              onUpdateCondition={(condIndex, field, value) => 
                updateCustomRuleCondition(ruleIndex, condIndex, field, value)
              }
              onAddCondition={() => addCustomRuleCondition(ruleIndex)}
              onRemoveCondition={(condIndex) => removeCustomRuleCondition(ruleIndex, condIndex)}
              onRemoveRule={() => removeCustomRule(ruleIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRules;
