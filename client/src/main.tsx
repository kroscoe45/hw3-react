// main.tsx
// The app's bootstrap file - where all the magic starts.
// Sets up React DOM, wraps everything in the required providers,
// and kicks off the whole app. Pretty standard React stuff.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import Auth0ProviderWithNavigate from './auth/Auth0Provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <App />
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>
);