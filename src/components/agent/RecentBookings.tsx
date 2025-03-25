
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';

// Sample data for recent bookings
const recentBookings = [
  { id: 1, date: '9/3/19', orderID: 'O1000045', productID: '701301214', value: 11309.80, status: 'New Inquiry' },
  { id: 2, date: '9/1/19', orderID: 'O1000099', productID: '701401', value: 9597.60, status: 'New Inquiry' },
];

const RecentBookings = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Bookings</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Filter"
              className="pl-8 pr-3 py-1 text-sm border border-app-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-app-blue"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-app-gray-400" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-app-gray-200">
                <th className="text-left py-2 text-sm font-medium text-app-gray-600">Comp Date</th>
                <th className="text-left py-2 text-sm font-medium text-app-gray-600">Order ID</th>
                <th className="text-left py-2 text-sm font-medium text-app-gray-600">Product ID</th>
                <th className="text-left py-2 text-sm font-medium text-app-gray-600">Value</th>
                <th className="text-left py-2 text-sm font-medium text-app-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-app-gray-100">
                  <td className="py-2 text-sm">{booking.date}</td>
                  <td className="py-2 text-sm">{booking.orderID}</td>
                  <td className="py-2 text-sm">{booking.productID}</td>
                  <td className="py-2 text-sm">${booking.value.toLocaleString()}</td>
                  <td className="py-2 text-sm">
                    <button className="text-app-blue hover:underline">
                      {booking.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentBookings;
