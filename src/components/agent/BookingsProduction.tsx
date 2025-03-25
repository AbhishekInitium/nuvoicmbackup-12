
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown } from 'lucide-react';

const BookingsProduction = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Bookings Production</h3>
        <div className="flex flex-col items-center justify-center h-32">
          <div className="text-3xl font-bold text-cyan-500">$134,567.30</div>
          <div className="flex items-center text-red-500 mt-2">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span>31.1%</span>
          </div>
        </div>
        
        <div className="mt-4 border-t border-app-gray-200 pt-4">
          <h4 className="text-base font-medium mb-2">QTD Bookings Attainment</h4>
          <div className="text-3xl font-bold text-app-gray-800">174.41%</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsProduction;
