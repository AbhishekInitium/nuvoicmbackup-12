
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrimaryMetricSelectorProps {
  primaryMetric: string;
  onPrimaryMetricChange: (value: string) => void;
}

const PrimaryMetricSelector: React.FC<PrimaryMetricSelectorProps> = ({
  primaryMetric,
  onPrimaryMetricChange
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-app-gray-700 mb-2">Primary Metric</label>
      <Select 
        value={primaryMetric}
        onValueChange={onPrimaryMetricChange}
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
  );
};

export default PrimaryMetricSelector;
