import axios from 'axios';
import { User } from '../types';

// In a real application, this would come from environment variables
const API_URL = 'http://localhost:3001/api';

// For demonstration purposes, we'll mock the API calls
// In a real application, you would connect to your backend API
export const fetchUserPreferencesApi = async (userId: string): Promise<User> => {
  try {
    // In a real application:
    // const response = await axios.get(`${API_URL}/users/${userId}/preferences`);
    // return response.data;
    
    // For demonstration, we'll mock the API response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return {
      id: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      preferences: {
        categories: ['technology', 'business'],
        sources: ['Tech Daily', 'Business Weekly']
      }
    };
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    throw new Error('Failed to fetch user preferences');
  }
};

export const updateUserPreferencesApi = async (
  userId: string,
  preferences: Partial<User['preferences']>
): Promise<User> => {
  try {
    // In a real application:
    // const response = await axios.put(`${API_URL}/users/${userId}/preferences`, preferences);
    // return response.data;
    
    // For demonstration, we'll mock the API response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return {
      id: userId,
      name: 'John Doe',
      email: 'john.doe@example.com',
      preferences: {
        categories: preferences.categories || ['technology', 'business'],
        sources: preferences.sources || ['Tech Daily', 'Business Weekly']
      }
    };
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw new Error('Failed to update user preferences');
  }
};