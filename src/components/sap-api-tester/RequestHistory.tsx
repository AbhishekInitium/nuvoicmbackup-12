
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowRight } from 'lucide-react';

interface HistoryEntry {
  id: string;
  method: string;
  url: string;
  timestamp: Date;
  success: boolean;
  requestData: any;
}

interface RequestHistoryProps {
  history: HistoryEntry[];
  onSelectRequest: (entry: HistoryEntry) => void;
}

const RequestHistory: React.FC<RequestHistoryProps> = ({ history, onSelectRequest }) => {
  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    return new Date(date).toLocaleDateString();
  };
  
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p>No request history yet</p>
        <p className="text-sm">Your recent requests will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((entry) => (
        <div 
          key={entry.id}
          className="border rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => onSelectRequest(entry)}
        >
          <div className="flex items-center justify-between mb-1">
            <Badge 
              variant="outline" 
              className={entry.method === 'GET' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : entry.method === 'POST' 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : entry.method === 'DELETE' 
                    ? 'bg-red-50 text-red-700 border-red-200' 
                    : 'bg-purple-50 text-purple-700 border-purple-200'
              }
            >
              {entry.method}
            </Badge>
            <Badge variant={entry.success ? 'outline' : 'destructive'} className="text-xs">
              {entry.success ? 'Success' : 'Failed'}
            </Badge>
          </div>
          
          <div className="truncate text-sm font-medium mb-1" title={entry.url}>
            {entry.url}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div>{getRelativeTime(entry.timestamp)}</div>
            <ArrowRight className="h-3 w-3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestHistory;
