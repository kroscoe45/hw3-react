// client/src/components/tracks/AddTrackForm.tsx
import { useState } from 'react';
import { createTrack } from '../../services/trackService.ts';
import { addTrackToPlaylist } from '../../services/playlistService';
import { useAuthStatus } from '../../hooks/UseAuthStatus';

interface AddTrackFormProps {
  playlistId: string;
  onTrackAdded: () => void;
}

const AddTrackForm = ({ playlistId, onTrackAdded }: AddTrackFormProps): JSX.Element => {
  const [title, setTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently } = useAuthStatus();

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!title || !artist) {
      setError('Title and artist are required');
      return;
    }

    try {
      setIsSubmitting(true);
      const token = await getAccessTokenSilently();

      // First create the track
      const newTrack = await createTrack({ title, artist }, token);

      // Then add it to the playlist
      await addTrackToPlaylist(playlistId, newTrack.trackId, token);

      // Reset form and notify parent component
      setTitle('');
      setArtist('');
      onTrackAdded();
    } catch (err) {
      console.error('Error adding track:', err);
      setError('Failed to add track. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-track-form-container">
      <h3>Add New Track</h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="add-track-form">
        <div className="form-group">
          <label htmlFor="track-title">Title</label>
          <input
            id="track-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter track title"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="track-artist">Artist</label>
          <input
            id="track-artist"
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Enter artist name"
            disabled={isSubmitting}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="add-track-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Track'}
        </button>
      </form>
    </div>
  );
};

export default AddTrackForm;