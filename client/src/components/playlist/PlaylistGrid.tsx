// PlaylistsGrid.tsx
import { Playlist } from '../../types/playlist';
import PlaylistCard from './PlaylistCard';
import '../.css/PlaylistCard.css';

interface PlaylistsGridProps {
  playlists: Playlist[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
  showControls?: boolean;
  emptyMessage?: string;
}

const PlaylistsGrid = ({ 
  playlists, 
  isLoading = false, 
  onDelete,
  showControls = false,
  emptyMessage = 'No playlists found'
}: PlaylistsGridProps): JSX.Element => {
  if (isLoading) {
    return (
      <div className="playlists-loading">
        <div className="loading-spinner"></div>
        <p>Loading playlists...</p>
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="playlists-empty">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="playlists-grid">
      {playlists.map(playlist => (
        <PlaylistCard 
          key={playlist._id} 
          playlist={playlist}
          onDelete={onDelete}
          showControls={showControls}
        />
      ))}
    </div>
  );
};

export default PlaylistsGrid;