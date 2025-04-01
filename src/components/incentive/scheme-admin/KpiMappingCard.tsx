
import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { KpiField } from '@/types/schemeAdminTypes';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from 'react-hook-form';

interface KpiMappingCardProps {
  kpi: KpiField;
  onUpdate: (kpi: KpiField) => void;
  onRemove: (id: string, category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
}

export const KpiMappingCard: React.FC<KpiMappingCardProps> = ({ 
  kpi, 
  onUpdate, 
  onRemove 
}) => {
  const form = useForm({
    defaultValues: {
      name: kpi.name,
      description: kpi.description,
      dataType: kpi.dataType,
      sourceField: kpi.sourceField,
      sourceSystem: kpi.sourceSystem,
      formula: kpi.formula || "",
    }
  });

  const handleUpdateField = (field: keyof KpiField, value: any) => {
    const updatedKpi = { ...kpi, [field]: value };
    onUpdate(updatedKpi);
  };

  const handleFormChange = () => {
    const values = form.getValues();
    const updatedKpi = {
      ...kpi,
      name: values.name,
      description: values.description,
      dataType: values.dataType as 'string' | 'number' | 'date' | 'boolean',
      sourceField: values.sourceField,
      sourceSystem: values.sourceSystem as 'SAP' | 'Excel' | 'Custom',
      formula: values.formula || undefined,
    };
    onUpdate(updatedKpi);
  };

  return (
    <Card className="p-4 relative">
      <div className="absolute top-2 right-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRemove(kpi.id, kpi.category)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
        >
          <Trash2 size={16} />
        </Button>
      </div>
      
      <form onChange={handleFormChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KPI Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Product Revenue" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormField
            control={form.control}
            name="dataType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data Type</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleUpdateField('dataType', value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Description of this KPI" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormField
            control={form.control}
            name="sourceSystem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source System</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleUpdateField('sourceSystem', value);
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source system" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SAP">SAP</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <div>
          <FormField
            control={form.control}
            name="sourceField"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Field</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., grossRevenue" />
                </FormControl>
                <FormDescription className="text-xs">
                  Field name in source system or spreadsheet column
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="md:col-span-2">
          <FormField
            control={form.control}
            name="formula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Formula (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., [grossRevenue] * 0.9" />
                </FormControl>
                <FormDescription className="text-xs">
                  Optional formula for calculated fields. Use [fieldName] for variable references.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Card>
  );
};
