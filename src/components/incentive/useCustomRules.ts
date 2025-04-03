
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
        { operator: '>=', value: 1000, metric: 'sales', period: 'current' }
      ],
      action: 'qualify',
      active: true
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
      operator: '>=',
      value: 1000,
      metric: 'sales',
      period: 'current'
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

  const updateCustomRule = (ruleIndex: number, field: keyof CustomRule, value: string | boolean) => {
    const newRules = [...rules];
    
    // Type assertion to handle the specific field types
    if (field === 'name' || field === 'description' || field === 'action') {
      (newRules[ruleIndex][field] as string) = value as string;
    } else if (field === 'active') {
      (newRules[ruleIndex][field] as boolean) = value as boolean;
    }
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  const updateCustomRuleCondition = (ruleIndex: number, conditionIndex: number, field: keyof RuleCondition, value: string | number) => {
    const newRules = [...rules];
    
    // Handle all available fields in RuleCondition
    if (field === 'metric' || field === 'field' || field === 'operator' || field === 'period') {
      (newRules[ruleIndex].conditions[conditionIndex][field] as string) = value as string;
    } else if (field === 'value') {
      (newRules[ruleIndex].conditions[conditionIndex][field] as number) = value as number;
    }
    
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
