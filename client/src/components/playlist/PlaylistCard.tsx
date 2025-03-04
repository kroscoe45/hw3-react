// PlaylistCard.tsx
import { Link } from 'react-router-dom';
import { Playlist } from '../../types/playlist';
import '../.css/PlaylistCard.css';

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete?: (id: string) => void;
  showControls?: boolean;
}

const PlaylistCard = ({ playlist, onDelete, showControls = false }: PlaylistCardProps): JSX.Element => {
  // Calculate track count description
  const trackCount = playlist.tracklist?.length || 0;
  const trackText = trackCount === 1 ? '1 track' : `${trackCount} tracks`;
  
  return (
    <div className="playlist-card">
      <div className="playlist-card-content">
        <div className="playlist-card-header">
          <h3 className="playlist-title">
            <Link to={`/playlists/${playlist._id}`}>
              {playlist.title}
            </Link>
          </h3>
          {playlist.isPublic && <span className="visibility-badge public">Public</span>}
          {!playlist.isPublic && <span className="visibility-badge private">Private</span>}
        </div>
        
        <div className="playlist-meta">
          <span className="track-count">{trackText}</span>
          <span className="dot-separator">•</span>
          <span className="creation-date">
            {new Date(playlist.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      {showControls && (
        <div className="playlist-card-actions">
          <Link to={`/playlists/${playlist._id}/edit`} className="edit-button">
            Edit
          </Link>
          {onDelete && (
            <button 
              onClick={() => onDelete(playlist._id)} 
              className="delete-button"
              aria-label="Delete playlist"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistCard;