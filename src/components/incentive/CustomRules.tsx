
import React from 'react';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import { CustomRule } from '@/types/incentiveTypes';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { useCustomRules } from './useCustomRules';
import CustomRuleCard from './CustomRuleCard';
import EmptyRulesState from './EmptyRulesState';

interface CustomRulesProps {
  customRules: CustomRule[];
  currency: string;
  updateCustomRules: (rules: CustomRule[]) => void;
}

const CustomRules: React.FC<CustomRulesProps> = ({ 
  customRules, 
  currency,
  updateCustomRules 
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

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ActionButton 
          variant="outline"
          size="sm"
          onClick={addCustomRule}
        >
          <PlusCircle size={16} className="mr-1" /> Add Rule
        </ActionButton>
      </div>
      
      {rules.length === 0 ? (
        <EmptyRulesState onAddRule={addCustomRule} />
      ) : (
        <div className="space-y-8">
          {rules.map((rule, ruleIndex) => (
            <CustomRuleCard
              key={ruleIndex}
              rule={rule}
              ruleIndex={ruleIndex}
              currencySymbol={currencySymbol}
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
