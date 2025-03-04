// Had so many issues with the navbar alignment
// Fixed it by using a container/content pattern
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserProfile } from '../../services/authService';
import { User } from '../../types/user';
import '../.css/Navbar.css';
import { useState, useEffect } from 'react';

const Navbar = (): JSX.Element => {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isDev = import.meta.env.MODE === 'development';
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getAccessTokenSilently();
        const userProfile = await getUserProfile(token);
        setUser(userProfile);
      } catch (error) {
        console.error(error);
      }
    };
    
    if (isAuthenticated) {
      fetchUser();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  const handleDeleteAllPlaylists = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch('/api/dev/cleanup/playlists', {
        method: 'DELETE'
      });
      
      const result = await response.json();
      alert(`Success: ${result.message} (${result.count} playlists deleted)`);
    } catch (error) {
      console.error('Error deleting playlists:', error);
      alert('Failed to delete playlists. See console for details.');
    } finally {
      setIsDeleting(false);
    }
  };

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
          
          {/* Dev-only button */}
          {isDev && (
            <button 
              onClick={handleDeleteAllPlaylists} 
              disabled={isDeleting}
              className="dev-button"
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete All Playlists'}
            </button>
          )}
        </div>
        
        <div className="navbar-auth">
          {isLoading ? (
            <span>Loading...</span>
          ) : isAuthenticated ? (
            <div className="user-menu">
                <span>Welcome, {user?.displayName || user?.username}</span>
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