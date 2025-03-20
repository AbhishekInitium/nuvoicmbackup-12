
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

// Define form schema
const apiFormSchema = z.object({
  method: z.string().default('GET'),
  endpoint: z.string().min(1, { message: 'Endpoint is required' }),
  usesProxy: z.boolean().default(true),
  username: z.string().optional(),
  password: z.string().optional(),
  useAuth: z.boolean().default(true),
  headers: z.string().default('{\n  "Content-Type": "application/json"\n}'),
  params: z.string().default('{\n  "$format": "json"\n}'),
  body: z.string().optional(),
});

export type ApiFormValues = z.infer<typeof apiFormSchema>;

interface ApiRequestFormProps {
  onSubmit: (data: ApiFormValues) => void;
  loading: boolean;
}

const ApiRequestForm: React.FC<ApiRequestFormProps> = ({ onSubmit, loading }) => {
  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      method: 'GET',
      endpoint: '/sap/opu/odata/sap/API_SALESORGANIZATION_SRV/A_SalesOrganization',
      usesProxy: true,
      username: 'S4HANA_BASIC',
      password: 'GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi',
      useAuth: true,
      headers: '{\n  "Content-Type": "application/json",\n  "Accept": "application/json"\n}',
      params: '{\n  "$format": "json"\n}',
      body: ''
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex space-x-2">
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Method</FormLabel>
                <select 
                  className="w-full h-10 border border-input rounded-md px-3"
                  {...field}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Endpoint</FormLabel>
                <FormControl>
                  <Input placeholder="/sap/opu/odata/sap/API_SERVICE/Entity" {...field} />
                </FormControl>
                <FormDescription>
                  The SAP API endpoint to test
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <FormField
            control={form.control}
            name="usesProxy"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Use Proxy Server</FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="useAuth"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Use Authentication</FormLabel>
              </FormItem>
            )}
          />
        </div>
        
        {form.watch('useAuth') && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="S4 Username" {...field} />
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
                    <Input type="password" placeholder="S4 Password" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}
        
        <FormField
          control={form.control}
          name="headers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headers (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{ "Content-Type": "application/json" }'
                  className="font-mono h-24"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="params"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Query Parameters (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{ "$format": "json" }'
                  className="font-mono h-24"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Request Body (JSON)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='{ "property": "value" }'
                  className="font-mono h-24"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Only applicable for POST, PUT, and PATCH requests
              </FormDescription>
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending Request...' : 'Send Request'}
        </Button>
      </form>
    </Form>
  );
};

export default ApiRequestForm;
