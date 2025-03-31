
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useKpiMappings } from '@/hooks/useKpiMappings';
import KpiMappingForm from '@/components/scheme-administrator/KpiMappingForm';
import ExcelUploader from '@/components/scheme-administrator/ExcelUploader';
import KpiMappingList from '@/components/scheme-administrator/KpiMappingList';
import { KPIFieldMapping } from '@/services/database/kpiMappingService';
import { generateTimestampId } from '@/utils/idGenerators';
import KpiAssignmentList from '@/components/scheme-administrator/KpiAssignmentList';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SchemeAdministrator: React.FC = () => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  
  const {
    kpiMappings,
    isLoadingMappings,
    availableKpis,
    isLoadingAvailableKpis,
    fileHeaders,
    createKpiMapping,
    uploadExcel,
    isUploadingExcel,
    assignKpisToScheme,
    isAssigningKpis,
  } = useKpiMappings();

  const { incentivePlans, loadingPlans } = useS4HanaData();

  // Get currently assigned KPIs for selected scheme
  const { data: schemeMaster } = useKpiMappings().getSchemeMasterBySchemeId(selectedSchemeId);
  const assignedKpis = schemeMaster?.kpiFields || [];

  const handleKpiSubmit = (kpiMapping: KPIFieldMapping) => {
    createKpiMapping(kpiMapping);
  };

  const handleExcelUpload = (file: File) => {
    uploadExcel(file);
  };

  const handleSchemeChange = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
  };

  const handleAssignKpis = (kpiNames: string[]) => {
    if (selectedSchemeId) {
      assignKpisToScheme(selectedSchemeId, kpiNames);
    }
  };

  // Generate a new scheme ID if creating a new scheme
  const handleNewScheme = () => {
    const newSchemeId = generateTimestampId();
    setSelectedSchemeId(newSchemeId);
    return newSchemeId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      <Container maxWidth="full">
        <div className="py-4 px-8">
          <Link to="/manager/incentive-designer">
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft size={18} className="mr-2" /> Back to Options
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto pb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Scheme Administrator</h1>
          
          <Tabs defaultValue="kpi-mapping">
            <TabsList className="mb-8">
              <TabsTrigger value="kpi-mapping">KPI Field Mapping</TabsTrigger>
              <TabsTrigger value="scheme-setup">Scheme Setup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="kpi-mapping">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Create KPI Field Mapping</CardTitle>
                    <CardDescription>
                      Define KPI fields that will be available to scheme designers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Upload Excel Template</h3>
                        <ExcelUploader 
                          onUpload={handleExcelUpload} 
                          isUploading={isUploadingExcel}
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">KPI Mapping Details</h3>
                        <KpiMappingForm 
                          onSubmit={handleKpiSubmit}
                          fileHeaders={fileHeaders}
                          isSaving={false}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>KPI Field Mappings</CardTitle>
                    <CardDescription>
                      View all defined KPI field mappings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <KpiMappingList 
                      mappings={kpiMappings}
                      isLoading={isLoadingMappings}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="scheme-setup">
              <Card>
                <CardHeader>
                  <CardTitle>Assign KPIs to Scheme</CardTitle>
                  <CardDescription>
                    Select which KPI fields will be available for a specific scheme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Select Scheme</h3>
                      
                      {loadingPlans ? (
                        <div>Loading schemes...</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <Card 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => handleNewScheme()}
                          >
                            <CardContent className="p-6">
                              <div className="text-center">
                                <h3 className="font-medium">+ Create New Scheme</h3>
                                <p className="text-sm text-gray-500">
                                  Set up KPIs for a new scheme
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          
                          {incentivePlans?.map((plan) => (
                            <Card 
                              key={plan.schemeId} 
                              className={`cursor-pointer hover:bg-gray-50 ${
                                selectedSchemeId === plan.schemeId ? 'border-2 border-primary' : ''
                              }`}
                              onClick={() => handleSchemeChange(plan.schemeId)}
                            >
                              <CardContent className="p-6">
                                <div className="text-center">
                                  <h3 className="font-medium">{plan.name}</h3>
                                  <p className="text-sm text-gray-500">
                                    Scheme ID: {plan.schemeId}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {selectedSchemeId && (
                      <div className="pt-6 border-t">
                        <h3 className="text-lg font-medium mb-4">
                          Assign KPIs to Scheme: {selectedSchemeId}
                        </h3>
                        <KpiAssignmentList
                          availableKpis={availableKpis}
                          selectedKpis={assignedKpis}
                          onAssign={handleAssignKpis}
                          isLoading={isLoadingAvailableKpis}
                          isAssigning={isAssigningKpis}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default SchemeAdministrator;
