
import React from 'react';
import { Button } from '@/components/ui/button';
import { KpiField } from '@/types/schemeAdminTypes';
import { KpiMappingCard } from './KpiMappingCard';

interface KpiSectionProps {
  title: string;
  kpiFields: KpiField[];
  category: 'qualification' | 'adjustment' | 'exclusion' | 'custom';
  onAddKpi: (category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
  onUpdateKpi: (updatedKpi: KpiField) => void;
  onRemoveKpi: (id: string, category: 'qualification' | 'adjustment' | 'exclusion' | 'custom') => void;
}

export const KpiSection: React.FC<KpiSectionProps> = ({
  title,
  kpiFields,
  category,
  onAddKpi,
  onUpdateKpi,
  onRemoveKpi
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <Button 
          type="button"
          onClick={() => onAddKpi(category)}
          size="sm"
          variant="outline"
        >
          Add {title}
        </Button>
      </div>
      
      <div className="space-y-4">
        {kpiFields.length === 0 ? (
          <p className="text-gray-500 italic text-sm">
            No {title.toLowerCase()} defined yet. Click the button above to add one.
          </p>
        ) : (
          kpiFields.map(kpi => (
            <KpiMappingCard 
              key={kpi.id} 
              kpi={kpi} 
              onUpdate={onUpdateKpi} 
              onRemove={onRemoveKpi} 
            />
          ))
        )}
      </div>
    </div>
  );
};
