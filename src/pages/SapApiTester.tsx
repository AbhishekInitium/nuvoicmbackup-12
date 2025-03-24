import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Send, Save, Clock, ArrowRight } from 'lucide-react';
import ApiRequestForm, { ApiFormValues } from '@/components/sap-api-tester/ApiRequestForm';
import ApiResponseDisplay from '@/components/sap-api-tester/ApiResponseDisplay';
import ApiHelpDialog from '@/components/sap-api-tester/ApiHelpDialog';
import RequestHistory from '@/components/sap-api-tester/RequestHistory';
import CollectionsSidebar from '@/components/sap-api-tester/CollectionsSidebar';
import ApiTesterHeader from '@/components/sap-api-tester/ApiTesterHeader';

type HistoryEntry = {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  success: boolean;
  requestData: ApiFormValues;
};

const SapApiTester = () => {
  const { toast } = useToast();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResponse, setShowResponse] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('params');
  const [responseTab, setResponseTab] = useState('body');
  const [requestHistory, setRequestHistory] = useState<HistoryEntry[]>([]);
  const [rawResponseInfo, setRawResponseInfo] = useState<{
    status?: number;
    statusText?: string;
    headers?: Record<string, string>;
    time?: number;
  }>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('api-request-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setRequestHistory(parsedHistory);
      } catch (e) {
        console.error('Failed to parse request history:', e);
      }
    }
  }, []);

  const saveToHistory = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString()
    };
    
    const updatedHistory = [newEntry, ...requestHistory.slice(0, 19)];
    setRequestHistory(updatedHistory);
    
    try {
      localStorage.setItem('api-request-history', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error('Failed to save history to localStorage:', e);
    }
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    handleSubmit(entry.requestData);
  };

  const handleSubmit = async (data: ApiFormValues) => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    
    try {
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
      
      if (data.body && data.method !== 'GET') {
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
      
      let url: string;
      
      if (data.usesProxy) {
        url = `/api/proxy?targetUrl=${data.endpoint}`;
        console.log('Using proxy with URL:', url);
      } else {
        url = data.endpoint;
        console.log('Using direct call to:', url);
      }
      
      if (data.useAuth && data.username && data.password) {
        const credentials = `${data.username}:${data.password}`;
        const base64Credentials = btoa(credentials);
        headers.Authorization = `Basic ${base64Credentials}`;
      }
      
      if (data.sapClient) {
        headers.Cookie = `sap-usercontext=sap-client=${data.sapClient}`;
        console.log('Using SAP client:', data.sapClient);
      }
      
      const config: AxiosRequestConfig = {
        method: data.method,
        url: url,
        headers: headers,
        params: params,
        data: data.method !== 'GET' ? body : undefined,
        timeout: 30000,
        maxBodyLength: Infinity,
        maxRedirects: 0
      };
      
      console.log('Request config:', {
        method: config.method,
        url: config.url,
        headers: config.headers,
        params: config.params,
        hasBody: config.data !== undefined
      });
      
      const response = await axios(config);
      const endTime = performance.now();
      const requestTime = Math.round(endTime - startTime);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', typeof response.data);
      
      setResponse(response.data);
      setRawResponseInfo({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        time: requestTime
      });
      setShowResponse(true);
      
      saveToHistory({
        method: data.method,
        url: data.endpoint,
        timestamp: new Date(),
        success: true,
        requestData: data
      });
      
      toast({
        title: 'API Request Successful',
        description: `Status: ${response.status} ${response.statusText}`,
      });
    } catch (err) {
      console.error('API Request Error:', err);
      const endTime = performance.now();
      const requestTime = Math.round(endTime - startTime);
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError;
        let errorMessage = `Error ${axiosError.response?.status || ''}: ${axiosError.message}`;
        
        if (axiosError.message === 'Network Error') {
          errorMessage += " - This could be due to CORS restrictions or the endpoint being unreachable";
          
          if (!data.usesProxy) {
            errorMessage += "\n\nTry enabling the 'Use Proxy' option to avoid CORS issues";
          } else {
            errorMessage += "\n\nMake sure the proxy server is running with 'node start-with-proxy.js'";
          }
        }
        
        setError(errorMessage);
        
        saveToHistory({
          method: data.method,
          url: data.endpoint,
          timestamp: new Date(),
          success: false,
          requestData: data
        });
        
        if (axiosError.response?.data) {
          setResponse(axiosError.response.data);
          setRawResponseInfo({
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            headers: axiosError.response.headers as Record<string, string>,
            time: requestTime
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

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className={`border-r bg-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'}`}>
        <CollectionsSidebar
          isOpen={sidebarOpen}
          history={requestHistory}
          onSelectRequest={loadFromHistory}
        />
      </div>
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={toggleSidebar}>
              {sidebarOpen ? <ArrowRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 rotate-180" />}
            </Button>
            <h1 className="text-xl font-bold">SAP API Tester</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(true)}>
              Help
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <ApiHelpDialog open={showHelp} onOpenChange={setShowHelp} />
          
          <Card className="border shadow-sm">
            <div className="p-4">
              <ApiRequestForm 
                onSubmit={handleSubmit} 
                loading={loading}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </Card>
          
          <ApiResponseDisplay 
            response={response}
            error={error}
            showResponse={showResponse}
            loading={loading}
            rawInfo={rawResponseInfo}
            activeTab={responseTab}
            onTabChange={setResponseTab}
          />
        </div>
      </div>
    </div>
  );
};

export default SapApiTester;
