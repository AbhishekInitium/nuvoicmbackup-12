
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Reminder = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Reminder</h3>
        <div className="text-sm text-app-gray-800">
          <p className="mb-2">
            All Q4 deal documents must be accepted by Friday, September 27, 2019. All QA payments will be held until signature.
          </p>
          <p className="mt-4">
            If you have any questions, please contact 
            <a href="#" className="text-app-blue ml-1 hover:underline">
              sales@support.com
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reminder;
