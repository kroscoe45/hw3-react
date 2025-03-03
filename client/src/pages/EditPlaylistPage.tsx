import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlaylistById, updatePlaylist } from '../services/playlistService';
import { PlaylistFormData } from '../types/playlist';
import { useAuthStatus } from '../hooks/UseAuthStatus';

// Spent way too long debugging this component
// Turns out the issue was on the backend, typical...
const EditPlaylistPage = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAccessTokenSilently, isAuthenticated } = useAuthStatus();
  
  const [title, setTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchPlaylist = async (): Promise<void> => {
      if (!id || !isAuthenticated) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Get token
        const token = await getAccessTokenSilently();
        console.log("Edit page - Got authentication token");
        
        // Fetch playlist data
        const playlistData = await getPlaylistById(id, token);
        console.log("Edit page - Retrieved playlist data:", playlistData);
        
        // Set form values
        setTitle(playlistData.title);
        setIsPublic(playlistData.isPublic);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching playlist:', err);
        setError('Failed to load playlist. Please try again.');
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [id, isAuthenticated, getAccessTokenSilently]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!id || !isAuthenticated) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      console.log("Edit page - Getting token for update");
      const token = await getAccessTokenSilently();
      
      // Validate form - keep this simple
      if (!title.trim()) {
        setError('Title is required');
        setIsSubmitting(false);
        return;
      }
      
      // Prepare update data
      const playlistData: PlaylistFormData = {
        title: title.trim(),
        isPublic,
      };
      
      console.log("Edit page - Updating playlist:", playlistData);
      await updatePlaylist(id, playlistData, token);
      
      // Redirect to playlist detail page
      navigate(`/playlists/${id}`);
    } catch (err) {
      console.error('Error updating playlist:', err);
      setError('Failed to update playlist. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div>Loading playlist...</div>
    );
  }

  return (
    <div className="edit-playlist-page">
      <h1>Edit Playlist</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="playlist-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={isSubmitting}
            />
            Make this playlist public
          </label>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/playlists/${id}`)}
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPlaylistPage;