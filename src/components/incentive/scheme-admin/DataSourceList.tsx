
import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface DataSource {
  name: string;
  description: string;
  connectionDetails: string;
}

interface DataSourceListProps {
  dataSources: DataSource[];
  setDataSources: (dataSources: DataSource[]) => void;
}

const DataSourceList: React.FC<DataSourceListProps> = ({ dataSources, setDataSources }) => {
  const addDataSource = () => {
    setDataSources([...dataSources, { name: '', description: '', connectionDetails: '' }]);
  };

  const updateDataSource = (index: number, field: string, value: string) => {
    const updatedDataSources = [...dataSources];
    updatedDataSources[index][field] = value;
    setDataSources(updatedDataSources);
  };

  const removeDataSource = (index: number) => {
    const updatedDataSources = [...dataSources];
    updatedDataSources.splice(index, 1);
    setDataSources(updatedDataSources);
  };

  return (
    <div className="space-y-4">
      {dataSources.map((dataSource, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Data Source {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-name`}>Name</Label>
              <Input
                type="text"
                id={`dataSource-${index}-name`}
                placeholder="Data Source Name"
                value={dataSource.name}
                onChange={(e) => updateDataSource(index, 'name', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-description`}>Description</Label>
              <Textarea
                id={`dataSource-${index}-description`}
                placeholder="Data Source Description"
                value={dataSource.description}
                onChange={(e) => updateDataSource(index, 'description', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={`dataSource-${index}-connectionDetails`}>Connection Details</Label>
              <Textarea
                id={`dataSource-${index}-connectionDetails`}
                placeholder="Connection Details"
                value={dataSource.connectionDetails}
                onChange={(e) => updateDataSource(index, 'connectionDetails', e.target.value)}
              />
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeDataSource(index)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Remove
            </Button>
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" onClick={addDataSource}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Data Source
      </Button>
    </div>
  );
};

export default DataSourceList;
