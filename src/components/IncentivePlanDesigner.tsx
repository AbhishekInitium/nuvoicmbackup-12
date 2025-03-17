import React, { useState } from 'react';
import { PlusCircle, Trash2, Save, PlayCircle, Plus, X, Check, Percent, DollarSign, Calendar, Clock, User, Copy, ChevronsUpDown, Database } from 'lucide-react';
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Mock data for existing schemes
const MOCK_SCHEMES = [
  { id: 1, name: 'Enterprise Sales Plan 2024', description: 'For enterprise sales team' },
  { id: 2, name: 'SMB Commission Structure', description: 'For small and medium business sales' },
  { id: 3, name: 'APAC Regional Sales Plan', description: 'For Asia Pacific region' },
  { id: 4, name: 'Partner Channel Incentive', description: 'For partner sales channel' }
];

// Database field options based on the revenue base
const DB_FIELDS = {
  salesOrders: [
    'DiscountPercent', 'TotalAmount', 'ProductCategory', 'CustomerSegment', 
    'SalesRegion', 'DealSize', 'ContractTerm', 'PaymentTerms'
  ],
  invoices: [
    'InvoiceAmount', 'PaymentStatus', 'DueDate', 'DiscountApplied', 
    'TaxAmount', 'CustomerType', 'PaymentMethod', 'Currency'
  ],
  collections: [
    'CollectionAmount', 'CollectionDate', 'PaymentDelay', 'PaymentSource', 
    'CustomerCredit', 'LatePaymentFee', 'SettlementType', 'BankAccount'
  ]
};

// Operator options for conditions
const OPERATORS = [
  { value: '=', label: 'Equals (=)' },
  { value: '!=', label: 'Not Equals (≠)' },
  { value: '>', label: 'Greater Than (>)' },
  { value: '>=', label: 'Greater Than or Equal (≥)' },
  { value: '<', label: 'Less Than (<)' },
  { value: '<=', label: 'Less Than or Equal (≤)' },
  { value: 'contains', label: 'Contains' },
  { value: 'starts_with', label: 'Starts With' },
  { value: 'ends_with', label: 'Ends With' }
];

// Organization levels for credit rules
const ORG_LEVELS = [
  { level: 'L1', description: 'CxO / Executive Leadership' },
  { level: 'L2', description: 'Business Unit Head' },
  { level: 'L3', description: 'Division Head' },
  { level: 'L4', description: 'Manager' },
  { level: 'L5', description: 'Sales Representative' }
];

