import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GlassCard from '../ui-custom/GlassCard';
import { IncentivePlan } from '@/types/incentiveTypes';
import { Badge } from '../ui/badge';
import { CURRENCIES } from '@/constants/incentiveConstants';

interface BasicInformationProps {
  plan: IncentivePlan;
  updatePlan: <K extends keyof IncentivePlan>(field: K, value: IncentivePlan[K]) => void;
  schemeId: string;
  version?: number;
  isEditMode?: boolean;
  isReadOnly?: boolean;
}

const BasicInformation: React.FC<BasicInformationProps> = ({
  plan,
  updatePlan,
  schemeId,
  version = 1,
  isEditMode = false,
  isReadOnly = false
}) => {
  const handleDateChange = (field: 'effectiveStart' | 'effectiveEnd') => (date: Date | undefined) => {
    if (date && !isReadOnly) {
      updatePlan(field, date.toISOString());
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isReadOnly) return;
    
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updatePlan('salesQuota', value);
    } else {
      updatePlan('salesQuota', 0);
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === plan.currency) || CURRENCIES[0];

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  const getStatusBadge = () => {
    const status = plan.metadata?.status || 'DRAFT';
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "outline";
    
    switch(status.toUpperCase()) {
      case 'APPROVED':
        badgeVariant = "secondary";
        break;
      case 'SIMULATION':
      case 'SIMULATED':
        badgeVariant = "default";
        break;
      case 'PRODUCTION':
      case 'PRODRUN':
        badgeVariant = "destructive";
        break;
      default:
        badgeVariant = "outline";
    }
    
    return (
      <Badge variant={badgeVariant} className="ml-2">
        {status}
      </Badge>
    );
  };

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
                <div className="flex items-center">
                  {isEditMode && (
                    <Badge variant="outline" className="mr-2">
                      Version {version}
                    </Badge>
                  )}
                  {plan.metadata?.status && getStatusBadge()}
                </div>
              </div>
              {isReadOnly ? (
                <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                  {plan.name}
                </div>
              ) : (
                <Input
                  id="name"
                  value={plan.name}
                  onChange={(e) => updatePlan('name', e.target.value)}
                  placeholder="Enter scheme name"
                  className="w-full"
                />
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="description" className="text-sm font-medium text-app-gray-700 mb-2">
                Description
              </Label>
              {isReadOnly ? (
                <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                  {plan.description}
                </div>
              ) : (
                <Input
                  id="description"
                  value={plan.description}
                  onChange={(e) => updatePlan('description', e.target.value)}
                  placeholder="Brief description of this incentive scheme"
                  className="w-full"
                />
              )}
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

            <div className="mb-4">
              <Label htmlFor="salesQuota" className="text-sm font-medium text-app-gray-700 mb-2">
                Sales Quota
              </Label>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-app-gray-500">
                    {selectedCurrency?.symbol}
                  </span>
                  {isReadOnly ? (
                    <div className="h-10 px-4 py-2 pl-7 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                      {plan.salesQuota || 0}
                    </div>
                  ) : (
                    <Input
                      id="salesQuota"
                      type="text"
                      value={plan.salesQuota || 0}
                      onChange={handleNumberChange}
                      className="w-full pl-7"
                      placeholder="Enter target sales quota"
                    />
                  )}
                </div>
              </div>
              <p className="mt-1 text-xs text-app-gray-500">
                The target sales quota for this incentive scheme
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
                  {isReadOnly ? (
                    <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                      {formatDate(plan.effectiveStart)}
                    </div>
                  ) : (
                    <DatePicker
                      date={plan.effectiveStart ? new Date(plan.effectiveStart) : undefined}
                      setDate={handleDateChange('effectiveStart')}
                      placeholder="Select start date"
                    />
                  )}
                </div>
                <div>
                  <Label htmlFor="effectiveEnd" className="text-xs text-app-gray-600 mb-1">End Date</Label>
                  {isReadOnly ? (
                    <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                      {formatDate(plan.effectiveEnd)}
                    </div>
                  ) : (
                    <DatePicker
                      date={plan.effectiveEnd ? new Date(plan.effectiveEnd) : undefined}
                      setDate={handleDateChange('effectiveEnd')}
                      placeholder="Select end date"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="currency" className="text-sm font-medium text-app-gray-700 mb-2">
                Currency
              </Label>
              {isReadOnly ? (
                <div className="h-10 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 text-gray-700">
                  {CURRENCIES.find(c => c.code === plan.currency)?.label || plan.currency}
                </div>
              ) : (
                <Select
                  value={plan.currency}
                  onValueChange={(value) => updatePlan('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default BasicInformation;
