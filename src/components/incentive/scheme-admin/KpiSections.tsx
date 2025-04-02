
import React from 'react';
import { KpiSection } from './KpiSection';
import { KpiField } from '@/types/schemeAdminTypes';

interface KpiSectionsProps {
  kpiData: {
    qualificationFields: KpiField[];
    adjustmentFields: KpiField[];
    exclusionFields: KpiField[];
    customRules: KpiField[];
  };
  onAddKpi: (category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
  onUpdateKpi: (updatedKpi: KpiField) => void;
  onRemoveKpi: (id: string, category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
}

export const KpiSections: React.FC<KpiSectionsProps> = ({
  kpiData,
  onAddKpi,
  onUpdateKpi,
  onRemoveKpi
}) => {
  return (
    <div className="space-y-6">
      <KpiSection
        title="Qualification KPIs"
        kpiFields={kpiData.qualificationFields}
        category="qualification"
        onAddKpi={onAddKpi}
        onUpdateKpi={onUpdateKpi}
        onRemoveKpi={onRemoveKpi}
      />
      
      <KpiSection
        title="Adjustment KPIs"
        kpiFields={kpiData.adjustmentFields}
        category="adjustment"
        onAddKpi={onAddKpi}
        onUpdateKpi={onUpdateKpi}
        onRemoveKpi={onRemoveKpi}
      />
      
      <KpiSection
        title="Exclusion KPIs"
        kpiFields={kpiData.exclusionFields}
        category="exclusion"
        onAddKpi={onAddKpi}
        onUpdateKpi={onUpdateKpi}
        onRemoveKpi={onRemoveKpi}
      />
      
      <KpiSection
        title="Custom Rule KPIs"
        kpiFields={kpiData.customRules}
        category="custom"
        onAddKpi={onAddKpi}
        onUpdateKpi={onUpdateKpi}
        onRemoveKpi={onRemoveKpi}
      />
    </div>
  );
};
