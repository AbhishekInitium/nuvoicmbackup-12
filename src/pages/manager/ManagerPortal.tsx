
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, BadgeDollarSign, Target, PlusCircle, ArrowRight } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import GlassCard from '@/components/ui-custom/GlassCard';
import ActionButton from '@/components/ui-custom/ActionButton';
import { TeamPerformanceChart } from '@/components/manager/TeamPerformanceChart';
import { IncentivePlansList } from '@/components/manager/IncentivePlansList';

const ManagerPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-8">
        <Container>
          <header className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-app-gray-900">Manager Dashboard</h1>
              <div className="chip-label">Q3 2025</div>
            </div>
            <p className="text-app-gray-600">Welcome back, Jennifer Davis</p>
          </header>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link to="/manager/incentive-designer">
              <GlassCard className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-all h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <Settings className="h-5 w-5 text-app-blue mr-2" />
                    <h3 className="font-medium">Design New Plan</h3>
                  </div>
                  <p className="text-sm text-app-gray-600 mb-4">Create a custom incentive plan for your team</p>
                  <div className="mt-auto">
                    <span className="text-sm text-app-blue flex items-center">Start designing <ArrowRight className="ml-1 h-4 w-4" /></span>
                  </div>
                </div>
              </GlassCard>
            </Link>
            
            <Link to="/manager/team">
              <GlassCard className="bg-gradient-to-br from-green-50 to-teal-50 hover:shadow-md transition-all h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-app-green mr-2" />
                    <h3 className="font-medium">Manage Team</h3>
                  </div>
                  <p className="text-sm text-app-gray-600 mb-4">Assign plans and review performance</p>
                  <div className="mt-auto">
                    <span className="text-sm text-app-green flex items-center">View team <ArrowRight className="ml-1 h-4 w-4" /></span>
                  </div>
                </div>
              </GlassCard>
            </Link>
            
            <Link to="/manager/analytics">
              <GlassCard className="bg-gradient-to-br from-purple-50 to-fuchsia-50 hover:shadow-md transition-all h-full">
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-3">
                    <BadgeDollarSign className="h-5 w-5 text-app-purple mr-2" />
                    <h3 className="font-medium">Commission Analytics</h3>
                  </div>
                  <p className="text-sm text-app-gray-600 mb-4">View detailed analytics and forecasts</p>
                  <div className="mt-auto">
                    <span className="text-sm text-app-purple flex items-center">View reports <ArrowRight className="ml-1 h-4 w-4" /></span>
                  </div>
                </div>
              </GlassCard>
            </Link>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Team Performance</h2>
                    <select className="text-app-gray-800 bg-app-gray-100 rounded px-2 py-1 text-sm">
                      <option>Last 6 Months</option>
                      <option>This Year</option>
                      <option>Last Quarter</option>
                    </select>
                  </div>
                  <TeamPerformanceChart />
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Team Quota Attainment</h2>
                    <span className="text-sm text-app-gray-500">Q3 2025</span>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-app-gray-900 font-medium">North America Team</span>
                          <div className="text-sm text-app-gray-500">8 members</div>
                        </div>
                        <div className="text-right">
                          <span className="text-app-gray-900 font-medium">78%</span>
                          <div className="text-sm text-app-gray-500">$1.56M / $2M</div>
                        </div>
                      </div>
                      <div className="w-full bg-app-gray-100 rounded-full h-2.5">
                        <div className="bg-app-blue h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-app-gray-900 font-medium">EMEA Team</span>
                          <div className="text-sm text-app-gray-500">6 members</div>
                        </div>
                        <div className="text-right">
                          <span className="text-app-gray-900 font-medium">92%</span>
                          <div className="text-sm text-app-gray-500">$1.38M / $1.5M</div>
                        </div>
                      </div>
                      <div className="w-full bg-app-gray-100 rounded-full h-2.5">
                        <div className="bg-app-green h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-app-gray-900 font-medium">APAC Team</span>
                          <div className="text-sm text-app-gray-500">5 members</div>
                        </div>
                        <div className="text-right">
                          <span className="text-app-gray-900 font-medium">64%</span>
                          <div className="text-sm text-app-gray-500">$640K / $1M</div>
                        </div>
                      </div>
                      <div className="w-full bg-app-gray-100 rounded-full h-2.5">
                        <div className="bg-app-orange h-2.5 rounded-full" style={{ width: '64%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Incentive Plans</h2>
                    <Link to="/manager/incentive-designer">
                      <ActionButton 
                        variant="outline"
                        size="sm"
                      >
                        <PlusCircle size={16} className="mr-1" /> New Plan
                      </ActionButton>
                    </Link>
                  </div>
                  <IncentivePlansList />
                  
                  <div className="mt-4 pt-4 border-t border-app-gray-200">
                    <Link to="/manager/plans" className="text-app-blue text-sm hover:text-app-blue-dark">
                      View all plans →
                    </Link>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-5 w-5 text-app-orange mr-2" />
                    <h2 className="text-lg font-semibold">Upcoming Payouts</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-app-gray-900 font-medium">October Commissions</div>
                        <div className="text-sm text-app-gray-600">Processing on Oct 15</div>
                      </div>
                      <div className="text-app-gray-900 font-medium">$142,380</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-app-gray-900 font-medium">Q3 Performance Bonus</div>
                        <div className="text-sm text-app-gray-600">Processing on Oct 15</div>
                      </div>
                      <div className="text-app-gray-900 font-medium">$78,500</div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-app-gray-900 font-medium">SPIF: New Product Launch</div>
                        <div className="text-sm text-app-gray-600">Processing on Oct 30</div>
                      </div>
                      <div className="text-app-gray-900 font-medium">$24,750</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-app-gray-300 border-opacity-20">
                    <div className="flex justify-between items-center">
                      <span className="text-app-gray-900 font-medium">Total Upcoming</span>
                      <span className="text-app-gray-900 font-bold">$245,630</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default ManagerPortal;
