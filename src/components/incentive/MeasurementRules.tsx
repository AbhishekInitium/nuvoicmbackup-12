
import React from 'react';
import { PlusCircle, Trash2, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActionButton from '../ui-custom/ActionButton';
import GlassCard from '../ui-custom/GlassCard';
import { DB_FIELDS, OPERATORS } from '@/constants/incentiveConstants';
import { MeasurementRules as MeasurementRulesType } from '@/types/incentiveTypes';
import { getCurrencySymbol, formatCurrency } from '@/utils/incentiveUtils';

interface MeasurementRulesProps {
  measurementRules: MeasurementRulesType;
  revenueBase: string;
  currency: string;
  updateMeasurementRules: (updatedRules: MeasurementRulesType) => void;
}

const MeasurementRules: React.FC<MeasurementRulesProps> = ({
  measurementRules,
  revenueBase,
  currency,
  updateMeasurementRules
}) => {
  const currencySymbol = getCurrencySymbol(currency);

  // Helper functions
  const getDbFields = () => {
    return DB_FIELDS[revenueBase] || [];
  };

  const getQualificationLabel = () => {
    return measurementRules.primaryMetric === 'revenue' 
      ? `Minimum Qualification (${currencySymbol})` 
      : 'Minimum Qualification (Units)';
  };

  // Adjustment handlers
  const addAdjustment = () => {
    const newAdjustments = [...measurementRules.adjustments];
    const defaultField = DB_FIELDS[revenueBase][0];
    
    newAdjustments.push({
      field: defaultField,
      operator: '>',
      value: 0,
      factor: 1.0,
      description: 'New adjustment rule'
    });
    
    updateMeasurementRules({
      ...measurementRules,
      adjustments: newAdjustments
    });
  };

  const removeAdjustment = (index: number) => {
    const newAdjustments = [...measurementRules.adjustments];
    newAdjustments.splice(index, 1);
    
    updateMeasurementRules({
      ...measurementRules,
      adjustments: newAdjustments
    });
  };

  // Exclusion handlers
  const addExclusion = () => {
    const newExclusions = [...measurementRules.exclusions];
    const defaultField = DB_FIELDS[revenueBase][0];
    
    newExclusions.push({
      field: defaultField,
      operator: '>',
      value: 0,
      description: 'New exclusion rule'
    });
    
    updateMeasurementRules({
      ...measurementRules,
      exclusions: newExclusions
    });
  };

  const removeExclusion = (index: number) => {
    const newExclusions = [...measurementRules.exclusions];
    newExclusions.splice(index, 1);
    
    updateMeasurementRules({
      ...measurementRules,
      exclusions: newExclusions
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Primary Metric</label>
          <Select 
            value={measurementRules.primaryMetric}
            onValueChange={(value) => updateMeasurementRules({
              ...measurementRules,
              primaryMetric: value
            })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select primary metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="units">Units Sold</SelectItem>
              <SelectItem value="profit">Profit Margin</SelectItem>
              <SelectItem value="bookings">Bookings</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-app-gray-500 mt-2">The primary performance metric used for commission calculation</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">{getQualificationLabel()}</label>
          <div className="relative">
            <input 
              type="number" 
              className="form-input pl-8"
              value={formatCurrency(measurementRules.minQualification)}
              onChange={(e) => updateMeasurementRules({
                ...measurementRules,
                minQualification: parseFloat(e.target.value)
              })}
              step="0.01"
              min="0"
              max="9999999999999.99"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              {measurementRules.primaryMetric === 'revenue' ? (
                <span className="text-app-gray-400">{currencySymbol}</span>
              ) : (
                <span className="text-app-gray-400 text-sm">#</span>
              )}
            </div>
          </div>
          <p className="text-sm text-app-gray-500 mt-2">Minimum performance required to qualify for commission</p>
        </div>
      </div>
      
      <div className="section-divider"></div>
      
      <Tabs defaultValue="adjustments" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="adjustments">Adjustment Factors</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="adjustments" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-app-gray-700">Adjustment Factors</h3>
            <ActionButton 
              variant="outline"
              size="sm"
              onClick={addAdjustment}
            >
              <PlusCircle size={16} className="mr-1" /> Add Adjustment
            </ActionButton>
          </div>
          
          {measurementRules.adjustments.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-app-gray-500">No adjustment factors defined yet</p>
              <button
                className="mt-4 text-app-blue hover:text-app-blue-dark font-medium flex items-center justify-center mx-auto"
                onClick={addAdjustment}
              >
                <Plus size={18} className="mr-1" /> Add your first adjustment factor
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {measurementRules.adjustments.map((adjustment, index) => (
                <GlassCard key={index} variant="outlined" className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
                        <Select 
                          value={adjustment.field}
                          onValueChange={(value) => {
                            const newAdjustments = [...measurementRules.adjustments];
                            newAdjustments[index].field = value;
                            updateMeasurementRules({
                              ...measurementRules,
                              adjustments: newAdjustments
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {getDbFields().map(field => (
                              <SelectItem key={field} value={field}>{field}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
                        <Select 
                          value={adjustment.operator}
                          onValueChange={(value) => {
                            const newAdjustments = [...measurementRules.adjustments];
                            newAdjustments[index].operator = value;
                            updateMeasurementRules({
                              ...measurementRules,
                              adjustments: newAdjustments
                            });
                          }}
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
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
                        <Input 
                          type="number" 
                          value={adjustment.value}
                          onChange={(e) => {
                            const newAdjustments = [...measurementRules.adjustments];
                            newAdjustments[index].value = parseFloat(e.target.value);
                            updateMeasurementRules({
                              ...measurementRules,
                              adjustments: newAdjustments
                            });
                          }}
                          step="0.01"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Factor</label>
                        <Input 
                          type="number" 
                          step="0.01"
                          value={adjustment.factor}
                          onChange={(e) => {
                            const newAdjustments = [...measurementRules.adjustments];
                            newAdjustments[index].factor = parseFloat(e.target.value);
                            updateMeasurementRules({
                              ...measurementRules,
                              adjustments: newAdjustments
                            });
                          }}
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                        <Input 
                          type="text" 
                          value={adjustment.description}
                          onChange={(e) => {
                            const newAdjustments = [...measurementRules.adjustments];
                            newAdjustments[index].description = e.target.value;
                            updateMeasurementRules({
                              ...measurementRules,
                              adjustments: newAdjustments
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
                      onClick={() => removeAdjustment(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="exclusions" className="mt-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-medium text-app-gray-700">Exclusions</h3>
            <ActionButton 
              variant="outline"
              size="sm"
              onClick={addExclusion}
            >
              <PlusCircle size={16} className="mr-1" /> Add Exclusion
            </ActionButton>
          </div>
          
          {measurementRules.exclusions.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <p className="text-app-gray-500">No exclusions defined yet</p>
              <button
                className="mt-4 text-app-blue hover:text-app-blue-dark font-medium flex items-center justify-center mx-auto"
                onClick={addExclusion}
              >
                <Plus size={18} className="mr-1" /> Add your first exclusion
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {measurementRules.exclusions.map((exclusion, index) => (
                <GlassCard key={index} variant="outlined" className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                      <div className="sm:col-span-4">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
                        <Select 
                          value={exclusion.field}
                          onValueChange={(value) => {
                            const newExclusions = [...measurementRules.exclusions];
                            newExclusions[index].field = value;
                            updateMeasurementRules({
                              ...measurementRules,
                              exclusions: newExclusions
                            });
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            {getDbFields().map(field => (
                              <SelectItem key={field} value={field}>{field}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
                        <Select 
                          value={exclusion.operator}
                          onValueChange={(value) => {
                            const newExclusions = [...measurementRules.exclusions];
                            newExclusions[index].operator = value;
                            updateMeasurementRules({
                              ...measurementRules,
                              exclusions: newExclusions
                            });
                          }}
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
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Value</label>
                        <Input 
                          type="number" 
                          value={exclusion.value}
                          onChange={(e) => {
                            const newExclusions = [...measurementRules.exclusions];
                            newExclusions[index].value = parseFloat(e.target.value);
                            updateMeasurementRules({
                              ...measurementRules,
                              exclusions: newExclusions
                            });
                          }}
                          step="0.01"
                        />
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                        <Input 
                          type="text" 
                          value={exclusion.description}
                          onChange={(e) => {
                            const newExclusions = [...measurementRules.exclusions];
                            newExclusions[index].description = e.target.value;
                            updateMeasurementRules({
                              ...measurementRules,
                              exclusions: newExclusions
                            });
                          }}
                        />
                      </div>
                    </div>
                    
                    <button 
                      className="p-1 rounded-full hover:bg-app-gray-100 text-app-gray-500 hover:text-app-red transition-colors duration-200 ml-3"
                      onClick={() => removeExclusion(index)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MeasurementRules;
