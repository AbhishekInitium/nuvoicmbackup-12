
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CURRENCIES } from '@/constants/incentiveConstants';
import { IncentivePlan } from '@/types/incentiveTypes';

interface BasicInformationProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ plan, updatePlan }) => {
  return (
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
  );
};

export default BasicInformation;
