
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import RequestHistory from './RequestHistory';

interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  success: boolean;
  requestData: any;
}

interface CollectionsSidebarProps {
  isOpen: boolean;
  history: HistoryEntry[];
  onSelectRequest: (entry: HistoryEntry) => void;
}

const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({ 
  isOpen,
  history,
  onSelectRequest
}) => {
  const [activeTab, setActiveTab] = useState('history');
  const [searchQuery, setSearchQuery] = useState('');
  
  if (!isOpen) return null;
  
  // Filter history based on search query
  const filteredHistory = history.filter(entry => 
    entry.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search requests..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="history" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-4 mt-2">
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="flex-1 overflow-y-auto p-4">
          <RequestHistory 
            history={filteredHistory} 
            onSelectRequest={onSelectRequest} 
          />
        </TabsContent>
        
        <TabsContent value="collections" className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <p>No collections saved yet</p>
            <p className="text-sm mt-1">Save requests to collections to organize your API testing</p>
            <Button variant="outline" className="mt-4" disabled>
              Create Collection
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectionsSidebar;
