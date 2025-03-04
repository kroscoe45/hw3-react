import { ReactNode, useEffect, useState } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { auth0Config, isConfigValid } from './auth.config';

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

// Create the cleanup function 
const cleanupAuthState = (): void => {
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
};

const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const checkAuthState = () => {
      if (localStorage.getItem('auth0.is.authenticated') === 'true' &&
          !sessionStorage.getItem('auth0.is.authenticated')) {
        console.log('Detected inconsistent auth state, cleaning up...');
        cleanupAuthState();
      }
      setIsInitialized(true);
    };
    checkAuthState();
  }, []);

  // Rest of the component remains the same
  if (!isConfigValid()) {
    return (
      <div className="auth-error">
        <h2>Authentication Error</h2>
        <p>Auth0 configuration is incomplete. Please check your environment variables.</p>
      </div>
    );
  }

  if (!isInitialized) {
    return <div>Initializing authentication...</div>;
  }

  const onRedirectCallback = (appState: any) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: auth0Config.redirectUri,
        audience: auth0Config.audience,
        scope: auth0Config.scope
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
      useRefreshTokens={true}
    >
      {children}
    </Auth0Provider>
  );
};

// Export both the component and the cleanup function
export { Auth0ProviderWithNavigate, cleanupAuthState }
