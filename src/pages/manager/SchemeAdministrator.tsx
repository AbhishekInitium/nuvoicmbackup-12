
import React, { useState } from 'react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { useKpiMappings } from '@/hooks/useKpiMappings';
import KpiMappingForm from '@/components/scheme-administrator/KpiMappingForm';
import KpiMappingList from '@/components/scheme-administrator/KpiMappingList';
import { KPIFieldMapping } from '@/services/database/kpiMappingService';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

const SchemeAdministrator: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  
  const {
    kpiMappings,
    isLoadingMappings,
    createKpiMapping,
    updateKpiMapping,
    deleteKpiMapping,
    editingKpi,
    startEditingKpi,
    cancelEditingKpi,
    isCreatingKpi,
    isUpdatingKpi
  } = useKpiMappings();

  const handleKpiSubmit = (kpiMapping: KPIFieldMapping) => {
    if (editingKpi && editingKpi._id) {
      // Update existing KPI mapping
      updateKpiMapping(editingKpi._id, kpiMapping);
    } else {
      // Create new KPI mapping
      createKpiMapping(kpiMapping);
    }
    setShowForm(false); // Hide form after submission
  };

  const handleDeleteKpi = (id: string) => {
    if (window.confirm('Are you sure you want to delete this KPI mapping?')) {
      deleteKpiMapping(id);
      // If currently editing this KPI, cancel the edit
      if (editingKpi && editingKpi._id === id) {
        cancelEditingKpi();
      }
    }
  };

  const handleEditKpi = (kpi: KPIFieldMapping) => {
    startEditingKpi(kpi);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    cancelEditingKpi();
    setShowForm(false);
  };

  // Toggle form visibility and reset editing state
  const toggleForm = () => {
    if (showForm && editingKpi) {
      cancelEditingKpi();
    }
    setShowForm(!showForm);
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
          
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>KPI Mapping Table</CardTitle>
                <CardDescription>
                  Define KPI fields that will be available to scheme designers
                </CardDescription>
              </div>
              <Button onClick={toggleForm} className="flex items-center">
                <Plus size={16} className="mr-2" />
                {editingKpi ? 'Cancel Edit' : 'Add New KPI'}
              </Button>
            </CardHeader>
            <CardContent>
              {showForm && (
                <div className="mb-8 p-4 border rounded-md bg-gray-50">
                  <h3 className="text-lg font-medium mb-4">
                    {editingKpi ? 'Edit KPI Mapping' : 'New KPI Mapping'}
                  </h3>
                  <KpiMappingForm 
                    onSubmit={handleKpiSubmit}
                    initialData={editingKpi}
                    isSaving={isCreatingKpi || isUpdatingKpi}
                    onCancel={handleCancelEdit}
                    mode={editingKpi ? 'edit' : 'create'}
                  />
                </div>
              )}
              
              <KpiMappingList 
                mappings={kpiMappings}
                isLoading={isLoadingMappings}
                onDelete={handleDeleteKpi}
                onEdit={handleEditKpi}
              />
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
};

export default SchemeAdministrator;
