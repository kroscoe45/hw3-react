import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types/user';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStatus = () => {
  const { 
    isAuthenticated, 
    isLoading: isAuth0Loading, 
    loginWithRedirect, 
    logout,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // only fetch user profile if authenticated
    if (isAuthenticated && !userProfile && !isLoadingProfile) {
      const fetchUserProfile = async () => {
        setIsLoadingProfile(true);
        setError(null);
        
        try {
          // get the token directly
          const token = await getAccessTokenSilently();
          
          console.log("Attempting to fetch user profile...");
          try {
            const response = await fetch(`${API_URL}/users/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            if (!response.ok) {
              throw new Error(`Failed with status: ${response.status}`);
            }
            
            const profile = await response.json();
            console.log("Successfully fetched user profile from API");
            setUserProfile(profile);
          } catch (apiError) {
            console.warn(`API request failed: ${apiError}`);
            
            // If API request fails, create profile from Auth0 user data
            if (user) {
              console.log('Creating user profile from Auth0 data');
              const fallbackProfile: User = {
                auth0Id: user.sub || '',
                userId: user.sub || '',
                username: user.name || user.email || 'User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              setUserProfile(fallbackProfile);
            } else {
              throw new Error('No user data available');
            }
          }
        } catch (err) {
          console.error('Error handling user profile:', err);
          setError(err instanceof Error ? err.message : 'Failed to load user profile');
        } finally {
          setIsLoadingProfile(false);
        }
      };

      fetchUserProfile();
    }
  }, [isAuthenticated, userProfile, isLoadingProfile, getAccessTokenSilently, user]);

  // reset profile if logged out / auth changes
  useEffect(() => {
    if (!isAuthenticated && userProfile) {
      setUserProfile(null);
    }
  }, [isAuthenticated, userProfile]);

  return {
    isAuthenticated,
    isLoading: isAuth0Loading || isLoadingProfile,
    userProfile,
    error,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    setUserProfile,
  };
};

export default useAuthStatus;