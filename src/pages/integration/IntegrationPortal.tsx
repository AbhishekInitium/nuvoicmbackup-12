
import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import LogoutButton from '@/components/auth/LogoutButton';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Server, Link2, Users, Workflow } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import SchemeAdministratorScreen from '@/components/incentive/scheme-admin/SchemeAdministratorScreen';

const IntegrationPortal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSchemeAdmin, setShowSchemeAdmin] = useState(false);

  const handleGoToSchemeAdmin = () => {
    setShowSchemeAdmin(true);
  };

  const handleBackToPortal = () => {
    setShowSchemeAdmin(false);
  };

  const handleApiTesterClick = () => {
    navigate('/api-tester');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {showSchemeAdmin ? "Scheme Administration" : "Integration Portal"}
          </h1>
          {user && <LogoutButton />}
        </div>

        {showSchemeAdmin ? (
          <SchemeAdministratorScreen onBack={handleBackToPortal} />
        ) : (
          <div className="space-y-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="data-mapping">Data Mapping</TabsTrigger>
                <TabsTrigger value="administration">Administration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Settings className="mr-2 h-5 w-5" />
                        Scheme Configuration
                      </CardTitle>
                      <CardDescription>
                        Configure and manage incentive schemes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-gray-600">
                        Create and manage KPI configurations, field mappings, and calculation rules for incentive schemes.
                      </p>
                      <Button onClick={handleGoToSchemeAdmin}>
                        Open Scheme Administrator
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Server className="mr-2 h-5 w-5" />
                        API Testing
                      </CardTitle>
                      <CardDescription>
                        Test S/4HANA API connections
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-gray-600">
                        Verify API connections to S/4HANA and test data retrieval for sales organization structures, order data, and more.
                      </p>
                      <Button onClick={handleApiTesterClick} variant="outline">
                        Open API Tester
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest integration and scheme administration activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center text-gray-500">
                        <span className="inline-block w-24 text-xs text-gray-400">2 hours ago</span>
                        <span>KPI Mapping configuration updated for North America Sales</span>
                      </p>
                      <p className="text-sm flex items-center text-gray-500">
                        <span className="inline-block w-24 text-xs text-gray-400">1 day ago</span>
                        <span>S/4HANA API connection test successful</span>
                      </p>
                      <p className="text-sm flex items-center text-gray-500">
                        <span className="inline-block w-24 text-xs text-gray-400">2 days ago</span>
                        <span>New scheme field mapping created for Order Revenue calculation</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Integrations</CardTitle>
                    <CardDescription>
                      Configure connections to external systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <Database className="h-5 w-5 mr-2 text-blue-500" />
                          <div>
                            <h3 className="font-medium">SAP S/4HANA</h3>
                            <p className="text-sm text-gray-500">Primary ERP connection</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <Link2 className="h-5 w-5 mr-2 text-green-500" />
                          <div>
                            <h3 className="font-medium">Excel Data Sources</h3>
                            <p className="text-sm text-gray-500">Manual data import</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-purple-500" />
                          <div>
                            <h3 className="font-medium">HR System</h3>
                            <p className="text-sm text-gray-500">Employee data</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Configure</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="data-mapping" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Field Mapping</CardTitle>
                    <CardDescription>
                      Map source system fields to incentive scheme KPIs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        Create and manage mappings between source system fields and incentive scheme KPI definitions.
                      </p>
                      <Button onClick={handleGoToSchemeAdmin}>Configure Field Mappings</Button>
                    </div>
                    
                    <div className="border rounded-lg p-3 mt-6">
                      <h3 className="font-medium mb-2">Recent Field Maps</h3>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3 gap-2 text-gray-500">
                          <div>SAP.VBAK.NETWR</div>
                          <div className="flex items-center">
                            <Workflow className="h-3 w-3 mx-2" />
                            <span>maps to</span>
                          </div>
                          <div>Order_Value</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-500">
                          <div>SAP.VBAK.ERDAT</div>
                          <div className="flex items-center">
                            <Workflow className="h-3 w-3 mx-2" />
                            <span>maps to</span>
                          </div>
                          <div>Creation_Date</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-gray-500">
                          <div>SAP.KNA1.KUNNR</div>
                          <div className="flex items-center">
                            <Workflow className="h-3 w-3 mx-2" />
                            <span>maps to</span>
                          </div>
                          <div>Customer_ID</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="administration" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Administration</CardTitle>
                    <CardDescription>
                      Manage system settings and user access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Scheme Administrator Settings</h3>
                          <p className="text-sm text-gray-500">Configure and manage KPI settings</p>
                        </div>
                        <Button onClick={handleGoToSchemeAdmin} variant="outline">Open</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">API Tester</h3>
                          <p className="text-sm text-gray-500">Test API connections</p>
                        </div>
                        <Button onClick={handleApiTesterClick} variant="outline">Open</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Data Cleanup</h3>
                          <p className="text-sm text-gray-500">Clean and reset test data</p>
                        </div>
                        <Button variant="outline">Execute</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegrationPortal;
