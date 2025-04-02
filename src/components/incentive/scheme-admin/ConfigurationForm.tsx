
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

interface ConfigurationFormProps {
  form: UseFormReturn<{
    adminId: string;
    adminName: string;
    calculationBase: string;
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
      </div>
    </Card>
  );
};
