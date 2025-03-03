import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPlaylist } from '../services/playlistService';
import { PlaylistFormData } from '../types/playlist';
import { useAuthStatus } from '../hooks/UseAuthStatus';

// Form to create a new playlist
// Pretty bare bones right now but gets the job done
const CreatePlaylistPage = (): JSX.Element => {
  const { getAccessTokenSilently } = useAuthStatus();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PlaylistFormData>({
    title: '',
    isPublic: false
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Generic handler for all input types - saves writing multiple handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Needs validation - empty titles shouldn't be allowed
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      // Get auth token - this hook is pretty handy
      const token = await getAccessTokenSilently();

      // Call API to create the playlist
      const newPlaylist = await createPlaylist(formData, token);
      
      // Redirect to the new playlist page
      navigate(`/playlists/${newPlaylist._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create playlist');
      setLoading(false);
      console.error(err);
    }
  };
  
  return (
    <div className="create-playlist-page">
      <h1>Create New Playlist</h1>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit} className="playlist-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
              disabled={loading}
            />
            Make this playlist public
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/playlists')}
            disabled={loading}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Creating...' : 'Create Playlist'}
          </button>
        </div>
      </form>
      
      {/* 
        Future enhancement: add ability to add tracks during creation
        Would need to modify the backend route to accept tracks too
        Probably not worth it for MVP, but would be nice later
      */}
    </div>
  );
};

export default CreatePlaylistPage;