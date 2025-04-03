import React from 'react';
import GlassCard from '../ui-custom/GlassCard';
import { Trash2, PlusCircle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import RuleConditionComponent from './RuleCondition';
import { CustomRule, RuleCondition } from '@/types/incentiveTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RULE_IMPACTS } from '@/constants/ruleConstants';
import { KpiField } from '@/types/schemeAdminTypes';

interface CustomRuleCardProps {
  rule: CustomRule;
  ruleIndex: number;
  currencySymbol: string;
  availableFields: string[];
  kpiMetadata?: Record<string, KpiField>;
  onUpdateRule: (field: keyof CustomRule, value: any) => void;
  onUpdateCondition: (conditionIndex: number, field: keyof RuleCondition, value: any) => void;
  onAddCondition: () => void;
  onRemoveCondition: (conditionIndex: number) => void;
  onRemoveRule: () => void;
}

const CustomRuleCard: React.FC<CustomRuleCardProps> = ({
  rule,
  ruleIndex,
  currencySymbol,
  availableFields,
  kpiMetadata,
  onUpdateRule,
  onUpdateCondition,
  onAddCondition,
  onRemoveCondition,
  onRemoveRule
}) => {
  // Debug logs
  console.log("CustomRuleCard - Available fields:", availableFields);
  console.log("CustomRuleCard - KPI metadata:", kpiMetadata);

  return (
    <GlassCard variant="outlined" className="p-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Rule Name</label>
              <Input 
                type="text" 
                value={rule.name}
                onChange={(e) => onUpdateRule('name', e.target.value)}
                placeholder="Custom Rule Name" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Impact Type</label>
              <Select 
                value={rule.impactType}
                onValueChange={(value) => onUpdateRule('impactType', value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select impact type" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {RULE_IMPACTS.map(impact => (
                    <SelectItem key={impact.value} value={impact.value}>{impact.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">
                Impact Factor {rule.impactType === 'MONETARY' ? `(${currencySymbol})` : '(x)'}
              </label>
              <Input 
                type="number" 
                value={rule.impactValue}
                onChange={(e) => onUpdateRule('impactValue', parseFloat(e.target.value) || 0)}
                step="0.01" 
              />
              <p className="mt-1 text-xs text-app-gray-500">
                {rule.impactType === 'MONETARY' ? 
                  `Fixed amount added/subtracted from commission` :
                  `Multiplier applied to commission (e.g., 1.1 for +10%)`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
              <Input 
                type="text" 
                value={rule.description}
                onChange={(e) => onUpdateRule('description', e.target.value)}
                placeholder="Rule Description" 
              />
            </div>
          </div>
        </div>
        <button 
          className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
          onClick={onRemoveRule}
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-app-gray-700">Conditions</label>
          <button 
            className="text-xs flex items-center text-app-blue-600 hover:text-app-blue-800 transition-colors duration-200"
            onClick={onAddCondition}
          >
            <PlusCircle size={14} className="mr-1" /> Add Condition
          </button>
        </div>
        
        {rule.conditions && rule.conditions.length > 0 ? (
          <div className="space-y-3 mt-3">
            {rule.conditions.map((condition, index) => (
              <RuleConditionComponent 
                key={index}
                condition={condition}
                currencySymbol={currencySymbol}
                availableFields={availableFields} 
                kpiMetadata={kpiMetadata}
                onUpdate={(field, value) => onUpdateCondition(index, field, value)}
                onRemove={() => onRemoveCondition(index)}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-app-gray-500 italic mt-2">
            No conditions defined yet. Add at least one condition for this rule.
          </p>
        )}
      </div>
    </GlassCard>
  );
};

export default CustomRuleCard;
