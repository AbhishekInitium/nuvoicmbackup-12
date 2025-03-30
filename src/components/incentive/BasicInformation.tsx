
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from '../ui-custom/GlassCard';
import { IncentivePlan } from '@/types/incentiveTypes';
import RevenueBaseSelector from './RevenueBaseSelector';
import { Badge } from '../ui/badge';
import { CURRENCIES } from '@/constants/incentiveConstants';

interface BasicInformationProps {
  plan: IncentivePlan;
  updatePlan: <K extends keyof IncentivePlan>(field: K, value: IncentivePlan[K]) => void;
  schemeId: string;
  version?: number;
  isEditMode?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  plan,
  updatePlan,
  schemeId,
  version = 1,
  isEditMode = false
}) => {
  const handleDateChange = (field: 'effectiveStart' | 'effectiveEnd') => (date: Date | undefined) => {
    if (date) {
      updatePlan(field, date.toISOString());
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === plan.currency) || CURRENCIES[0];

  return (
    <div className="space-y-6">
      <GlassCard variant="default" className="p-5">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="name" className="text-sm font-medium text-app-gray-700 mb-2">
                  Scheme Name
                </Label>
                {isEditMode && (
                  <Badge variant="outline" className="ml-2">
                    Version {version}
                  </Badge>
                )}
              </div>
              <Input
                id="name"
                value={plan.name}
                onChange={(e) => updatePlan('name', e.target.value)}
                placeholder="Enter scheme name"
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="description" className="text-sm font-medium text-app-gray-700 mb-2">
                Description
              </Label>
              <Input
                id="description"
                value={plan.description}
                onChange={(e) => updatePlan('description', e.target.value)}
                placeholder="Brief description of this incentive scheme"
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium text-app-gray-700 mb-2">
                Scheme ID
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  value={schemeId}
                  readOnly
                  className="w-full bg-app-gray-100"
                />
              </div>
              <p className="mt-1 text-xs text-app-gray-500">
                Unique identifier for this scheme
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-col mb-4">
              <Label htmlFor="effectiveStart" className="text-sm font-medium text-app-gray-700 mb-2">
                Effective Period
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="effectiveStart" className="text-xs text-app-gray-600 mb-1">Start Date</Label>
                  <DatePicker
                    date={plan.effectiveStart ? new Date(plan.effectiveStart) : undefined}
                    setDate={handleDateChange('effectiveStart')}
                    placeholder="Select start date"
                  />
                </div>
                <div>
                  <Label htmlFor="effectiveEnd" className="text-xs text-app-gray-600 mb-1">End Date</Label>
                  <DatePicker
                    date={plan.effectiveEnd ? new Date(plan.effectiveEnd) : undefined}
                    setDate={handleDateChange('effectiveEnd')}
                    placeholder="Select end date"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="currency" className="text-sm font-medium text-app-gray-700 mb-2">
                Currency
              </Label>
              <Select
                value={plan.currency}
                onValueChange={(value) => updatePlan('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <RevenueBaseSelector 
              revenueBase={plan.revenueBase}
              updateRevenueBase={(value) => updatePlan('revenueBase', value)}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BasicInformation;
