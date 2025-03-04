// services/authService.ts
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service for handling authentication-related operations
 * Provides methods for token retrieval and user profile management
 */

// Custom hook to check if user is authenticated and get token
export const useAuthToken = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const getToken = async (): Promise<string | null> => {
    if (!isAuthenticated) {
      return null;
    }
    
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };
  
  return { isAuthenticated, getToken };
};

// Get user profile from API
export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

// Update username
export const updateUsername = async (username: string): Promise<User> => {
  const { getAccessTokenSilently } = useAuth0();
  
  try {
    const token = await getAccessTokenSilently();
    
    // Use the /users/me endpoint that matches your backend
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update username');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in updateUsername:', error);
    throw error;
  }
};

// Get public user profile by userId
export const getUserById = async (userId: string): Promise<{ userId: string; username: string }> => {
  // Using your public endpoint
  const response = await fetch(`${API_URL}/users/${userId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json();
};