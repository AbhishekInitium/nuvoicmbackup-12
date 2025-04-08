
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Unauthorized from '@/pages/Unauthorized';
import AgentPortal from '@/pages/agent/AgentPortal';
import ManagerPortal from '@/pages/manager/ManagerPortal';
import IncentiveDesigner from '@/pages/manager/IncentiveDesigner';
import CommissionExecutionEngine from '@/pages/manager/CommissionExecutionEngine';
import TeamManagementPage from '@/pages/manager/TeamManagementPage';
import SapApiTester from '@/pages/SapApiTester';
import IntegrationPortal from '@/pages/integration/IntegrationPortal';
import { PortalProvider } from '@/contexts/PortalContext';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <PortalProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected Routes - Agent */}
              <Route 
                path="/agent" 
                element={
                  <ProtectedRoute allowedRoles={['agent']}>
                    <AgentPortal />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Manager */}
              <Route 
                path="/manager" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <ManagerPortal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/incentive-designer" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <IncentiveDesigner />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/commission-execution" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <CommissionExecutionEngine />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/manager/team" 
                element={
                  <ProtectedRoute allowedRoles={['manager']}>
                    <TeamManagementPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Routes - Admin (Integration) */}
              <Route 
                path="/integration" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <IntegrationPortal />
                  </ProtectedRoute>
                } 
              />
              
              {/* Utility Routes - accessible to specific roles */}
              <Route 
                path="/api-tester" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'manager']}>
                    <SapApiTester />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </PortalProvider>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
