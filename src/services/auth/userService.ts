
import axios from 'axios';
import { User, UserRole } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:3001/api/users';

export interface UserLoginRequest {
  username: string;
  role: UserRole;
  clientId: string;
}

export const loginUser = async (credentials: UserLoginRequest): Promise<User> => {
  try {
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

export const getUserProfile = async (userId: string): Promise<User> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw new Error('Failed to fetch user profile');
  }
};
