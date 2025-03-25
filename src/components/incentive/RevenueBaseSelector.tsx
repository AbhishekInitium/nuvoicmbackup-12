
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RevenueBaseSelectorProps {
  revenueBase: string;
  updateRevenueBase: (value: string) => void;
}

const RevenueBaseSelector: React.FC<RevenueBaseSelectorProps> = ({ 
  revenueBase, 
  updateRevenueBase 
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-app-gray-700 mb-2">Revenue Base</label>
      <Select 
        value={revenueBase}
        onValueChange={updateRevenueBase}
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
  );
};

export default RevenueBaseSelector;
