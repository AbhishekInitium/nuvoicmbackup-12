
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUploader } from './FileUploader';

export const DataSourceForm: React.FC = () => {
  const form = useForm({
    defaultValues: {
      sourceSystem: "Excel",
      connectionString: "",
      fileFormat: "CSV"
    }
  });

  const onSubmit = (data: any) => {
    console.log("Data source configuration:", data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Configure Data Source</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="sourceSystem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source System</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a source system" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SAP">SAP</SelectItem>
                        <SelectItem value="Excel">Excel</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      System providing the data
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              {form.watch("sourceSystem") === "SAP" && (
                <FormField
                  control={form.control}
                  name="connectionString"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Connection String</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter SAP connection details" />
                      </FormControl>
                      <FormDescription>
                        Connection details for SAP system
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
              
              {form.watch("sourceSystem") === "Excel" && (
                <>
                  <FormField
                    control={form.control}
                    name="fileFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>File Format</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select file format" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CSV">CSV</SelectItem>
                            <SelectItem value="XLSX">Excel (XLSX)</SelectItem>
                            <SelectItem value="XLS">Excel (XLS)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Format of the input file
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Upload Template</FormLabel>
                    <FileUploader 
                      accept=".csv,.xlsx,.xls" 
                      onFileUpload={(file) => console.log("File uploaded:", file)}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a sample file to extract column headers
                    </p>
                  </div>
                </>
              )}
              
              {form.watch("sourceSystem") === "Custom" && (
                <FormField
                  control={form.control}
                  name="customDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Source Details</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Describe the custom data source" 
                        />
                      </FormControl>
                      <FormDescription>
                        Details about your custom data source
                      </FormDescription>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit">
              Save Data Source Configuration
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
