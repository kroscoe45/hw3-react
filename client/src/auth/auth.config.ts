export const auth0Config = {
    domain:       import.meta.env.VITE_AUTH0_DOMAIN     || '',
    clientId:     import.meta.env.VITE_AUTH0_CLIENT_ID  || '',
    audience:     import.meta.env.VITE_AUTH0_AUDIENCE   || '',
    redirectUri:  window.location.origin,
    scope:        'openid profile email',
  };
  
  export const isConfigValid = (): boolean => {
    return Boolean(
      auth0Config.domain    && 
      auth0Config.clientId  && 
      auth0Config.audience
    );
  };
  
  export const getConfig = (): typeof auth0Config => {
    if (!isConfigValid()) {
      console.error('Auth0 configuration screwed up');
    }
    return auth0Config;
  };