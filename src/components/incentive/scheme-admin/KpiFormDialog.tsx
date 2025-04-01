
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { KpiField } from '@/types/kpiTypes';

interface KpiFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData: KpiField | null;
  onSave: (data: KpiField) => void;
  title: string;
}

const KpiFormDialog: React.FC<KpiFormDialogProps> = ({
  open,
  setOpen,
  initialData,
  onSave,
  title
}) => {
  const [formData, setFormData] = useState<KpiField>({
    kpi: '',
    description: '',
    sourceType: 'SAP',
    sourceField: '',
    dataType: 'Number',
    api: ''
  });

  // Reset form when dialog opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        kpi: '',
        description: '',
        sourceType: 'SAP',
        sourceField: '',
        dataType: 'Number',
        api: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="kpi">KPI Identifier</Label>
              <Input
                id="kpi"
                name="kpi"
                value={formData.kpi}
                onChange={handleChange}
                placeholder="e.g., SoAmount"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Human-readable name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceType">Source Type</Label>
              <Select
                value={formData.sourceType}
                onValueChange={handleSelectChange('sourceType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAP">SAP</SelectItem>
                  <SelectItem value="External">External</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="dataType">Data Type</Label>
              <Select
                value={formData.dataType}
                onValueChange={handleSelectChange('dataType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Number">Number</SelectItem>
                  <SelectItem value="String">String</SelectItem>
                  <SelectItem value="Date">Date</SelectItem>
                  <SelectItem value="Boolean">Boolean</SelectItem>
                  <SelectItem value="Char4">Char4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sourceField">Source Field</Label>
              <Input
                id="sourceField"
                name="sourceField"
                value={formData.sourceField}
                onChange={handleChange}
                placeholder="e.g., VBRP-NETWR"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Actual field name from source system
              </p>
            </div>
            <div>
              <Label htmlFor="api">API Endpoint (optional)</Label>
              <Input
                id="api"
                name="api"
                value={formData.api}
                onChange={handleChange}
                placeholder="e.g., /sales/orders"
              />
              <p className="text-xs text-gray-500 mt-1">
                SAP API endpoint to fetch this data
              </p>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KpiFormDialog;
