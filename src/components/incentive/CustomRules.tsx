
import React from 'react';
import { CustomRule } from '@/types/incentiveTypes';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import CustomRuleCard from './CustomRuleCard';
import EmptyRulesState from './EmptyRulesState';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { useCustomRules } from './useCustomRules';
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
  const { rules, addRule, updateRule, removeRule } = useCustomRules(customRules, updateCustomRules);

  // Get custom fields from the selected scheme if available
  const getCustomFields = () => {
    if (!selectedScheme?.customRules?.length) return [];
    return selectedScheme.customRules.map(rule => rule.kpi);
  };

  const customFields = getCustomFields();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Rules</h3>
        <ActionButton
          variant="outline"
          size="sm"
          onClick={addRule}
        >
          <PlusCircle size={16} className="mr-1" /> Add Custom Rule
        </ActionButton>
      </div>

      {rules.length === 0 ? (
        <EmptyRulesState
          message="No custom rules defined"
          description="Add custom rules to handle specific business requirements"
          buttonText="Add Custom Rule"
          onAction={addRule}
        />
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <CustomRuleCard
              key={index}
              rule={rule}
              currencySymbol={currencySymbol}
              customFields={customFields}
              onUpdate={(field, value) => updateRule(index, field, value)}
              onDelete={() => removeRule(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRules;
