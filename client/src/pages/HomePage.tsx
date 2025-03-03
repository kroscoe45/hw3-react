// Landing page component - first thing users see
// Shows different options based on auth status

import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import './Home.css';

const HomePage = (): JSX.Element => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  return (
    <div className="home-page">
      <h1>Welcome to Playlist App</h1>
      <p>Create and manage your music playlists</p>
      
      <div className="home-actions">
        <Link to="/playlists/public" className="action-button">
          Browse Public Playlists
        </Link>
        
        {isAuthenticated ? (
          <Link to="/playlists" className="action-button">
            My Playlists
          </Link>
        ) : (
          <button onClick={() => loginWithRedirect()} className="action-button">
            Login to Create Playlists
          </button>
        )}
      </div>

      {/* 
        Should probably add some kind of featured playlist section here
        Would make the homepage less empty
      */}
    </div>
  );
};

export default HomePage;