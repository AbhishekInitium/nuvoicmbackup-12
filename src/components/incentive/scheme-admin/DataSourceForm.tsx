
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { FileUploader } from './FileUploader';

export const DataSourceForm: React.FC = () => {
  const form = useForm({
    defaultValues: {
      connectionString: '',
      username: '',
      password: '',
      excelFormat: ''
    }
  });
  
  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Configure Data Source</h2>
      
      <Tabs defaultValue="excel" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="excel">Excel Source</TabsTrigger>
          <TabsTrigger value="sap">SAP Connection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="excel">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Excel Template Configuration</h3>
                <p className="text-gray-600 mb-6">
                  Upload an Excel template or sample file to map the columns to KPIs. 
                  The first row will be used as column headers.
                </p>
                
                <FormField
                  control={form.control}
                  name="excelFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excel Format Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Monthly Sales Data Format" />
                      </FormControl>
                      <FormDescription>
                        A description of the expected format for Excel uploads
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
              
              <FileUploader 
                onFileSelected={(file) => console.log("Selected file:", file)} 
                onFileProcessed={(data) => console.log("Processed data:", data)} 
              />
              
              <div className="flex justify-end pt-4">
                <Button>Save Excel Configuration</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="sap">
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium mb-4">SAP Connection Details</h3>
              
              <FormField
                control={form.control}
                name="connectionString"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection String</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="SAP connection string" />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="SAP service username" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} placeholder="SAP service password" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button className="mr-3" variant="outline">Test Connection</Button>
                <Button>Save SAP Configuration</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
