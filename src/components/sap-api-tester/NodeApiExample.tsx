
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { callS4HanaApi } from '@/services/node-api/s4HanaNodeClient';

const NodeApiExample: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleNodeApiCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Example call to business partners endpoint
      const data = await callS4HanaApi('/odata/sap/API_BUSINESS_PARTNER/A_BusinessPartner', {
        '$format': 'json',
        '$top': 5
      });
      
      setResult(data);
    } catch (err) {
      console.error('Error in API call:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Node.js API Example</span>
          <Badge variant="outline">Node.js Style</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          This example demonstrates calling the S/4HANA API using a Node.js approach similar to Python's requests library.
        </p>
        
        <Button 
          onClick={handleNodeApiCall} 
          disabled={loading}
          className="mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Calling API...
            </>
          ) : 'Call Business Partners API'}
        </Button>
        
        {error && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-600 my-4">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {result && (
          <div className="mt-4">
            <p className="font-medium mb-2">API Response:</p>
            <pre className="bg-gray-50 p-4 rounded-md text-xs overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NodeApiExample;
