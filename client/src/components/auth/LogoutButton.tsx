import { useAuth0 } from '@auth0/auth0-react';
import { cleanupAuthState } from '../../auth/Auth0Provider';

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
    cleanupAuthState();
    logout({ logoutParams: { returnTo: window.location.origin } });
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