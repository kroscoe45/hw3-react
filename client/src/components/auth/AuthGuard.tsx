import { ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingComponent?: ReactNode;
}

const AuthGuard = ({ 
  children, 
  fallback,
  loadingComponent
}: AuthGuardProps): JSX.Element => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return loadingComponent ? (
      <>{loadingComponent}</>
    ) : (
      <div className="auth-loading">Verifying authentication...</div>
    );
  }

  if (!isAuthenticated) {
    return fallback ? <>{fallback}</> : <></>;
  }

  return <>{children}</>;
};

export default AuthGuard;