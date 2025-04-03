import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CustomRule, RuleCondition } from '@/types/incentiveTypes';

export const useCustomRules = (
  initialRules: CustomRule[],
  onUpdateRules: (rules: CustomRule[]) => void
) => {
  const { toast } = useToast();
  const [rules, setRules] = useState<CustomRule[]>(initialRules);

  // Helper function to get available fields (was missing)
  const getAvailableFields = () => {
    // Return a default list of fields if no specific ones are provided
    return ['sales', 'quantity', 'margin', 'revenue'];
  };

  // Custom rules management
  const addCustomRule = () => {
    const newRules = [...rules];
    
    newRules.push({
      name: 'New Custom Rule',
      description: 'Define criteria for this rule',
      condition: {
        field: 'sales',
        operator: '>=',
        value: 1000
      },
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
    
    // This function is no longer needed as we have a single condition
    // but we'll keep it to avoid breaking existing code
    toast({
      title: "Operation Not Supported",
      description: "Multiple conditions per rule are no longer supported.",
      variant: "destructive"
    });
  };

  const removeCustomRuleCondition = (ruleIndex: number, conditionIndex: number) => {
    // This function is no longer needed as we have a single condition
    toast({
      title: "Cannot Remove Condition",
      description: "A rule must have at least one condition.",
      variant: "destructive"
    });
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
    if (field === 'field' || field === 'operator') {
      (newRules[ruleIndex].condition[field] as string) = value as string;
    } else if (field === 'value') {
      (newRules[ruleIndex].condition[field]) = value;
    }
    
    setRules(newRules);
    onUpdateRules(newRules);
  };

  return {
    rules,
    getAvailableFields,
    addCustomRule,
    removeCustomRule,
    addCustomRuleCondition,
    removeCustomRuleCondition,
    updateCustomRule,
    updateCustomRuleCondition
  };
};
