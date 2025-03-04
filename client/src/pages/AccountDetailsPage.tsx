import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { User } from '../types/user';
import { getUserProfile } from '../services/authService';
import './AccountDetails.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AccountDetailsPage = (): JSX.Element => {
    const { getAccessTokenSilently, isLoading: authLoading } = useAuth0();
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    
    const [displayName, setDisplayName] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [isInitialSetup, setIsInitialSetup] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
          try {
            setIsLoading(true);
            const token = await getAccessTokenSilently();
            const profile = await getUserProfile(token);
            setUserProfile(profile);
          } catch (err) {
            console.error('Error fetching user profile:', err);
          } finally {
            setIsLoading(false);
          }
        };
    
        fetchUserProfile();
      }, [getAccessTokenSilently]);
    
  // Load current display name when component mounts
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setIsInitialSetup(!userProfile.displayName);
    }
  }, [userProfile]);

  // Validate form
  const validateForm = (): boolean => {
    if (!displayName.trim()) {
      setError('Display name is required');
      return false;
    }
    
    if (displayName.length < 3 || displayName.length > 30) {
      setError('Display name must be between 3 and 30 characters');
      return false;
    }
    
    return true;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const token = await getAccessTokenSilently();
      
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update display name');
      }
      
      // Update local state
      setUserProfile(data);
      setSuccess(true);
      
      // If this was initial setup, redirect to home after successful update
      if (isInitialSetup) {
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update display name');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return <div>Loading profile details...</div>;
  }

  return (
    <div className="account-details-page">
      <h1>{isInitialSetup ? 'Complete Your Profile' : 'Account Details'}</h1>
      
      {isInitialSetup && (
        <div className="setup-message">
          <p>
            Please set a display name to continue. This name will be visible to other users.
          </p>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Profile updated successfully!</div>}
      
      <form onSubmit={handleSubmit} className="account-form">
        {userProfile && (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={userProfile.email || ''}
                disabled
                className="read-only"
              />
              <small>Email cannot be changed</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={userProfile.username || ''}
                disabled
                className="read-only"
              />
              <small>Username is assigned by the system</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="displayName">Display Name*</label>
              <input
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={isSubmitting}
                placeholder="Enter a display name (3-30 characters)"
                minLength={3}
                maxLength={30}
              />
              <small>This name will be visible to other users</small>
            </div>
            
            <div className="form-actions">
              {!isInitialSetup && (
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  disabled={isSubmitting}
                  className="cancel-button"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AccountDetailsPage;