import { useAuth0 } from '@auth0/auth0-react';

interface LogoutButtonProps {
  className?: string;
  label?: string;
}

const LogoutButton = ({ 
  className = 'logout-button',
  label = 'Log Out'
}: LogoutButtonProps): JSX.Element => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // clean up auth state first to help avoid stuck loading
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth0.')) {
        localStorage.removeItem(key);
      }
    });
    
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith('auth0.')) {
        sessionStorage.removeItem(key);
      }
    });
    
    // Auth0 logout
    logout({
      logoutParams: { 
        returnTo: window.location.origin 
      }
    });
  };

  return (
    <button
      className={className}
      onClick={handleLogout}
    >
      {label}
    </button>
  );
};

export default LogoutButton;