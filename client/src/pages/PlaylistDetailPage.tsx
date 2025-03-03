import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPlaylistWithTracks, deletePlaylist, removeTrackFromPlaylist } from '../services/playlistService';
import { getUserById } from '../services/authService';
import { Playlist } from '../types/playlist';
import { useAuthStatus } from '../hooks/UseAuthStatus';
import TrackList from '../components/tracks/TrackList';
import AddTrackForm from '../components/tracks/AddTrackForm';

// Most complex page in the app - handles a lot of different states
// Shows different UI based on whether user is owner or just viewing
const PlaylistDetailPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently, userProfile, isAuthenticated } = useAuthStatus();
  
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [owner, setOwner] = useState<{ userId: string; username: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  // Function to fetch playlist data - called on initial load and after updates
  // This helped reduce duplicate code in multiple event handlers
  const fetchPlaylistData = async (): Promise<void> => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);

      let token = undefined;
      // Only try to get token if authenticated
      if (isAuthenticated) {
        try {
          token = await getAccessTokenSilently();
          console.log("Got authentication token");
        } catch (tokenError) {
          console.error("Failed to get token:", tokenError);
        }
      }
      
      // Try to fetch playlist with tracks (works for public playlists without token)
      console.log(`Fetching playlist with ID: ${id}, authenticated: ${isAuthenticated}`);
      const playlistData = await getPlaylistWithTracks(id, token);
      setPlaylist(playlistData);
      
      // Fetch owner information
      const ownerData = await getUserById(playlistData.owner);
      setOwner(ownerData);
      
      // Check if current user is the owner
      if (userProfile) {
        setIsOwner(userProfile.userId === playlistData.owner);
      }
      
      setLoading(false);
    } catch (err) {
      // Handle 403 errors specially
      if (err instanceof Error && err.message.includes('permission')) {
        setError('This playlist is private. Please log in if you are the owner.');
      } else {
        setError('Failed to load playlist');
      }
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaylistData();
  }, [id, isAuthenticated, userProfile, getAccessTokenSilently]);

  // Delete the entire playlist
  const handleDelete = async (): Promise<void> => {
    if (!id || !window.confirm('Are you sure you want to delete this playlist?')) {
      return;
    }
    
    try {
      const token = await getAccessTokenSilently();
      await deletePlaylist(id, token);
      navigate('/playlists');
    } catch (err) {
      console.error('Error deleting playlist:', err);
      alert('Failed to delete playlist');
    }
  };

  // Remove a single track from the playlist
  const handleRemoveTrack = async (trackId: string): Promise<void> => {
    if (!id || !isOwner) return;
    
    try {
      const token = await getAccessTokenSilently();
      await removeTrackFromPlaylist(id, trackId, token);
      // Refresh playlist data
      fetchPlaylistData();
    } catch (err) {
      console.error('Error removing track:', err);
      alert('Failed to remove track');
    }
  };

  // Called after a new track is added
  const handleTrackAdded = (): void => {
    fetchPlaylistData();
  };

  if (loading) {
    return (
      <div>Loading playlist...</div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/playlists/public">Back to Public Playlists</Link>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="not-found">
        <h2>Playlist Not Found</h2>
        <Link to="/playlists/public">Back to Public Playlists</Link>
      </div>
    );
  }

  return (
    <div className="playlist-detail-page">
      <div className="playlist-header">
        <h1>{playlist.title}</h1>
        <div className="playlist-meta">
          <p>Created by: {owner?.username || 'Unknown user'}</p>
          <p className="privacy-badge">
            {playlist.isPublic ? 'Public' : 'Private'}
          </p>
        </div>
        
        {/* Only show edit/delete buttons to the owner */}
        {isOwner && (
          <div className="owner-actions">
            <Link to={`/playlists/${playlist._id}/edit`} className="edit-button">
              Edit Playlist
            </Link>
            <button onClick={handleDelete} className="delete-button">
              Delete Playlist
            </button>
          </div>
        )}
      </div>
      
      <div className="playlist-tracks">
        <h2>Tracks</h2>
        
        <TrackList 
          trackIds={playlist.tracklist} 
          isOwner={isOwner}
          onRemoveTrack={handleRemoveTrack}
        />
        
        {/* Only show add track form to the owner */}
        {isOwner && (
          <AddTrackForm 
            playlistId={playlist._id}
            onTrackAdded={handleTrackAdded}
          />
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;

// TODO
// - Add better loading states/spinners
// - Add error handling for network issues