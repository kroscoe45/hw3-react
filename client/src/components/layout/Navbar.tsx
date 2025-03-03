// Had so many issues with the navbar alignment
// Fixed it by using a container/content pattern
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import '../.css/Navbar.css';

const Navbar = (): JSX.Element => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } = useAuth0();

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/">Playlist App</Link>
        </div>
        
        <div className="navbar-menu">
          <Link to="/playlists/public">Public Playlists</Link>
          
          {/* Only show these links if user is logged in */}
          {isAuthenticated && (
            <>
              <Link to="/playlists">My Playlists</Link>
              <Link to="/playlists/create">Create Playlist</Link>
            </>
          )}
        </div>
        
        <div className="navbar-auth">
          {isLoading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <div className="user-menu">
              <span>Welcome, {user?.name}</span>
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className="auth-button"
              >
                Logout
              </button>
            </div>
          ) : (
            <button onClick={() => loginWithRedirect()} className="auth-button">
              Login
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

// TODO before final submission:
// - Add active link styling
// - Maybe add a dropdown for user menu
// - Consider adding some logo instead of just text