
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CustomRule, RuleCondition } from '@/types/incentiveTypes';

export const useCustomRules = (
  initialRules: CustomRule[],
  onUpdateRules: (rules: CustomRule[]) => void
) => {
  const { toast } = useToast();
  const [rules, setRules] = useState<CustomRule[]>(initialRules);

  // Custom rules management
  const addCustomRule = () => {
    const newRules = [...rules];
    
    newRules.push({
      name: 'New Custom Rule',
      description: 'Define criteria for this rule',
      conditions: [
        { field: 'sales', operator: '>=', value: 1000 }
      ],
      impactType: 'PERCENTAGE',
      impactValue: 10,
      active: true,
      action: 'qualify'
    });
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const removeCustomRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const addCustomRuleCondition = (ruleIndex: number) => {
    const newRules = [...rules];
    
    newRules[ruleIndex].conditions.push({
      field: 'sales',
      operator: '>=',
      value: 1000
    });
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const removeCustomRuleCondition = (ruleIndex: number, conditionIndex: number) => {
    // Don't allow removing all conditions
    if (rules[ruleIndex].conditions.length <= 1) {
      toast({
        title: "Cannot Remove Condition",
        description: "A rule must have at least one condition.",
        variant: "destructive"
      });
      return;
    }
    
    const newRules = [...rules];
    newRules[ruleIndex].conditions.splice(conditionIndex, 1);
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const updateCustomRule = (ruleIndex: number, field: keyof CustomRule, value: any) => {
    const newRules = [...rules];
    
    // We need to cast to avoid the type error
    (newRules[ruleIndex][field] as any) = value;
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const updateCustomRuleCondition = (ruleIndex: number, conditionIndex: number, field: keyof RuleCondition, value: any) => {
    const newRules = [...rules];
    
    // Set the value directly
    newRules[ruleIndex].conditions[conditionIndex][field] = value;
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  return {
    rules,
    addCustomRule,
    removeCustomRule,
    addCustomRuleCondition,
    removeCustomRuleCondition,
    updateCustomRule,
    updateCustomRuleCondition
  };
};
