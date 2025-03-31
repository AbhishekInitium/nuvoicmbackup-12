
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { KPIFieldMapping } from '@/services/database/kpiMappingService';
import KpiMappingForm from '@/components/scheme-administrator/KpiMappingForm';
import KpiMappingList from '@/components/scheme-administrator/KpiMappingList';

interface KpiMappingCardProps {
  kpiMappings: KPIFieldMapping[];
  isLoadingMappings: boolean;
  createKpiMapping: (kpiMapping: KPIFieldMapping) => void;
  updateKpiMapping: (id: string, kpiMapping: KPIFieldMapping) => void;
  deleteKpiMapping: (id: string) => void;
  editingKpi: KPIFieldMapping | null;
  startEditingKpi: (kpi: KPIFieldMapping) => void;
  cancelEditingKpi: () => void;
  isCreatingKpi: boolean;
  isUpdatingKpi: boolean;
}

const KpiMappingCard: React.FC<KpiMappingCardProps> = ({
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
}) => {
  const [showForm, setShowForm] = useState(false);

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
        setShowForm(false);
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
    setShowForm(!showForm);
    if (showForm) {
      cancelEditingKpi();
    }
  };

  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>KPI Mapping Table</CardTitle>
          <CardDescription>
            Define KPI fields that will be available to scheme designers
          </CardDescription>
        </div>
        <Button 
          onClick={toggleForm} 
          className="flex items-center"
          variant={showForm ? "secondary" : "default"}
        >
          {showForm ? (
            <>
              <X size={16} className="mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus size={16} className="mr-2" />
              Add New KPI
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-medium mb-4">
              {editingKpi ? `Edit KPI: ${editingKpi.kpiName}` : 'New KPI Mapping'}
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
  );
};

export default KpiMappingCard;
