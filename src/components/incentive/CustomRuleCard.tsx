
import React from 'react';
import { Trash2, Check, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from '../ui-custom/GlassCard';
import { CustomRule, RuleCondition } from '@/types/incentiveTypes';
import RuleConditionComponent from './RuleCondition';

interface CustomRuleCardProps {
  rule: CustomRule;
  ruleIndex: number;
  currencySymbol: string;
  availableFields?: string[];
  onUpdateRule: (field: keyof CustomRule, value: string | boolean) => void;
  onUpdateCondition: (conditionIndex: number, field: keyof RuleCondition, value: string | number) => void;
  onAddCondition: () => void;
  onRemoveCondition: (conditionIndex: number) => void;
  onRemoveRule: () => void;
}

const CustomRuleCard: React.FC<CustomRuleCardProps> = ({
  rule,
  ruleIndex,
  currencySymbol,
  availableFields = [],
  onUpdateRule,
  onUpdateCondition,
  onAddCondition,
  onRemoveCondition,
  onRemoveRule
}) => {
  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <div className={`h-3 w-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-app-gray-300'} mr-2`}></div>
            <Input 
              type="text" 
              value={rule.name}
              className="text-lg font-medium border-none px-0 h-auto focus-visible:ring-0"
              onChange={(e) => onUpdateRule('name', e.target.value)}
            />
          </div>
          <Textarea 
            value={rule.description}
            className="mt-1 resize-none border-none p-0 focus-visible:ring-0 text-app-gray-500"
            onChange={(e) => onUpdateRule('description', e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className={`p-1 rounded-full ${rule.active ? 'bg-green-100 text-green-600' : 'bg-app-gray-100 text-app-gray-500'} hover:bg-opacity-80 transition-colors duration-200`}
            onClick={() => onUpdateRule('active', !rule.active)}
          >
            <Check size={18} />
          </button>
          <button 
            className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200"
            onClick={onRemoveRule}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-medium text-app-gray-700">Conditions</h4>
          <button 
            className="text-sm text-app-blue hover:text-app-blue-dark flex items-center"
            onClick={onAddCondition}
          >
            <Plus size={14} className="mr-1" /> Add Condition
          </button>
        </div>
        
        <div className="space-y-4">
          {rule.conditions.map((condition, condIndex) => (
            <RuleConditionComponent
              key={condIndex}
              condition={condition}
              currencySymbol={currencySymbol}
              availableFields={availableFields}
              onUpdate={(field, value) => onUpdateCondition(condIndex, field, value)}
              onRemove={() => onRemoveCondition(condIndex)}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-app-gray-700 mb-3">Rule Action</h4>
        <Select 
          value={rule.action || 'qualify'}
          onValueChange={(value) => onUpdateRule('action', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qualify">Qualify for Commission</SelectItem>
            <SelectItem value="disqualify">Disqualify from Commission</SelectItem>
            <SelectItem value="boost">Apply Bonus Multiplier</SelectItem>
            <SelectItem value="cap">Apply Commission Cap</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </GlassCard>
  );
};

export default CustomRuleCard;
