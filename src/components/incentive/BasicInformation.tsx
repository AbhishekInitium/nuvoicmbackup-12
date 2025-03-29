
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';
import { getCurrencySymbol } from '@/utils/incentiveUtils';

interface BasicInformationProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
  schemeId?: string;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ plan, updatePlan, schemeId }) => {
  const currencySymbol = getCurrencySymbol(plan.currency);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Plan Name</label>
          <Input 
            type="text"
            value={plan.name}
            onChange={(e) => updatePlan('name', e.target.value)}
            placeholder="Enter plan name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Scheme ID</label>
          <Input 
            type="text"
            value={schemeId || ''}
            readOnly
            disabled
            className="bg-app-gray-100 text-app-gray-500"
            placeholder="Auto-generated ID"
          />
          <p className="text-xs text-app-gray-500 mt-1">Auto-generated unique identifier</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-app-gray-700 mb-2">Description</label>
        <Textarea 
          className="min-h-[80px]"
          value={plan.description}
          onChange={(e) => updatePlan('description', e.target.value)}
          rows={2}
          placeholder="Enter plan description"
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
        
        <div>
          <label className="block text-sm font-medium text-app-gray-700 mb-2">Currency</label>
          <Select 
            value={plan.currency}
            onValueChange={(value) => updatePlan('currency', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(currency => (
                <SelectItem key={currency.code} value={currency.code}>
                  {`${currency.symbol} ${currency.name} (${currency.code})`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-app-gray-700 mb-2">Sales Quota / Target</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{currencySymbol}</span>
          </div>
          <Input 
            type="text"
            className="pl-8"
            value={plan.salesQuota || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              updatePlan('salesQuota', value ? parseInt(value) : 0);
            }}
            placeholder="Enter sales quota"
          />
        </div>
        <p className="text-sm text-app-gray-500 mt-2">
          Target amount to measure quota attainment against the selected revenue base
        </p>
      </div>
    </div>
  );
};

export default BasicInformation;
