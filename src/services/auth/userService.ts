
import axios from 'axios';
import { User, UserRole } from '@/contexts/AuthContext';

// Use a single base URL that will work with the consolidated server approach
const API_BASE_URL = 'http://localhost:3001/api/users';

export interface UserLoginRequest {
  username: string;
  role: UserRole;
  clientId: string;
}

export const loginUser = async (credentials: UserLoginRequest): Promise<User> => {
  try {
    console.log(`Attempting login for user ${credentials.username} with client ${credentials.clientId}`);
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Login failed');
  }
};

export const logoutUser = async (userId: string): Promise<void> => {
  try {
    await axios.post(`${API_BASE_URL}/logout`, { userId });
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const getUserProfile = async (userId: string, clientId: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}?clientId=${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw new Error('Failed to fetch user profile');
  }
};

// Default user list for pre-population
export const getDefaultUsers = () => {
  return [
    {
      username: 'admin_user',
      role: 'admin' as UserRole,
      clientId: 'NUVO_01',
      isAuthenticated: true
    },
    {
      username: 'manager_user',
      role: 'manager' as UserRole,
      clientId: 'NUVO_01',
      isAuthenticated: true
    },
    {
      username: 'agent_user',
      role: 'agent' as UserRole,
      clientId: 'NUVO_01',
      isAuthenticated: true
    },
    {
      username: 'finance_user',
      role: 'finance' as UserRole,
      clientId: 'NUVO_01',
      isAuthenticated: true
    }
  ];
};
