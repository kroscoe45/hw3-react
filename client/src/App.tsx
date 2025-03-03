// Main app component - the entry point for everything.
// Just checks if you're logged in and shows the router if you are.

import { useAuth0 } from '@auth0/auth0-react';
import AppRouter from './routes';
import './App.css';

const App = (): JSX.Element => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return <div className="loading">Loading application...</div>;
  }

  if (error) {
    return <div className="error">Authentication Error: {error.message}</div>;
  }

  return <AppRouter />;
};

export default App;