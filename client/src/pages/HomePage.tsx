// Landing page component - first thing users see
// Shows different options based on auth status

import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import TabbedCollectionContainer from '../components/ui-containers/TabbedCollectionContainer';
import PublicPlaylistsPage from './PublicPlaylistsPage';
import UserPlaylistsPage from './UserPlaylistsPage';
import './Home.css';

const HomePage = (): JSX.Element => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const tabs = [
    {
      id: 'public',
      label: 'Public Playlists',
      content: <PublicPlaylistsPage />,
      requiresAuth: false
    },
    {
      id: 'my-playlists',
      label: 'My Playlists',
      content: <UserPlaylistsPage />,
      requiresAuth: true
    }
  ];

  return (
    <div className="home-page">
      <h1>Welcome to Playlist App</h1>
      <p>Create and manage your music playlists</p>
      
      <TabbedCollectionContainer tabs={tabs} defaultTabId="public" />
      
      {!isAuthenticated && (
        <div className="home-actions">
          <button onClick={() => loginWithRedirect()} className="home-button">
            Login to Create Playlists
          </button>
        </div>
      )}

      {isAuthenticated && (
        <div className="home-actions">
          <Link to="/playlists/create" className="home-button">
            Create New Playlist
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;