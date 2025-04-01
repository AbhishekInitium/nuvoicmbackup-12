
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import KpiTable from './KpiTable';
import KpiFormDialog from './KpiFormDialog';
import { KpiField } from '@/types/kpiTypes';

interface KpiMappingCardProps {
  title: string;
  description: string;
  section: string;
  data: KpiField[];
  updateData: (data: KpiField[]) => void;
}

const KpiMappingCard: React.FC<KpiMappingCardProps> = ({
  title,
  description,
  section,
  data,
  updateData
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<KpiField | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddNew = () => {
    setCurrentItem(null);
    setEditIndex(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: KpiField, index: number) => {
    setCurrentItem(item);
    setEditIndex(index);
    setIsFormOpen(true);
  };

  const handleSave = (item: KpiField) => {
    if (editIndex !== null) {
      // Edit existing
      const newData = [...data];
      newData[editIndex] = item;
      updateData(newData);
    } else {
      // Add new
      updateData([...data, item]);
    }
    setIsFormOpen(false);
    setCurrentItem(null);
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    updateData(newData);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="py-3 px-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-md">{title}</CardTitle>
            <CardDescription className="text-xs mt-0">{description}</CardDescription>
          </div>
          <div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <div className="mb-3 flex justify-between items-center">
            <span className="text-xs text-gray-500">Total Items: {data.length}</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs" 
              onClick={handleAddNew}
            >
              <Plus size={14} className="mr-1" /> Add KPI Field
            </Button>
          </div>

          {data.length > 0 ? (
            <KpiTable 
              data={data} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ) : (
            <div className="border border-dashed border-gray-200 rounded-md p-4 text-center text-gray-400 text-sm">
              No KPI fields defined. Click "Add KPI Field" to create one.
            </div>
          )}
        </CardContent>
      )}

      <KpiFormDialog
        open={isFormOpen}
        setOpen={setIsFormOpen}
        initialData={currentItem}
        onSave={handleSave}
        title={editIndex !== null ? "Edit KPI Field" : "Add KPI Field"}
      />
    </Card>
  );
};

export default KpiMappingCard;
