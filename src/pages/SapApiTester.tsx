import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

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

type ApiFormValues = z.infer<typeof apiFormSchema>;

const SapApiTester = () => {
  const { toast } = useToast();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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

  const handleSubmit = async (data: ApiFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Parse JSON strings
      const headers = JSON.parse(data.headers || '{}');
      const params = JSON.parse(data.params || '{}');
      const body = data.body ? JSON.parse(data.body) : undefined;
      
      // Prepare the URL
      let url = data.endpoint;
      
      // When using proxy, we need to add the /api/sap prefix
      if (data.usesProxy) {
        // Check if the endpoint is already a full URL
        const isFullUrl = url.match(/^https?:\/\//);
        
        // If it's a full URL and we're using the proxy, keep it as is
        // The proxy server will handle the conversion
        if (isFullUrl) {
          url = `/api/sap${url}`;
        } else {
          // If it's a path, add the /api/sap prefix
          // Make sure there's no double slash
          url = `/api/sap${url.startsWith('/') ? '' : '/'}${url}`;
        }
      }
      
      // Build request config
      const config: AxiosRequestConfig = {
        method: data.method,
        url,
        headers,
        params,
        data: body,
      };
      
      // Add Basic Auth if needed
      if (data.useAuth && data.username && data.password) {
        const credentials = `${data.username}:${data.password}`;
        const base64Credentials = btoa(credentials);
        config.headers.Authorization = `Basic ${base64Credentials}`;
      }
      
      console.log('Request config:', config);
      
      // Make the request
      const response = await axios(config);
      setResponse(response.data);
      setShowResponse(true);
      
      toast({
        title: 'API Request Successful',
        description: `Status: ${response.status} ${response.statusText}`,
      });
    } catch (err) {
      console.error('API Request Error:', err);
      
      // Handle axios errors
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        setError(`Error ${axiosError.response?.status || ''}: ${axiosError.message}`);
        setResponse(axiosError.response?.data || {});
        setShowResponse(true);
        
        toast({
          variant: 'destructive',
          title: 'API Request Failed',
          description: `Status: ${axiosError.response?.status || 'Unknown'} - ${axiosError.message}`,
        });
      } else {
        setError(`Unexpected error: ${(err as Error).message}`);
        toast({
          variant: 'destructive',
          title: 'API Request Failed',
          description: (err as Error).message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">SAP API Tester</h1>
      <p className="text-gray-500 mb-4">
        Test your SAP API endpoints before implementing them in your application.
      </p>
      
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertTitle>How to use this tool</AlertTitle>
        <AlertDescription>
          You can enter either a path like <code>/sap/opu/odata/sap/API_SERVICE/Entity</code> or a 
          full URL like <code>https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SERVICE/Entity</code>.
          <Button 
            variant="link" 
            onClick={() => setShowHelp(true)}
            className="p-0 h-auto text-blue-500 font-normal"
          >
            View formatting tips
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Testing Tips</DialogTitle>
            <DialogDescription>
              How to format your API requests correctly
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">When using proxy (recommended):</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>You can use either full URLs or relative paths</li>
                <li>Example path: <code className="bg-muted px-1 rounded">/sap/opu/odata/sap/API_SERVICE/Entity</code></li>
                <li>Example URL: <code className="bg-muted px-1 rounded">https://my418390-api.s4hana.cloud.sap/sap/opu/odata/sap/API_SERVICE/Entity</code></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">When not using proxy:</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>You must use full URLs including the protocol (https://)</li>
                <li>CORS issues may prevent direct access from the browser</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Common request parameters:</h3>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><code className="bg-muted px-1 rounded">$format=json</code> - Request JSON format response</li>
                <li><code className="bg-muted px-1 rounded">$top=10</code> - Limit results to 10 items</li>
                <li><code className="bg-muted px-1 rounded">$filter=PropertyName eq 'Value'</code> - Filter results</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
        </div>
        
        <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Response</h2>
            {response && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">View Full Response</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>API Response</DialogTitle>
                  </DialogHeader>
                  <div className="bg-muted p-4 rounded-md">
                    <pre className="text-sm overflow-auto whitespace-pre-wrap">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {error && (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
          
          {showResponse && !error && (
            <div className="p-4 rounded-md bg-muted">
              <p className="font-medium mb-2">Status: {loading ? 'Sending...' : 'Success'}</p>
              <pre className="text-sm overflow-auto h-[500px] whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
          
          {!showResponse && !error && (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
              <p>Send a request to see the response here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SapApiTester;

