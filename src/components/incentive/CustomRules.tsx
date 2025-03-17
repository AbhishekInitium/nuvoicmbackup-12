
import React from 'react';
import { PlusCircle, Trash2, Check, X, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ActionButton from '../ui-custom/ActionButton';
import GlassCard from '../ui-custom/GlassCard';
import { OPERATORS, METRICS, TIME_PERIODS } from '@/constants/incentiveConstants';
import { CustomRule } from '@/types/incentiveTypes';
import { useToast } from "@/hooks/use-toast";
import { getCurrencySymbol } from '@/utils/incentiveUtils';

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
  const { toast } = useToast();
  const currencySymbol = getCurrencySymbol(currency);

  // Custom rules management
  const addCustomRule = () => {
    const newRules = [...customRules];
    
    newRules.push({
      name: 'New Custom Rule',
      description: 'Define criteria for this rule',
      conditions: [
        { period: 'current', metric: 'sales', operator: '>=', value: 1000 }
      ],
      action: 'qualify',
      active: true
    });
    
    updateCustomRules(newRules);
  };

  const removeCustomRule = (index: number) => {
    const newRules = [...customRules];
    newRules.splice(index, 1);
    
    updateCustomRules(newRules);
  };

  const addCustomRuleCondition = (ruleIndex: number) => {
    const newRules = [...customRules];
    
    newRules[ruleIndex].conditions.push({
      period: 'current',
      metric: 'sales',
      operator: '>=',
      value: 1000
    });
    
    updateCustomRules(newRules);
  };

  const removeCustomRuleCondition = (ruleIndex: number, conditionIndex: number) => {
    // Don't allow removing all conditions
    if (customRules[ruleIndex].conditions.length <= 1) {
      toast({
        title: "Cannot Remove Condition",
        description: "A rule must have at least one condition.",
        variant: "destructive"
      });
      return;
    }
    
    const newRules = [...customRules];
    newRules[ruleIndex].conditions.splice(conditionIndex, 1);
    
    updateCustomRules(newRules);
  };

  const updateCustomRule = (ruleIndex: number, field: keyof CustomRule, value: any) => {
    const newRules = [...customRules];
    newRules[ruleIndex][field] = value;
    
    updateCustomRules(newRules);
  };

  const updateCustomRuleCondition = (ruleIndex: number, conditionIndex: number, field: keyof CustomRule['conditions'][0], value: any) => {
    const newRules = [...customRules];
    newRules[ruleIndex].conditions[conditionIndex][field] = value;
    
    updateCustomRules(newRules);
  };

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
      
      {customRules.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-app-gray-500">No custom rules defined yet</p>
          <button
            className="mt-4 text-app-blue hover:text-app-blue-dark font-medium flex items-center justify-center mx-auto"
            onClick={addCustomRule}
          >
            <Plus size={18} className="mr-1" /> Add your first custom rule
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {customRules.map((rule, ruleIndex) => (
            <GlassCard key={ruleIndex} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className={`h-3 w-3 rounded-full ${rule.active ? 'bg-green-500' : 'bg-app-gray-300'} mr-2`}></div>
                    <Input 
                      type="text" 
                      value={rule.name}
                      className="text-lg font-medium border-none px-0 h-auto focus-visible:ring-0"
                      onChange={(e) => updateCustomRule(ruleIndex, 'name', e.target.value)}
                    />
                  </div>
                  <Textarea 
                    value={rule.description}
                    className="mt-1 resize-none border-none p-0 focus-visible:ring-0 text-app-gray-500"
                    onChange={(e) => updateCustomRule(ruleIndex, 'description', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    className={`p-1 rounded-full ${rule.active ? 'bg-green-100 text-green-600' : 'bg-app-gray-100 text-app-gray-500'} hover:bg-opacity-80 transition-colors duration-200`}
                    onClick={() => updateCustomRule(ruleIndex, 'active', !rule.active)}
                  >
                    <Check size={18} />
                  </button>
                  <button 
                    className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200"
                    onClick={() => removeCustomRule(ruleIndex)}
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
                    onClick={() => addCustomRuleCondition(ruleIndex)}
                  >
                    <Plus size={14} className="mr-1" /> Add Condition
                  </button>
                </div>
                
                <div className="space-y-4">
                  {rule.conditions.map((condition, condIndex) => (
                    <div 
                      key={condIndex} 
                      className="p-3 border border-app-gray-200 rounded-lg bg-app-gray-50 bg-opacity-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                          <div className="sm:col-span-3">
                            <Select 
                              value={condition.period}
                              onValueChange={(value) => updateCustomRuleCondition(ruleIndex, condIndex, 'period', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select period" />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_PERIODS.map(period => (
                                  <SelectItem key={period.value} value={period.value}>{period.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-3">
                            <Select 
                              value={condition.metric}
                              onValueChange={(value) => updateCustomRuleCondition(ruleIndex, condIndex, 'metric', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select metric" />
                              </SelectTrigger>
                              <SelectContent>
                                {METRICS.map(metric => (
                                  <SelectItem key={metric.value} value={metric.value}>{metric.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <Select 
                              value={condition.operator}
                              onValueChange={(value) => updateCustomRuleCondition(ruleIndex, condIndex, 'operator', value)}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATORS.map(op => (
                                  <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="sm:col-span-2">
                            <div className="relative">
                              <input 
                                type="number" 
                                className="form-input pl-8 w-full"
                                value={condition.value}
                                onChange={(e) => updateCustomRuleCondition(ruleIndex, condIndex, 'value', parseFloat(e.target.value))}
                                step="0.01"
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <span className="text-app-gray-400">{currencySymbol}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="sm:col-span-1 flex justify-end">
                            <button 
                              className="p-1 rounded-full hover:bg-app-gray-200 text-app-gray-500 hover:text-app-red transition-colors duration-200"
                              onClick={() => removeCustomRuleCondition(ruleIndex, condIndex)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-app-gray-700 mb-3">Rule Action</h4>
                <Select 
                  value={rule.action || 'qualify'}
                  onValueChange={(value) => updateCustomRule(ruleIndex, 'action', value)}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomRules;
