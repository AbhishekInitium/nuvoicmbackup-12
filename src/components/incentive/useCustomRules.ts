
import { useState, useEffect } from 'react';
import { CustomRule, RuleCondition } from '@/types/incentiveTypes';

export const useCustomRules = (
  initialRules: CustomRule[] = [],
  onUpdateRules: (rules: CustomRule[]) => void
) => {
  const [rules, setRules] = useState<CustomRule[]>(initialRules);

  // Update rules when initialRules changes
  useEffect(() => {
    setRules(initialRules);
  }, [initialRules]);

  // Add a new custom rule
  const addCustomRule = () => {
    const newRule: CustomRule = {
      name: 'New Custom Rule',
      description: 'Description of custom rule',
      impactType: 'PERCENTAGE',
      impactValue: 0.1,
      conditions: [{
        field: 'default-field', // Use a safe default
        operator: '=',
        value: ''
      }]
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Update a custom rule field
  const updateCustomRule = (ruleIndex: number, field: keyof CustomRule, value: any) => {
    const updatedRules = [...rules];
    updatedRules[ruleIndex] = {
      ...updatedRules[ruleIndex],
      [field]: value
    };

    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Remove a custom rule
  const removeCustomRule = (ruleIndex: number) => {
    const updatedRules = [...rules];
    updatedRules.splice(ruleIndex, 1);

    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Add a condition to a custom rule
  const addCustomRuleCondition = (ruleIndex: number) => {
    const updatedRules = [...rules];
    
    // Ensure the rule has a conditions array
    if (!updatedRules[ruleIndex].conditions) {
      updatedRules[ruleIndex].conditions = [];
    }

    const newCondition: RuleCondition = {
      field: 'default-field', // Use a safe default
      operator: '>',
      value: 0
    };

    updatedRules[ruleIndex].conditions.push(newCondition);

    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Remove a condition from a custom rule
  const removeCustomRuleCondition = (ruleIndex: number, conditionIndex: number) => {
    const updatedRules = [...rules];
    
    // Ensure the rule has a conditions array
    if (!updatedRules[ruleIndex].conditions) {
      return;
    }

    updatedRules[ruleIndex].conditions.splice(conditionIndex, 1);

    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  // Update a condition in a custom rule
  const updateCustomRuleCondition = (
    ruleIndex: number, 
    conditionIndex: number, 
    field: keyof RuleCondition, 
    value: any
  ) => {
    const updatedRules = [...rules];
    
    // Ensure the rule has a conditions array
    if (!updatedRules[ruleIndex].conditions) {
      updatedRules[ruleIndex].conditions = [];
      return;
    }

    updatedRules[ruleIndex].conditions[conditionIndex] = {
      ...updatedRules[ruleIndex].conditions[conditionIndex],
      [field]: value
    };

    setRules(updatedRules);
    onUpdateRules(updatedRules);
  };

  return {
    rules,
    addCustomRule,
    updateCustomRule,
    removeCustomRule,
    addCustomRuleCondition,
    removeCustomRuleCondition,
    updateCustomRuleCondition
  };
};
