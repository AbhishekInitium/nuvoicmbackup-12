
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CurrentPeriodPayment = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Current Period Payment</h3>
        <div className="text-center mb-2">
          <p className="text-3xl font-bold text-app-gray-900">$13,037.02</p>
          <p className="text-sm text-app-gray-600">Payment</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center p-4 border-r border-app-gray-200">
            <p className="text-xl font-semibold text-app-gray-900">$0.00</p>
            <p className="text-sm text-app-gray-600">Prior Balance Applied</p>
          </div>
          
          <div className="text-center p-4">
            <p className="text-xl font-semibold text-app-gray-900">$13,037.02</p>
            <p className="text-sm text-app-gray-600">Earnings This Period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentPeriodPayment;
