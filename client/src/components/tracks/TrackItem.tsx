// client/src/components/tracks/TrackItem.tsx
import { Track } from '../../types/track';

interface TrackItemProps {
  track: Track;
  index: number;
  isOwner: boolean;
  onRemove?: (trackId: string) => void;
}

const TrackItem = ({ track, index, isOwner, onRemove }: TrackItemProps): JSX.Element => {
  const handleRemove = (): void => {
    if (onRemove) {
      onRemove(track.trackId);
    }
  };

  return (
    <div className="track-item">
      <div className="track-number">{index + 1}</div>
      <div className="track-info">
        <div className="track-title">{track.title}</div>
        <div className="track-artist">{track.artist}</div>
      </div>
      <div className="track-added">
        {new Date(track.addedAt).toLocaleDateString()}
      </div>
      {isOwner && onRemove && (
        <button 
          className="remove-track-button" 
          onClick={handleRemove}
          aria-label="Remove track"
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default TrackItem;