import { ReactNode, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  // prevent infinite redirects
  useEffect(() => {
    const redirectToLogin = async () => {
      if (!isLoading && !isAuthenticated) {
        // store path to come back after login
        await loginWithRedirect({
          appState: { returnTo: window.location.pathname }
        });
      }
    };
    
    redirectToLogin();
  }, [isAuthenticated, isLoading, loginWithRedirect]);

  if (isLoading) {
    return <div className="auth-loading">Verifying authentication...</div>;
  }

  // if we still arent authenticated, the useEffect will
  if (!isAuthenticated) {
    return <div className="auth-loading">Redirecting to login...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;