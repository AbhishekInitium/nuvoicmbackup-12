
import React from 'react';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { IncentivePlan } from '@/types/incentiveTypes';
import { Label } from '@/components/ui/label';

interface BasicInformationProps {
  plan: IncentivePlan;
  updatePlan: (section: string, value: any) => void;
  schemeId: string;
  version: number;
  isEditMode?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  plan,
  updatePlan,
  schemeId,
  version,
  isEditMode = false
}) => {
  const handleDateChange = (key: 'effectiveStart' | 'effectiveEnd', date?: Date | null) => {
    if (date) {
      updatePlan(key, date.toISOString().split('T')[0]);
    }
  };

  // Parse dates from ISO strings to Date objects
  const startDate = plan.effectiveStart ? new Date(plan.effectiveStart) : undefined;
  const endDate = plan.effectiveEnd ? new Date(plan.effectiveEnd) : undefined;

  // Format sales quota for display
  const formatSalesQuota = (value: number | string | undefined): string => {
    if (value === undefined) return '';
    return typeof value === 'string' ? value : value.toString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      <div>
        <Label htmlFor="name">Plan Name</Label>
        <Input
          id="name"
          placeholder="Enter plan name"
          value={plan.name || ''}
          onChange={(e) => updatePlan('name', e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="schemeId">Scheme ID</Label>
        <Input
          id="schemeId"
          value={schemeId}
          disabled
          className="mt-1 bg-app-gray-50"
        />
      </div>

      <div>
        <Label htmlFor="version">Version</Label>
        <Input
          id="version"
          value={version}
          disabled
          className="mt-1 bg-app-gray-50"
        />
      </div>

      <div>
        <Label htmlFor="currency">Currency</Label>
        <Select
          value={plan.currency || 'USD'}
          onValueChange={(value) => updatePlan('currency', value)}
        >
          <SelectTrigger id="currency" className="mt-1">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <div className="mt-1">
          <DatePicker
            date={startDate}
            setDate={(date) => handleDateChange('effectiveStart', date)}
            placeholder="Select start date"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="endDate">End Date</Label>
        <div className="mt-1">
          <DatePicker
            date={endDate}
            setDate={(date) => handleDateChange('effectiveEnd', date)}
            placeholder="Select end date"
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="salesQuota">Sales Quota</Label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-app-gray-500">
              {plan.currency === 'USD' ? '$' : plan.currency === 'EUR' ? '€' : plan.currency === 'GBP' ? '£' : ''}
            </span>
          </div>
          <Input
            id="salesQuota"
            type="text"
            placeholder="100,000"
            value={formatSalesQuota(plan.salesQuota)}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              updatePlan('salesQuota', value ? parseInt(value) : 0);
            }}
            className="pl-8"
          />
        </div>
      </div>

      <div className="md:col-span-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="Enter plan description"
          value={plan.description || ''}
          onChange={(e) => updatePlan('description', e.target.value)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default BasicInformation;
