
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Sample data for top sellers
const topSellers = [
  { id: 1, name: 'Mike Summers', amount: 134567.30, rank: 4, avatar: '/lovable-uploads/c90c90eb-5444-4a80-b289-a4aecdc43521.png' },
  { id: 2, name: 'Andrew Brown', amount: 129175.65, rank: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 3, name: 'Audrey Clark', amount: 123864.48, rank: 6, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
];

const TopSellers = () => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Sellers</h3>
        <div className="space-y-3">
          {topSellers.map((seller) => (
            <div key={seller.id} className="flex items-center justify-between p-2 hover:bg-app-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-app-gray-100">
                  <img 
                    src={seller.avatar} 
                    alt={seller.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-app-gray-900">{seller.name}</h4>
                  <p className="text-sm text-app-gray-600">${seller.amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-app-blue text-white rounded-full w-7 h-7 flex items-center justify-center font-medium">
                {seller.rank}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopSellers;
