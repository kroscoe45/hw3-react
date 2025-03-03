import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserPlaylists } from '../services/playlistService';
import { Playlist } from '../types/playlist';
import { useAuthStatus } from '../hooks/UseAuthStatus';

// This page shows all playlists created by the current user
// Protected via the ProtectedRoute component in routes/index.tsx
const UserPlaylistsPage = (): JSX.Element => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuthStatus();

  useEffect(() => {
    // Fetch all playlists owned by the current user
    // Had to debug this because token expiration was causing silent failures
    const fetchUserPlaylists = async (): Promise<void> => {
      try {
        const token = await getAccessTokenSilently();
        const data = await getUserPlaylists(token);
        setPlaylists(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load your playlists');
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserPlaylists();
  }, [getAccessTokenSilently]);

  return (
    <div className="user-playlists-page">
      <div className="page-header">
        <h1>My Playlists</h1>
        <Link to="/playlists/create" className="create-button">
          Create New Playlist
        </Link>
      </div>
      
      {loading ? (
        <p>Loading your playlists...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : playlists.length === 0 ? (
        <div className="empty-state">
          <p>You haven't created any playlists yet</p>
          <Link to="/playlists/create" className="create-button">
            Create Your First Playlist
          </Link>
        </div>
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card">
              <h3>{playlist.title}</h3>
              <p>Tracks: {playlist.tracklist.length}</p>
              <p className="privacy-badge">
                {playlist.isPublic ? 'Public' : 'Private'}
              </p>
              <div className="playlist-actions">
                <Link to={`/playlists/${playlist._id}`} className="view-button">
                  View
                </Link>
                <Link to={`/playlists/${playlist._id}/edit`} className="edit-button">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPlaylistsPage;

// TODO:
// - Add sorting options (by name, by creation date, etc)
// - Add search functionality 
// - Add pagination for users with lots of playlists