const IncentivePlanDesigner: React.FC = () => {
  const { toast } = useToast();
  
  const [showExistingSchemes, setShowExistingSchemes] = useState(false);
  
  const [plan, setPlan] = useState({
    name: 'North America Sales Incentive Plan',
    description: 'Commission plan for North America sales team',
    effectiveStart: '2025-01-01',
    effectiveEnd: '2025-12-31',
    revenueBase: 'salesOrders', // New: Revenue Base - salesOrders, invoices, collections
    territories: ['USA', 'Canada', 'Mexico'],
    commissionStructure: {
      tiers: [
        { from: 0, to: 100000, rate: 3 }, // Base tier
        { from: 100001, to: 250000, rate: 4 } // Additional tier
      ]
    },
    measurementRules: {
      primaryMetric: 'revenue', // revenue, units
      minQualification: 50000,
      adjustments: [
        { field: 'DiscountPercent', operator: '>', value: 20, factor: 0.8, description: 'High discount adjustment' }
      ],
      exclusions: [
        { field: 'PaymentTerms', operator: '>', value: 60, description: 'Exclude long payment terms' }
      ]
    },
    creditRules: {
      // New structure for organizational hierarchy
      levels: [
        { level: 'L5', description: 'Sales Representative', percentage: 80 },
        { level: 'L4', description: 'Manager', percentage: 10 },
        { level: 'L3', description: 'Division Head', percentage: 6 },
        { level: 'L2', description: 'Business Unit Head', percentage: 3 },
        { level: 'L1', description: 'CxO', percentage: 1 }
      ],
      sourceSystem: 'hcm' // hcm, manual, upload
    },
    customRules: [
      {
        name: 'Consistent Sales Qualification',
        description: 'Sales rep must have minimum sales for past 3 consecutive months',
        conditions: [
          { period: 'past3months', metric: 'monthlySales', operator: '>=', value: 10000 }
        ],
        active: true
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

  const copyExistingScheme = (schemeId) => {
    // In a real app, this would fetch the scheme from the backend
    const selectedScheme = MOCK_SCHEMES.find(scheme => scheme.id === schemeId);
    
    if (selectedScheme) {
      toast({
        title: "Scheme Copied",
        description: `${selectedScheme.name} has been loaded as a template.`,
        variant: "default"
      });
      
      // In a real implementation, we would get the full scheme data
      // For now, just update the name and description
      updatePlan('name', `Copy of ${selectedScheme.name}`);
      updatePlan('description', selectedScheme.description);
      
      setShowExistingSchemes(false);
    }
  };

  const addTier = () => {
    const newTiers = [...plan.commissionStructure.tiers];
    const lastTier = newTiers[newTiers.length - 1];
    
    const newFrom = lastTier.to + 1;
    const newTo = newFrom + 50000;
    const newRate = lastTier.rate + 1;
    
    newTiers.push({
      from: newFrom,
      to: newTo,
      rate: newRate
    });
    
    updatePlan('commissionStructure', {
      ...plan.commissionStructure,
      tiers: newTiers
    });
  };

  const removeTier = (index) => {
    // Don't allow removing the base tier (index 0)
    if (index === 0) {
      toast({
        title: "Cannot Remove Base Tier",
        description: "The base tier cannot be removed as it defines the starting commission rate.",
        variant: "destructive"
      });
      return;
    }
    
    const newTiers = [...plan.commissionStructure.tiers];
    newTiers.splice(index, 1);
    
    updatePlan('commissionStructure', {
      ...plan.commissionStructure,
      tiers: newTiers
    });
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...plan.commissionStructure.tiers];
    
    // Parse the value as a number
    const numValue = parseFloat(value);
    
    // Validate tier boundaries
    if (field === 'from' || field === 'to') {
      // If updating the 'from' value, ensure it's greater than the previous tier's 'to'
      if (field === 'from' && index > 0) {
        const prevTier = newTiers[index - 1];
        if (numValue <= prevTier.to) {
          toast({
            title: "Invalid Range",
            description: `From value must be greater than previous tier's To value (${prevTier.to})`,
            variant: "destructive"
          });
          return;
        }
      }
      
      // If updating the 'to' value, ensure it's greater than the current 'from'
      if (field === 'to') {
        const currentFrom = newTiers[index].from;
        if (numValue <= currentFrom) {
          toast({
            title: "Invalid Range",
            description: "To value must be greater than From value",
            variant: "destructive"
          });
          return;
        }
        
        // If not the last tier, ensure the 'to' value is less than the next tier's 'from'
        if (index < newTiers.length - 1) {
          const nextTier = newTiers[index + 1];
          if (numValue >= nextTier.from) {
            toast({
              title: "Invalid Range",
              description: `To value must be less than next tier's From value (${nextTier.from})`,
              variant: "destructive"
            });
            return;
          }
        }
      }
    }
    
    // Update the field
    newTiers[index][field] = numValue;
    
    // If updating a 'to' value and not the last tier, also update the next tier's 'from' value
    if (field === 'to' && index < newTiers.length - 1) {
      newTiers[index + 1].from = numValue + 1;
    }
    
    updatePlan('commissionStructure', {
      ...plan.commissionStructure,
      tiers: newTiers
    });
  };

  const addAdjustment = () => {
    const newAdjustments = [...plan.measurementRules.adjustments];
    const defaultField = DB_FIELDS[plan.revenueBase][0];
    
    newAdjustments.push({
      field: defaultField,
      operator: '>',
      value: 0,
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
    const defaultField = DB_FIELDS[plan.revenueBase][0];
    
    newExclusions.push({
      field: defaultField,
      operator: '>',
      value: 0,
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

  const updateCreditPercentage = (index, value) => {
    const newLevels = [...plan.creditRules.levels];
    
    // Parse the new value
    const percentage = parseInt(value);
    
    // Update the specified level
    newLevels[index].percentage = percentage;
    
    // Calculate the sum of all percentages
    const sum = newLevels.reduce((acc, level) => acc + level.percentage, 0);
    
    // If sum is not 100%, show warning
    if (sum !== 100) {
      toast({
        title: "Warning",
        description: `Total percentage is ${sum}%. It should equal 100%.`,
        variant: "warning"
      });
    }
    
    updatePlan('creditRules', {
      ...plan.creditRules,
      levels: newLevels
    });
  };

  const addCustomRule = () => {
    const newRules = [...plan.customRules];
    
    newRules.push({
      name: 'New Custom Rule',
      description: 'Define criteria for this rule',
      conditions: [
        { period: 'current', metric: 'sales', operator: '>=', value: 1000 }
      ],
      active: true
    });
    
    updatePlan('customRules', newRules);
  };

  const removeCustomRule = (index) => {
    const newRules = [...plan.customRules];
    newRules.splice(index, 1);
    
    updatePlan('customRules', newRules);
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

  const getQualificationLabel = () => {
    return plan.measurementRules.primaryMetric === 'revenue' 
      ? 'Minimum Qualification ($)' 
      : 'Minimum Qualification (Units)';
  };

  const getDbFields = () => {
    return DB_FIELDS[plan.revenueBase] || [];
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
        <div className="flex justify-end mb-6">
          <Popover open={showExistingSchemes} onOpenChange={setShowExistingSchemes}>
            <PopoverTrigger asChild>
              <ActionButton 
                variant="outline"
                size="sm"
                onClick={() => setShowExistingSchemes(true)}
              >
                <Copy size={16} className="mr-2" /> Copy Existing Scheme
              </ActionButton>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Select a Scheme to Copy</h3>
                <p className="text-sm text-app-gray-500">
                  Choose an existing scheme to use as a template
                </p>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {MOCK_SCHEMES.map((scheme) => (
                    <div 
                      key={scheme.id}
                      className="p-3 border rounded-lg hover:bg-app-gray-50 cursor-pointer transition-colors"
                      onClick={() => copyExistingScheme(scheme.id)}
                    >
                      <h4 className="font-medium">{scheme.name}</h4>
                      <p className="text-sm text-app-gray-500 mt-1">{scheme.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <SectionPanel title="Basic Information" defaultExpanded={true}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Plan Name</label>
              <Input 
                type="text"
                value={plan.name}
                onChange={(e) => updatePlan('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
              <Textarea 
                className="min-h-[80px]"
                value={plan.description}
                onChange={(e) => updatePlan('description', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Effective Start Date</label>
                <Input 
                  type="date"
                  value={plan.effectiveStart}
                  onChange={(e) => updatePlan('effectiveStart', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Effective End Date</label>
                <Input 
                  type="date"
                  value={plan.effectiveEnd}
                  onChange={(e) => updatePlan('effectiveEnd', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Revenue Base</label>
              <Select 
                value={plan.revenueBase}
                onValueChange={(value) => updatePlan('revenueBase', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select revenue base" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salesOrders">Sales Orders</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                  <SelectItem value="collections">Collections</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-app-gray-500 mt-2">
                Data for calculations will be sourced from the selected system
              </p>
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
              <Input 
                type="text" 
                placeholder="Add new territory..." 
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">From ($)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">To ($)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Commission Rate (%)</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-app-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-app-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-app-gray-200">
                      {plan.commissionStructure.tiers.map((tier, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-app-gray-50 bg-opacity-30'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative">
                              <input 
                                type="number" 
                                className="form-input pl-8 py-2"
                                value={tier.from}
                                onChange={(e) => updateTier(index, 'from', e.target.value)}
                                disabled={index > 0} // Only first tier's "from" can be edited directly
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
                                className="form-input pl-8 py-2"
                                value={tier.to}
                                onChange={(e) => updateTier(index, 'to', e.target.value)}
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
                                onChange={(e) => updateTier(index, 'rate', e.target.value)}
                              />
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Percent size={16} className="text-app-gray-400" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-app-gray-500">
                            {index === 0 ? 'Base Tier' : `Tier ${index}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {index === 0 ? (
                              <span className="text-app-gray-400">-</span>
                            ) : (
                              <button 
                                className="text-app-red hover:text-opacity-80 transition-colors duration-200"
                                onClick={() => removeTier(index)}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-app-gray-500 mt-3">
                Sales within each tier range will be commissioned at the corresponding rate
              </p>
            </div>
          </div>
        </SectionPanel>
        
        <SectionPanel title="Measurement Rules">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Primary Metric</label>
                <Select 
                  value={plan.measurementRules.primaryMetric}
                  onValueChange={(value) => updatePlan('measurementRules', {
                    ...plan.measurementRules,
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
                    value={plan.measurementRules.minQualification}
                    onChange={(e) => updatePlan('measurementRules', {
                      ...plan.measurementRules,
                      minQualification: parseInt(e.target.value)
                    })}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {plan.measurementRules.primaryMetric === 'revenue' ? (
                      <DollarSign size={16} className="text-app-gray-400" />
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
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
                              <Select 
                                value={adjustment.field}
                                onValueChange={(value) => {
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].field = value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].operator = value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
                                  const newAdjustments = [...plan.measurementRules.adjustments];
                                  newAdjustments[index].value = parseFloat(e.target.value);
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
                                    adjustments: newAdjustments
                                  });
                                }}
                              />
                            </div>
                            
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Factor</label>
                              <Input 
                                type="number" 
                                step="0.1"
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
                            
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
                              <Input 
                                type="text" 
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
                  <h3 className="text-base font-medium text-app-gray-700">Exclusions</h3>
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
                    {plan.measurementRules.exclusions.map((exclusion, index) => (
                      <GlassCard key={index} variant="outlined" className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-4">
                            <div className="sm:col-span-3">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Field</label>
                              <Select 
                                value={exclusion.field}
                                onValueChange={(value) => {
                                  const newExclusions = [...plan.measurementRules.exclusions];
                                  newExclusions[index].field = value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
                            
                            <div className="sm:col-span-2">
                              <label className="block text-sm font-medium text-app-gray-700 mb-2">Operator</label>
                              <Select 
                                value={exclusion.operator}
                                onValueChange={(value) => {
                                  const newExclusions = [...plan.measurementRules.exclusions];
                                  newExclusions[index].operator = value;
                                  updatePlan('measurementRules', {
                                    ...plan.measurementRules,
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
                                  const newExclusions = [...plan.measurementRules.exclusions];
                                  newExclusions[index].value = parseFloat(e.target.value);
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
        
        <SectionPanel title="Credit Rules">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-app-gray-700 mb-2">Credit Levels</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.creditRules.levels.map((level, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:bg-app-gray-50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <div className="chip chip-blue mr-2">{level.level}</div>
                            <p className="text-app-gray-500">{level.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="number" 
                            className="form-input pl-8 py-2"
                            value={level.percentage}
                            onChange={(e) => updateCreditPercentage(index, e.target.value)}
                          />
                          <p className="text-app-gray-500 ml-2">%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionPanel>
        
        <SectionPanel title="Payout Schedule">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Payout Frequency</label>
              <Select 
                value={plan.payoutSchedule.frequency}
                onValueChange={(value) => updatePlan('payoutSchedule', {
                  ...plan.payoutSchedule,
                  frequency: value
                })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-app-gray-700 mb-2">Processing Day</label>
              <Input 
                type="number" 
                value={plan.payoutSchedule.processingDay}
                onChange={(e) => updatePlan('payoutSchedule', {
                  ...plan.payoutSchedule,
                  processingDay: parseInt(e.target.value)
                })}
              />
            </div>
          </div>
        </SectionPanel>
        
        <div className="mt-10 flex justify-end space-x-4">
          <ActionButton
            variant="outline" 
            size="lg"
            onClick={simulatePlan}
          >
            <PlayCircle size={18} className="mr-2" /> Simulate
          </ActionButton>
          
          <ActionButton
            variant="primary" 
            size="lg"
            onClick={savePlan}
          >
            <Save size={18} className="mr-2" /> Save Plan
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default IncentivePlanDesigner;
