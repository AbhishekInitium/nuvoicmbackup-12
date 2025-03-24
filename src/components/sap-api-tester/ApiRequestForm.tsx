
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Send } from 'lucide-react';

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
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ApiRequestForm: React.FC<ApiRequestFormProps> = ({ 
  onSubmit, 
  loading, 
  activeTab, 
  onTabChange 
}) => {
  const form = useForm<ApiFormValues>({
    resolver: zodResolver(apiFormSchema),
    defaultValues: {
      method: 'GET',
      endpoint: '/sap/opu/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner',
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* URL Bar */}
        <div className="flex items-center space-x-2">
          <div className="w-28">
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem className="mb-0">
                  <select 
                    className="w-full h-10 border border-input bg-background rounded-md px-3 py-2 text-sm font-medium"
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
          </div>
          
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem className="flex-1 mb-0">
                <FormControl>
                  <Input 
                    placeholder="Enter request URL"
                    className="h-10"
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={loading} className="h-10 px-4">
            {loading ? 'Sending...' : <Send className="h-4 w-4 mr-2" />}
            Send
          </Button>
        </div>
        
        {/* Settings/Options Bar */}
        <div className="flex items-center justify-between border rounded-md p-2 bg-gray-50">
          <FormField
            control={form.control}
            name="usesProxy"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 mb-0">
                <FormLabel className="mb-0">Use Proxy</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="useAuth"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 mb-0">
                <FormLabel className="mb-0">Basic Auth</FormLabel>
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
        
        {/* Request Details Tabs */}
        <Tabs value={activeTab} onValueChange={onTabChange}>
          <TabsList className="grid grid-cols-4 w-full mb-2">
            <TabsTrigger value="params">Params</TabsTrigger>
            <TabsTrigger value="auth">Authorization</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="body">Body</TabsTrigger>
          </TabsList>
          
          {/* Params Tab */}
          <TabsContent value="params" className="border rounded-md p-4">
            <FormField
              control={form.control}
              name="params"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query Parameters (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "$format": "json" }'
                      className="font-mono h-48"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Common parameters: $format=json, $top=10, $filter=PropertyName eq 'Value'
                  </FormDescription>
                </FormItem>
              )}
            />
          </TabsContent>
          
          {/* Auth Tab */}
          <TabsContent value="auth" className="border rounded-md p-4">
            {form.watch('useAuth') ? (
              <div className="space-y-4">
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
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                Enable Basic Auth in the options to configure credentials
              </div>
            )}
          </TabsContent>
          
          {/* Headers Tab */}
          <TabsContent value="headers" className="border rounded-md p-4">
            <FormField
              control={form.control}
              name="headers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headers (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{ "Content-Type": "application/json" }'
                      className="font-mono h-48"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>
          
          {/* Body Tab */}
          <TabsContent value="body" className="border rounded-md p-4">
            {watchMethod !== 'GET' ? (
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body (JSON)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='{ "property": "value" }'
                        className="font-mono h-48"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground">
                Body is not applicable for GET requests
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Info & Help Section */}
        <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="font-semibold">Tips:</span>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li>For SAP OData services, try endpoints like <code>/sap/opu/odata4/sap/api_business_partner/default/sap/api_business_partner/0001/BusinessPartner</code></li>
            <li>The proxy server must be running for the proxy option to work</li>
            <li>All JSON must be properly formatted with double quotes</li>
          </ul>
        </div>
      </form>
    </Form>
  );
};

export default ApiRequestForm;
