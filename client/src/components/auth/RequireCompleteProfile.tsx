import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/UseAuthStatus';

interface RequireCompleteProfileProps {
  children: ReactNode;
}

// This component ensures the user has completed their profile
// by setting a display name before allowing access to protected content
const RequireCompleteProfile = ({ children }: RequireCompleteProfileProps): JSX.Element => {
  const { userProfile, isLoading } = useAuthStatus();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in but hasn't set a display name yet, redirect to account details
    if (!isLoading && userProfile && !userProfile.displayName) {
      navigate('/account');
    }
  }, [userProfile, isLoading, navigate]);

  // Show loading while checking profile
  if (isLoading) {
    return <div className="loading">Checking profile...</div>;
  }

  // If profile is incomplete, render nothing (since we're redirecting)
  if (userProfile && !userProfile.displayName) {
    return <div className="loading">Redirecting to complete your profile...</div>;
  }

  // Profile is complete, render children
  return <>{children}</>;
};

export default RequireCompleteProfile;