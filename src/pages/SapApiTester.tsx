
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import ApiRequestForm, { ApiFormValues } from '@/components/sap-api-tester/ApiRequestForm';
import ApiResponseDisplay from '@/components/sap-api-tester/ApiResponseDisplay';
import ApiHelpDialog from '@/components/sap-api-tester/ApiHelpDialog';
import ApiTesterHeader from '@/components/sap-api-tester/ApiTesterHeader';

const SapApiTester = () => {
  const { toast } = useToast();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [rawResponseInfo, setRawResponseInfo] = useState<{
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
  }>({});

  const handleSubmit = async (data: ApiFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      // Parse JSON strings
      let headers: Record<string, string> = {};
      let params: Record<string, string> = {};
      let body: any = undefined;
      
      try {
        headers = JSON.parse(data.headers || '{}');
      } catch (e) {
        console.error('Failed to parse headers JSON:', e);
        toast({
          variant: 'destructive',
          title: 'Invalid Headers JSON',
          description: 'Please check your headers format',
        });
        setLoading(false);
        return;
      }
      
      try {
        params = JSON.parse(data.params || '{}');
      } catch (e) {
        console.error('Failed to parse params JSON:', e);
        toast({
          variant: 'destructive',
          title: 'Invalid Query Parameters JSON',
          description: 'Please check your parameters format',
        });
        setLoading(false);
        return;
      }
      
      if (data.body) {
        try {
          body = JSON.parse(data.body);
        } catch (e) {
          console.error('Failed to parse body JSON:', e);
          toast({
            variant: 'destructive',
            title: 'Invalid Body JSON',
            description: 'Please check your request body format',
          });
          setLoading(false);
          return;
        }
      }
      
      // Prepare the URL
      let url = data.endpoint;
      
      // Handle direct URLs vs proxy URLs
      if (data.usesProxy) {
        // Check if the endpoint is already a full URL
        const isFullUrl = url.match(/^https?:\/\//);
        
        if (isFullUrl) {
          // Use the cleaner targetUrl approach for full URLs
          url = `/api/sap?targetUrl=${encodeURIComponent(url)}`;
          console.log('Using proxy with full URL:', url);
        } else {
          // For paths, add the /api/sap prefix
          url = `/api/sap${url.startsWith('/') ? '' : '/'}${url}`;
          console.log('Using proxy with path:', url);
        }
      } else {
        // Direct request to SAP without proxy
        // Make sure the URL is absolute
        if (!url.match(/^https?:\/\//)) {
          url = `https://my418390-api.s4hana.cloud.sap${url.startsWith('/') ? '' : '/'}${url}`;
        }
        console.log('Making direct request (no proxy) to:', url);
      }
      
      // Build request config
      const config: AxiosRequestConfig = {
        method: data.method,
        url,
        headers,
        params,
        data: data.method !== 'GET' ? body : undefined,
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
      
      // Store the raw response data without any processing
      setResponse(response.data);
      setRawResponseInfo({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
      });
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
        let errorMessage = `Error ${axiosError.response?.status || ''}: ${axiosError.message}`;
        
        // Add more context for network errors
        if (axiosError.message === 'Network Error') {
          errorMessage += " - This could be due to CORS restrictions, proxy server not running, or the endpoint being unreachable";
          errorMessage += "\n\nConsider trying without the proxy option for direct SAP endpoints that support CORS.";
        }
        
        setError(errorMessage);
        
        // Still show the error response if available
        if (axiosError.response?.data) {
          setResponse(axiosError.response.data);
          setRawResponseInfo({
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            headers: axiosError.response.headers as Record<string, string>,
          });
          setShowResponse(true);
        }
        
        toast({
          variant: 'destructive',
          title: 'API Request Failed',
          description: `Status: ${axiosError.response?.status || 'Network Error'} - ${axiosError.message}`,
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
      <ApiTesterHeader onShowHelp={() => setShowHelp(true)} />
      <ApiHelpDialog open={showHelp} onOpenChange={setShowHelp} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <ApiRequestForm onSubmit={handleSubmit} loading={loading} />
        </div>
        
        <ApiResponseDisplay 
          response={response}
          error={error}
          showResponse={showResponse}
          loading={loading}
          rawInfo={rawResponseInfo}
        />
      </div>
    </div>
  );
};

export default SapApiTester;
