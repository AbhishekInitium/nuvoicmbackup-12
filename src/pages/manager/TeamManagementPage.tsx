
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Upload, RefreshCw } from 'lucide-react';
import NavBar from '@/components/layout/NavBar';
import Container from '@/components/layout/Container';
import TeamHierarchyUpload from '@/components/manager/TeamHierarchyUpload';
import GlassCard from '@/components/ui-custom/GlassCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TeamManagementPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-gray-50 to-white">
      <NavBar />
      
      <div className="py-8">
        <Container>
          <div className="flex items-center mb-6">
            <Link to="/manager">
              <Button variant="ghost" className="mr-2">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-app-gray-900">Team Management</h1>
          </div>
          
          <Tabs defaultValue="hierarchy" className="space-y-8">
            <TabsList className="bg-app-gray-100">
              <TabsTrigger value="hierarchy" className="data-[state=active]:bg-white">
                <Upload className="h-4 w-4 mr-2" /> Hierarchy Upload
              </TabsTrigger>
              <TabsTrigger value="team" className="data-[state=active]:bg-white">
                <Users className="h-4 w-4 mr-2" /> Team Members
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white">
                <RefreshCw className="h-4 w-4 mr-2" /> Change History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="hierarchy" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <TeamHierarchyUpload />
                
                <div className="mt-8">
                  <GlassCard className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload Instructions</h2>
                    <div className="space-y-4">
                      <p className="text-sm text-app-gray-600">
                        The Excel file must contain the following columns:
                      </p>
                      
                      <div className="bg-app-gray-50 p-4 rounded-lg">
                        <ul className="list-disc list-inside text-sm space-y-2">
                          <li><span className="font-medium">Business Partner</span> - Position Holder ID</li>
                          <li><span className="font-medium">Org Level</span> - Hierarchy Level in SAP</li>
                          <li><span className="font-medium">Reports To</span> - Manager Business Partner ID</li>
                          <li><span className="font-medium">Org Level</span> - Manager's Hierarchy Level in SAP</li>
                          <li><span className="font-medium">Effective From Date</span> - Date when this reporting relationship became effective</li>
                        </ul>
                      </div>
                      
                      <p className="text-sm text-app-gray-600">
                        When multiple records exist for the same position holder, the system will use the 
                        effective date to determine the appropriate manager for commission calculations 
                        during specific time periods.
                      </p>
                      
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                        <p className="text-sm text-amber-800">
                          <strong>Important:</strong> Uploading a new hierarchy file will not delete previous 
                          records. The system maintains a complete history of all organizational changes 
                          to ensure accurate commission calculations across time periods.
                        </p>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="team" className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Team Members</h2>
                <p className="text-sm text-app-gray-600 mb-4">
                  View and manage your team members based on the hierarchy data.
                </p>
                
                <div className="bg-app-gray-50 p-12 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Users className="h-16 w-16 text-app-gray-400 mx-auto mb-4" />
                    <h3 className="text-app-gray-600 font-medium">Team Data Not Available</h3>
                    <p className="text-sm text-app-gray-500 mt-1 mb-4">
                      Upload hierarchy data to view your team members
                    </p>
                    <Button>Upload Hierarchy Data</Button>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-6">
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold mb-4">Hierarchy Change History</h2>
                <p className="text-sm text-app-gray-600 mb-4">
                  View the history of all hierarchy changes in the system.
                </p>
                
                <div className="bg-app-gray-50 p-12 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <RefreshCw className="h-16 w-16 text-app-gray-400 mx-auto mb-4" />
                    <h3 className="text-app-gray-600 font-medium">No Changes Recorded</h3>
                    <p className="text-sm text-app-gray-500 mt-1">
                      Hierarchy change history will appear here after uploads
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </Container>
      </div>
    </div>
  );
};

export default TeamManagementPage;
