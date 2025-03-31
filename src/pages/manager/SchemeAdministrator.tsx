
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useKpiMappings } from '@/hooks/useKpiMappings';
import KpiMappingForm from '@/components/scheme-administrator/KpiMappingForm';
import ExcelUploader from '@/components/scheme-administrator/ExcelUploader';
import KpiMappingList from '@/components/scheme-administrator/KpiMappingList';
import { KPIFieldMapping } from '@/services/database/kpiMappingService';
import { generateTimestampId } from '@/utils/idGenerators';
import KpiAssignmentList from '@/components/scheme-administrator/KpiAssignmentList';
import { useS4HanaData } from '@/hooks/useS4HanaData';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const SchemeAdministrator: React.FC = () => {
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  
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
    deleteKpiMapping
  } = useKpiMappings();

  const { incentivePlans, loadingPlans } = useS4HanaData();

  // Get currently assigned KPIs for selected scheme
  const { data: schemeMaster } = useKpiMappings().getSchemeMasterBySchemeId(selectedSchemeId);
  const assignedKpis = schemeMaster?.kpiFields || [];

  const handleKpiSubmit = (kpiMapping: KPIFieldMapping) => {
    console.log('Submitting KPI mapping:', kpiMapping);
    createKpiMapping(kpiMapping);
    setShowForm(false); // Hide form after submission
  };

  const handleExcelUpload = (file: File) => {
    console.log('Handling Excel upload in SchemeAdministrator:', file.name);
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

  const handleDeleteKpi = (id: string) => {
    if (window.confirm('Are you sure you want to delete this KPI mapping?')) {
      deleteKpiMapping(id);
    }
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
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>KPI Mapping Table</CardTitle>
                    <CardDescription>
                      Define KPI fields that will be available to scheme designers
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowForm(!showForm)} className="flex items-center">
                    <Plus size={16} className="mr-2" />
                    Add New KPI
                  </Button>
                </CardHeader>
                <CardContent>
                  {showForm && (
                    <div className="mb-8 p-4 border rounded-md bg-gray-50">
                      <h3 className="text-lg font-medium mb-4">New KPI Mapping</h3>
                      <div className="mb-4">
                        <ExcelUploader 
                          onUpload={handleExcelUpload} 
                          isUploading={isUploadingExcel}
                          fileHeaders={fileHeaders}
                        />
                      </div>
                      <KpiMappingForm 
                        onSubmit={handleKpiSubmit}
                        fileHeaders={fileHeaders}
                        isSaving={false}
                      />
                    </div>
                  )}
                  
                  <KpiMappingList 
                    mappings={kpiMappings}
                    isLoading={isLoadingMappings}
                    onDelete={handleDeleteKpi}
                  />
                </CardContent>
              </Card>
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
