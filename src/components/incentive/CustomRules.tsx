
import React from 'react';
import { CustomRule } from '@/types/incentiveTypes';
import { PlusCircle } from 'lucide-react';
import ActionButton from '../ui-custom/ActionButton';
import CustomRuleCard from './CustomRuleCard';
import EmptyRulesState from './EmptyRulesState';
import { getCurrencySymbol } from '@/utils/incentiveUtils';
import { useCustomRules } from './useCustomRules';
import { SchemeAdminConfig, KpiField } from '@/types/schemeAdminTypes';

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
    updateCustomRule, 
    removeCustomRule,
    addCustomRuleCondition,
    removeCustomRuleCondition,
    updateCustomRuleCondition
  } = useCustomRules(customRules, updateCustomRules);

  // Get custom fields from the selected scheme if available
  const getCustomFields = () => {
    if (!selectedScheme?.customRules?.length) return [];
    // Filter out empty kpi fields
    return selectedScheme.customRules
      .filter(rule => rule.kpi.trim() !== '')
      .map(rule => rule.kpi);
  };

  // Get custom fields metadata
  const getCustomMetadata = () => {
    if (!selectedScheme) return {};
    
    const metadata: Record<string, KpiField> = {};
    
    // Add custom rules KPIs
    if (selectedScheme.customRules?.length) {
      selectedScheme.customRules.forEach(rule => {
        if (rule.kpi.trim() !== '') {
          metadata[rule.kpi] = rule;
        }
      });
    }
    
    // Also include other KPIs for reference, in case they're used in conditions
    if (selectedScheme.qualificationFields?.length) {
      selectedScheme.qualificationFields.forEach(field => {
        if (field.kpi.trim() !== '' && !metadata[field.kpi]) {
          metadata[field.kpi] = field;
        }
      });
    }
    
    if (selectedScheme.adjustmentFields?.length) {
      selectedScheme.adjustmentFields.forEach(field => {
        if (field.kpi.trim() !== '' && !metadata[field.kpi]) {
          metadata[field.kpi] = field;
        }
      });
    }
    
    if (selectedScheme.exclusionFields?.length) {
      selectedScheme.exclusionFields.forEach(field => {
        if (field.kpi.trim() !== '' && !metadata[field.kpi]) {
          metadata[field.kpi] = field;
        }
      });
    }
    
    return metadata;
  };

  const customFields = getCustomFields();
  const customMetadata = getCustomMetadata();

  // Add console logs for debugging
  console.log("Selected scheme in CustomRules:", selectedScheme);
  console.log("Available custom fields:", customFields);
  console.log("Custom metadata:", customMetadata);

  // Ensure we have at least one field to avoid errors
  const availableFields = customFields.length > 0 ? 
    customFields : 
    Object.keys(customMetadata).length > 0 ? 
      Object.keys(customMetadata) : 
      ['default-field']; 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Rules</h3>
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
          description="Add custom rules to handle specific business requirements"
          buttonText="Add Custom Rule"
          onAction={addCustomRule}
        />
      ) : (
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <CustomRuleCard
              key={index}
              rule={rule}
              ruleIndex={index}
              currencySymbol={currencySymbol}
              availableFields={availableFields}
              kpiMetadata={customMetadata}
              onUpdateRule={(field, value) => updateCustomRule(index, field, value)}
              onUpdateCondition={(conditionIndex, field, value) => updateCustomRuleCondition(index, conditionIndex, field, value)}
              onAddCondition={() => addCustomRuleCondition(index)}
              onRemoveCondition={(conditionIndex) => removeCustomRuleCondition(index, conditionIndex)}
              onRemoveRule={() => removeCustomRule(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRules;
