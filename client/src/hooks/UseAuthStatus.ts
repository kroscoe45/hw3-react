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
            console.log("Attempting to fetch user profile with token");
            const response = await fetch(`${API_URL}/users/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            
            // If we get a response, the user should be created in the database
            const profile = await response.json();
            
            if (!response.ok) {
              console.error(`Failed with status: ${response.status}`, profile);
              throw new Error(profile.error || `Failed with status: ${response.status}`);
            }
            
            console.log("Successfully fetched user profile from API");
            setUserProfile(profile);
          } catch (apiError) {
            console.warn(`API request failed: ${apiError}`);
            
            // On first login if there's an issue, retry once
            if ((apiError as Error).message.includes('404')) {
              try {
                console.log('User not found, retrying...');
                // Short delay before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const retryResponse = await fetch(`${API_URL}/users/me`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                
                if (retryResponse.ok) {
                  const profile = await retryResponse.json();
                  console.log("Successfully fetched user profile on retry");
                  setUserProfile(profile);
                  return;
                }
              } catch (retryError) {
                console.error("Retry failed:", retryError);
              }
            }
            
            // If API request fails, create profile from Auth0 user data as fallback
            if (user) {
              console.log('Creating user profile from Auth0 data as fallback');
              const fallbackProfile: User = {
                auth0Id: user.sub || '',
                userId: user.sub || '',
                username: user.name || user.email || 'User',
                email: user.email || '',
                displayName: '',
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