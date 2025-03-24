
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

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
      endpoint: '/sap/opu/odata4/sap/api_supplierquotation_2/srvd_a2x/sap/supplierquotation/0001/SupplierQuotation',
      usesProxy: true,
      username: 'S4HANA_BASIC',
      password: 'GGWYYnbPqPWmpcuCHt9zuht<NFnlkbQYJEHvkfLi',
      useAuth: true,
      headers: '{\n  "Content-Type": "application/json",\n  "Accept": "application/json"\n}',
      params: '{\n  "$format": "json"\n}',
      body: ''
    }
  });

  const watchUseProxy = form.watch('usesProxy');
  const watchMethod = form.watch('method');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="usesProxy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between space-x-2 mb-0">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Use Proxy Server</FormLabel>
                    <FormDescription>
                      Turn on for SAP APIs with CORS restrictions, off for direct access
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </Card>

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
                  <Input 
                    placeholder={watchUseProxy 
                      ? "/sap/opu/odata4/sap/api_supplierquotation_2/srvd_a2x/sap/supplierquotation/0001" 
                      : "https://my418390-api.s4hana.cloud.sap/sap/opu/odata4/sap/..."}
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {watchUseProxy 
                    ? "Enter the SAP API path or full URL (e.g., /sap/opu/... or https://my418390-api.s4hana.cloud.sap/...)" 
                    : "Enter the full URL including https:// (e.g., https://my418390-api.s4hana.cloud.sap/...)"}
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        
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
              <FormLabel>Use Basic Authentication</FormLabel>
            </FormItem>
          )}
        />
        
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
        
        {watchMethod !== 'GET' && (
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
        )}
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending Request...' : 'Send Request'}
        </Button>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="font-semibold">Important:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>For SAP OData services, try endpoints like <code>/sap/opu/odata4/sap/api_business_partner/default/sap/api_business_partner/0001/BusinessPartner</code></li>
            <li>All JSON must be properly formatted with double quotes</li>
            <li>The proxy server must be running to use the proxy option</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};

export default ApiRequestForm;
