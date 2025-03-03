import { useAuth0 } from '@auth0/auth0-react';

interface LoginButtonProps {
  className?: string;
  label?: string;
}

const LoginButton = ({ 
  className = 'login-button', 
  label = 'Log In' 
}: LoginButtonProps): JSX.Element => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      className={className}
      onClick={() => loginWithRedirect()}
    >
      {label}
    </button>
  );
};

export default LoginButton;