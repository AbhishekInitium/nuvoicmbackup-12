import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, PlayCircle, Plus, X, Check, Percent, DollarSign, Calendar, Clock, User } from 'lucide-react';
import SectionPanel from './ui-custom/SectionPanel';
import GlassCard from './ui-custom/GlassCard';
import ActionButton from './ui-custom/ActionButton';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const IncentivePlanDesigner: React.FC = () => {
  const { toast } = useToast();
  
  const [plan, setPlan] = useState({
    name: 'North America Sales Incentive Plan',
    description: 'Commission plan for North America sales team',
    effectiveStart: '2025-01-01',
    effectiveEnd: '2025-12-31',
    territories: ['USA', 'Canada', 'Mexico'],
    commissionStructure: {
      baseRate: 3,
      tiers: [
        { threshold: 100000, rate: 4 }
      ]
    },
    measurementRules: {
      primaryMetric: 'revenue',
      minQualification: 50000,
      adjustments: [
        { condition: 'discount > 20%', factor: 0.8, description: 'High discount adjustment' }
      ],
      exclusions: [
        { condition: 'overdue > 60 days', description: 'Exclude overdue payments' }
      ]
    },
    creditRules: {
      roles: [
        { role: 'Primary', percentage: 80 },
        { role: 'Support', percentage: 20 }
      ]
    },
    bonusConditions: [
      { 
        metric: 'Quarterly Revenue', 
        threshold: 150000, 
        amount: 5000, 
        frequency: 'Quarterly',
        description: 'Performance bonus for high achievers'
      }
    ],
    payoutSchedule: {
      frequency: 'Monthly',
      processingDay: 5
    }
  });

  const updatePlan = (section, value) => {
    setPlan({
      ...plan,
      [section]: value
    });
  };

  const addTier = () => {
    const newTiers = [...plan.commissionStructure.tiers];
    const lastTier = newTiers[newTiers.length - 1];
    const newThreshold = lastTier ? lastTier.threshold + 50000 : 50000;
    
    newTiers.push({
      threshold: newThreshold,
      rate: lastTier ? lastTier.rate + 1 : 4
    });
    
    updatePlan('commissionStructure', {
      ...plan.commissionStructure,
      tiers: newTiers
    });
  };

  const removeTier = (index) => {
    const newTiers = [...plan.commissionStructure.tiers];
    newTiers.splice(index, 1);
    
    updatePlan('commissionStructure', {
      ...plan.commissionStructure,
      tiers: newTiers
    });
  };

  const addBonus = () => {
    const newBonuses = [...plan.bonusConditions];
    newBonuses.push({
      metric: 'Revenue',
      threshold: 100000,
      amount: 1000,
      frequency: 'Quarterly',
      description: 'New bonus condition'
    });
    
    updatePlan('bonusConditions', newBonuses);
  };

  const removeBonus = (index) => {
    const newBonuses = [...plan.bonusConditions];
    newBonuses.splice(index, 1);
    
    updatePlan('bonusConditions', newBonuses);
  };

  const addAdjustment = () => {
    const newAdjustments = [...plan.measurementRules.adjustments];
    newAdjustments.push({
      condition: '',
      factor: 1.0,
      description: 'New adjustment rule'
    });
    
    updatePlan('measurementRules', {
      ...plan.measurementRules,
      adjustments: newAdjustments
    });
  };

  const removeAdjustment = (index) => {
    const newAdjustments = [...plan.measurementRules.adjustments];
    newAdjustments.splice(index, 1);
    
    updatePlan('measurementRules', {
      ...plan.measurementRules,
      adjustments: newAdjustments
    });
  };

  const addExclusion = () => {
    const newExclusions = [...plan.measurementRules.exclusions];
    newExclusions.push({
      condition: '',
      description: 'New exclusion rule'
    });
    
    updatePlan('measurementRules', {
      ...plan.measurementRules,
      exclusions: newExclusions
    });
  };

  const removeExclusion = (index) => {
    const newExclusions = [...plan.measurementRules.exclusions];
    newExclusions.splice(index, 1);
    
    updatePlan('measurementRules', {
      ...plan.measurementRules,
      exclusions: newExclusions
    });
  };

  const addCreditRole = () => {
    const newRoles = [...plan.creditRules.roles];
    const totalCurrentPercentage = newRoles.reduce((sum, role) => sum + role.percentage, 0);
    
    if (totalCurrentPercentage < 100) {
      const remainingPercentage = 100 - totalCurrentPercentage;
      newRoles.push({
        role: 'New Role',
        percentage: remainingPercentage
      });
      
      updatePlan('creditRules', {
        ...plan.creditRules,
        roles: newRoles
      });
    } else {
      toast({
        title: "Cannot add more roles",
        description: "Total percentage cannot exceed 100%",
        variant: "destructive"
      });
    }
  };

  const removeCreditRole = (index) => {
    const newRoles = [...plan.creditRules.roles];
    newRoles.splice(index, 1);
    
    updatePlan('creditRules', {
      ...plan.creditRules,
      roles: newRoles
    });
  };

  const savePlan = () => {
    console.log('Saving plan:', plan);
    toast({
      title: "Success",
      description: "Plan saved successfully!",
      variant: "default"
    });
  };

  const simulatePlan = () => {
    console.log('Simulating plan:', plan);
    toast({
      title: "Redirecting",
      description: "Opening simulation module...",
      variant: "default"
    });
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="py-12 sm:py-16 px-4 md:px-8 min-h-screen">
      <header className="mb-12 text-center">
        <div className="inline-block mb-2 chip-label">Design</div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-app-gray-900 tracking-tight mb-3">
          Incentive Plan Designer
        </h1>
        <p className="text-app-gray-500 max-w-2xl mx-auto">
          Create and customize your sales incentive structure with precision and clarity
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <SectionPanel title="Basic Information" defaultExpanded={true}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Plan Name</label>
              <input 
                type="text" 
                className="form-input"
                value={plan.name}
                onChange={(e) => updatePlan('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
              <textarea 
                className="form-input min-h-[80px]"
                value={plan.description}
                onChange={(e) => updatePlan('description', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Effective Start Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={plan.effectiveStart}
                  onChange={(e) => updatePlan('effectiveStart', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Effective End Date</label>
                <input 
                  type="date" 
                  className="form-input"
                  value={plan.effectiveEnd}
                  onChange={(e) => updatePlan('effectiveEnd', e.target.value)}
                />
              </div>
            </div>
          </div>
        </SectionPanel>
        
        <SectionPanel 
          title="Territories" 
          badge={
            <div className="chip chip-blue">{plan.territories.length}</div>
          }
        >
          <div>
            <label className="block text-sm font-medium text-app-gray-700 mb-3">Assigned Territories</label>
            <div className="flex flex-wrap gap-2 mb-4">
              {plan.territories.map((territory, index) => (
                <div 
                  key={index} 
                  className="chip chip-blue group hover:pr-2 transition-all duration-200"
                >
                  {territory}
                  <button 
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newTerritories = [...plan.territories];
                      newTerritories.splice(index, 1);
                      updatePlan('territories', newTerritories);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center">
              <input 
                type="text" 
                placeholder="Add new territory..." 
                className="form-input" 
                id="new-territory"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    const territory = input.value.trim();
                    if (territory) {
                      updatePlan('territories', [...plan.territories, territory]);
                      input.value = '';
                    }
                  }
                }}
              />
              <button 
                className="ml-3 flex items-center justify-center h-12 w-12 rounded-full bg-app-blue text-white shadow-sm hover:bg-app-blue-dark transition-colors duration-200"
                onClick={() => {
                  const input = document.getElementById('new-territory') as HTMLInputElement;
                  const territory = input.value.trim();
                  if (territory) {
                    updatePlan('territories', [...plan.territories, territory]);
                    input.value = '';
                  }
                }}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </SectionPanel>
        
        <SectionPanel title="Commission Structure">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Base Commission Rate (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1"
                  className="form-input pl-10"
                  value={plan.commissionStructure.baseRate}
                  onChange={(e) => updatePlan('commissionStructure', {
                    ...plan.commissionStructure,
                    baseRate: parseFloat(e.target.value)
                  })}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Percent size={18} className="text-app-gray-400" />
                </div>
              </div>
              <p className="text-sm text-app-gray-500 mt-2">Base commission rate for every $10,000 in sales revenue</p>
            </div>
            
            <div className="section-divider"></div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-medium text-app-gray-700">Tiered Commission Structure</label>
                <ActionButton 
                  variant="outline"
                  size="sm"
                  onClick={addTier}
                >
                  <PlusCircle size={16} className="mr-1" /> Add Tier
                </ActionButton>
              </div>
              
              <div className="overflow-hidden rounded-xl border border-app-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-app-gray-200">
                    <thead>
                      <tr className="bg-app-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Threshold ($)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Commission Rate (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-app-gray-200">
                      <tr className="bg-app-gray-50 bg-opacity-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <DollarSign size={16} className="text-app-gray-400 mr-1" />
                            <span>0</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Percent size={16} className="text-app-gray-400 mr-1" />
                            <span>{plan.commissionStructure.baseRate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-app-gray-500">Base Rate</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">-</td>
                      </tr>
                      {plan.commissionStructure.tiers.map((tier, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50 bg-opacity-30'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <input 
                                type="number" 
                                className="form-input pl-8 py-2"
                                value={tier.threshold}
                                onChange={(e) => {
                                  const newTiers = [...plan.commissionStructure.tiers];
                                  newTiers[index].threshold = parseInt(e.target.value);
                                  updatePlan('commissionStructure', {
                                    ...plan.commissionStructure,
                                    tiers: newTiers
                                  });
                                }}
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <DollarSign size={16} className="text-app-gray-400" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <input 
                                type="number" 
                                step="0.1"
                                className="form-input pl-8 py-2"
                                value={tier.rate}
                                onChange={(e) => {
                                  const newTiers = [...plan.commissionStructure.tiers];
                                  newTiers[index].rate = parseFloat(e.target.value);
                                  updatePlan('commissionStructure', {
                                    ...plan.commissionStructure,
                                    tiers: newTiers
                                  });
                                }}
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Percent size={16} className="text-app-gray-400" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-app-gray-500">
                            Tier {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button 
                              className="text-app-red hover:text-opacity-80 transition-colors duration-200"
                              onClick={() => removeTier(index)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-app-gray-500 mt-3">
                Sales exceeding each threshold will be commissioned at the corresponding rate
              </p>
            </div>
          </div>
        </SectionPanel>
        
        <SectionPanel title="Measurement Rules">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Primary Metric</label>
                <select 
                  className="form-input w-full"
                  value={plan.measurementRules.primaryMetric}
                  onChange={(e) => updatePlan('measurementRules', {
                    ...plan.measurementRules,
                    primaryMetric: e.target.value
                  })}
                >
                  <option value="revenue">Revenue</option>
                  <option value="units">Units Sold</option>
                  <option value="profit">Profit Margin</option>
                  <option value="bookings">Bookings</option>
                </select>
                <p className="text-sm text-app-gray-500 mt-2">The primary performance metric used for commission calculation</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Minimum Qualification ($)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="form-input pl-8"
                    value={plan.measurementRules.minQualification}
                    onChange={(e) => updatePlan('measurementRules', {
                      ...plan.measurementRules,
                      minQualification: parseInt(e.target.value)
                    })}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign size={16} className="text-app-gray-400" />
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
                
                {plan.measurementRules.adjustments.length === 0 ? (
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
                    {plan.measurementRules.adjustments.map((adjustment, index) => (
                      <GlassCard key={index} variant="outlined" className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-5">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Condition</label>
                              <input 
                                type="text" 
                                className="form-input w-full"
                                value={adjustment.condition}
                                onChange={(e) => {
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].condition = e.target.value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
                                    adjustments: newAdjustments
                                  });
                                }}
                                placeholder="e.g., discount > 20%"
                              />
                            </div>
                            
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Factor</label>
                              <input 
                                type="number" 
                                step="0.1"
                                className="form-input w-full"
                                value={adjustment.factor}
                                onChange={(e) => {
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].factor = parseFloat(e.target.value);
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
                                    adjustments: newAdjustments
                                  });
                                }}
                              />
                            </div>
                            
                            <div className="sm:col-span-4">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                              <input 
                                type="text" 
                                className="form-input w-full"
                                value={adjustment.description}
                                onChange={(e) => {
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].description = e.target.value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
                  <h3 className="text-base font-medium text-app-gray-700">Exclusion Rules</h3>
                  <ActionButton 
                    variant="outline"
                    size="sm"
                    onClick={addExclusion}
                  >
                    <PlusCircle size={16} className="mr-1" /> Add Exclusion
                  </ActionButton>
                </div>
                
                {plan.measurementRules.exclusions.length === 0 ? (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <p className="text-app-gray-500">No exclusion rules defined yet</p>
                    <button
                      className="mt-4 text-app-blue hover:text-app-blue-dark font-medium flex items-center justify-center mx-auto"
                      onClick={addExclusion}
                    >
                      <Plus size={18} className="mr-1" /> Add your first exclusion rule
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {plan.measurementRules.exclusions.map((exclusion, index) => (
                      <GlassCard key={index} variant="outlined" className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Condition</label>
                              <input 
                                type="text" 
                                className="form-input w-full"
                                value={exclusion.condition}
                                onChange={(e) => {
                                  const newExclusions = [...plan.measurementRules.exclusions];
                                  newExclusions[index].condition = e.target.value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
                                    exclusions: newExclusions
                                  });
                                }}
                                placeholder="e.g., overdue > 60 days"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                              <input 
                                type="text" 
                                className="form-input w-full"
                                value={exclusion.description}
                                onChange={(e) => {
                                  const newExclusions = [...plan.measurementRules.exclusions];
                                  newExclusions[index].description = e.target.value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
        </SectionPanel>
        
        <SectionPanel 
          title="Credit Rules" 
          badge={
            <div className="chip chip-blue">{plan.creditRules.roles.length}</div>
          }
        >
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-medium text-app-gray-700">Sales Credit Allocation</h3>
              <ActionButton 
                variant="outline"
                size="sm"
                onClick={addCreditRole}
              >
                <PlusCircle size={16} className="mr-1" /> Add Role
              </ActionButton>
            </div>
            
            <p className="text-sm text-app-gray-500">Define how credit is split between sales roles</p>
            
            <div className="overflow-hidden rounded-xl border border-app-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-app-gray-200">
                  <thead>
                    <tr className="bg-app-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Credit Percentage (%)</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-app-gray-200">
                    {plan.creditRules.roles.map((role, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50 bg-opacity-30'}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <input 
                              type="text" 
                              className="form-input pl-8 py-2"
                              value={role.role}
                              onChange={(e) => {
                                const newRoles = [...plan.creditRules.roles];
                                newRoles[index].role = e.target.value;
                                updatePlan('creditRules', {
                                  ...plan.creditRules,
                                  roles: newRoles
                                });
                              }}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <User size={16} className="text-app-gray-400" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="relative">
                            <input 
                              type="number" 
                              min="0"
                              max="100"
                              className="form-input pl-8 py-2"
                              value={role.percentage}
                              onChange={(e) => {
                                const newRoles = [...plan.creditRules.roles];
                                newRoles[index].percentage = parseInt(e.target.value);
                                updatePlan('creditRules', {
                                  ...plan.creditRules,
                                  roles: newRoles
                                });
                              }}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                              <Percent size={16} className="text-app-gray-400" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button 
                            className="text-app-red hover:text-opacity-80 transition-colors duration-200 disabled:opacity-50"
                            onClick={() => removeCreditRole(index)}
                            disabled={plan.creditRules.roles.length <= 1}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-app-gray-50 rounded-lg">
              <div className="text-sm font-medium text-app-gray-700">Total percentage:</div>
              <div className="text-sm font-medium">
                {plan.creditRules.roles.reduce((sum, role) => sum + role.percentage, 0)}%
                {plan.creditRules.roles.reduce((sum, role) => sum + role.percentage, 0) === 100 ? (
                  <Check size={16} className="inline-block ml-2 text-app-green" />
                ) : (
                  <X size={16} className="inline-block ml-2 text-app-red" />
                )}
              </div>
            </div>
            
            <p className="text-sm text-app-gray-500">
              Total credit allocation should equal 100%
            </p>
          </div>
        </SectionPanel>
        
        <SectionPanel title="Payout Schedule">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Payment Frequency</label>
                <select 
                  className="form-input"
                  value={plan.payoutSchedule.frequency}
                  onChange={(e) => updatePlan('payoutSchedule', {
                    ...plan.payoutSchedule,
                    frequency: e.target.value
                  })}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Annual">Annual</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Processing Day</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1" 
                    max="31"
                    className="form-input pl-
