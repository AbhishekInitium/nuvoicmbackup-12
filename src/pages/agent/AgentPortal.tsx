
import React from 'react';
import { Link } from 'react-router-dom';
import { BadgeDollarSign, TrendingUp, Target, Users, ListChecks, CalendarDays } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import GlassCard from '@/components/ui-custom/GlassCard';
import { SalesCommissionChart } from '@/components/agent/SalesCommissionChart';
import { LeaderboardTable } from '@/components/agent/LeaderboardTable';
import { PerformanceMetrics } from '@/components/agent/PerformanceMetrics';

const AgentPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-8">
        <Container>
          <header className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-app-gray-900">Agent Dashboard</h1>
              <div className="chip-label">Q3 2025</div>
            </div>
            <p className="text-app-gray-600">Welcome back, Alex Morgan</p>
          </header>
          
          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <GlassCard className="bg-blue-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-app-gray-600">YTD Earnings</h3>
                  <BadgeDollarSign className="h-5 w-5 text-app-blue" />
                </div>
                <p className="text-2xl font-bold text-app-gray-900">$128,450</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> +12.3% from last year
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="bg-green-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-app-gray-600">Quota Attainment</h3>
                  <Target className="h-5 w-5 text-app-green" />
                </div>
                <p className="text-2xl font-bold text-app-gray-900">84%</p>
                <p className="text-xs text-app-gray-500 mt-1">
                  $420,000 of $500,000 target
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="bg-purple-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-app-gray-600">Leaderboard Rank</h3>
                  <Users className="h-5 w-5 text-app-purple" />
                </div>
                <p className="text-2xl font-bold text-app-gray-900">#3 of 28</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" /> Up 2 positions this month
                </p>
              </div>
            </GlassCard>
            
            <GlassCard className="bg-amber-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-app-gray-600">Next Payout</h3>
                  <CalendarDays className="h-5 w-5 text-app-orange" />
                </div>
                <p className="text-2xl font-bold text-app-gray-900">Oct 15</p>
                <p className="text-xs text-app-gray-500 mt-1">
                  Estimated: $14,250
                </p>
              </div>
            </GlassCard>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Commission Trends</h2>
                  <SalesCommissionChart />
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Your Performance</h2>
                    <div className="flex items-center text-sm">
                      <span className="text-app-gray-600 mr-2">Period:</span>
                      <select className="text-app-gray-800 bg-app-gray-100 rounded px-2 py-1">
                        <option>This Quarter</option>
                        <option>This Year</option>
                        <option>Last Quarter</option>
                      </select>
                    </div>
                  </div>
                  <PerformanceMetrics />
                </div>
              </GlassCard>
            </div>
            
            {/* Right Column */}
            <div className="space-y-8">
              <GlassCard>
                <div className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Incentive Plan</h2>
                  <div className="text-app-blue font-medium mb-3">North America Sales Plan</div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-app-gray-600">Base Commission</span>
                        <span className="font-medium">3%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-app-gray-600">Tier 1 ($100k+)</span>
                        <span className="font-medium">4%</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-app-gray-600">Q3 Bonus Target</span>
                        <span className="font-medium">$5,000</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-app-gray-200">
                    <Link to="/agent/plan-details" className="text-app-blue text-sm hover:text-app-blue-dark">
                      View full plan details →
                    </Link>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Team Leaderboard</h2>
                    <select className="text-app-gray-800 bg-app-gray-100 rounded px-2 py-1 text-sm">
                      <option>By Revenue</option>
                      <option>By Deals</option>
                    </select>
                  </div>
                  <LeaderboardTable />
                </div>
              </GlassCard>
              
              <GlassCard className="bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Target className="h-5 w-5 text-app-blue mr-2" />
                    <h2 className="text-lg font-semibold">Goal Progress</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-app-gray-700">Quarterly Target</span>
                        <span className="text-sm font-medium">84%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2.5">
                        <div className="bg-app-blue h-2.5 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-app-gray-700">New Accounts</span>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2.5">
                        <div className="bg-app-green h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-app-gray-700">Deal Size</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="w-full bg-white rounded-full h-2.5">
                        <div className="bg-app-purple h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
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

export default AgentPortal;
