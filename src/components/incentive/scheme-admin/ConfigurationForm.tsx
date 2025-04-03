
import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataSourceType } from '@/types/schemeAdminTypes';

interface ConfigurationFormProps {
  form: UseFormReturn<{
    adminId: string;
    adminName: string;
    calculationBase: string;
    baseDataSourceType: DataSourceType;
    baseSourceField: string;
  }, any, undefined>;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ form }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Scheme Configuration</h3>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="adminName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Configuration Name</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., NorthAmerica_Orders_2024" 
                />
              </FormControl>
              <FormDescription>
                A descriptive name for this scheme configuration
              </FormDescription>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="calculationBase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calculation Base</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="e.g., Sales Orders" 
                />
              </FormControl>
              <FormDescription>
                The primary metric used for calculations
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="baseDataSourceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a source type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SAP">SAP</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="API">API</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Data source for the calculation base
                </FormDescription>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="baseSourceField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Field</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="e.g., VBAP-NETWR" 
                  />
                </FormControl>
                <FormDescription>
                  Field mapping in the source system
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Card>
  );
};
