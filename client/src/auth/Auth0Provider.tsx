// auth/Auth0Provider.tsx
// Wrapper for Auth0 provider that adds navigation support
// Had to add cleanup for persistent auth state inconsistencies
// because users would get stuck at loading screen (what a pain)
import { ReactNode, useEffect, useState } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { auth0Config, isConfigValid } from './auth.config';

interface Auth0ProviderWithNavigateProps {
  children: ReactNode;
}

const Auth0ProviderWithNavigate = ({ children }: Auth0ProviderWithNavigateProps) => {
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  // fix site stuck loading if user used to be logged in
  useEffect(() => {
    const cleanupAuthState = () => {
      // check disagreements in auth state 
      if (localStorage.getItem('auth0.is.authenticated') === 'true' && 
          !sessionStorage.getItem('auth0.is.authenticated')) {
        console.log('Detected inconsistent auth state, cleaning up...');
        // clear em out
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
      }
      setIsInitialized(true);
    };

    cleanupAuthState();
  }, []);

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

  // redirect callback
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

export default Auth0ProviderWithNavigate;