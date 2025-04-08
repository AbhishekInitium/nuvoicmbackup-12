
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getDefaultUsers } from '@/services/auth/userService';

interface SampleUser {
  username: string;
  role: UserRole;
  clientId: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('agent');
  const [clientId, setClientId] = useState('NUVO_01');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sampleUsers, setSampleUsers] = useState<SampleUser[]>([]);
  const [showSampleUsers, setShowSampleUsers] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load sample users
  useEffect(() => {
    setSampleUsers(getDefaultUsers());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !role || !clientId) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const success = await login(username, role, clientId);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: `Welcome, ${username}!`,
        });
        
        // Redirect based on role
        switch (role) {
          case 'admin':
            navigate('/integration');
            break;
          case 'manager':
            navigate('/manager');
            break;
          case 'agent':
            navigate('/agent');
            break;
          case 'finance':
            navigate('/operations');
            break;
          default:
            navigate('/');
        }
      } else {
        toast({
          title: 'Login Failed',
          description: 'Authentication failed. Please check your credentials.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSampleUser = (user: SampleUser) => {
    setUsername(user.username);
    setRole(user.role);
    setClientId(user.clientId);
    setShowSampleUsers(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 space-y-6 bg-white shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">NUVO ICM</h1>
          <p className="text-gray-500 mt-2">Incentive Compensation Management</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Scheme Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
                <SelectItem value="finance">Finance/Ops</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Client ID</Label>
            <Input
              id="clientId"
              placeholder="Enter client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>

          <div className="pt-2">
            <Button 
              type="button" 
              variant="outline"
              className="w-full"
              onClick={() => setShowSampleUsers(!showSampleUsers)}
            >
              {showSampleUsers ? 'Hide' : 'Show'} Sample Users
            </Button>
          </div>
        </form>

        {showSampleUsers && (
          <div className="mt-4 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 font-medium">Sample Test Users</div>
            <div className="divide-y">
              {sampleUsers.map((user, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 cursor-pointer" onClick={() => selectSampleUser(user)}>
                  <div className="font-medium">{user.username}</div>
                  <div className="text-sm text-gray-500">Role: {user.role}</div>
                  <div className="text-sm text-gray-500">Client: {user.clientId}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Login;
