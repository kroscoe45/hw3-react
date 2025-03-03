// client/src/components/tracks/TrackList.tsx
import { useState, useEffect } from 'react';
import { Track } from '../../types/track';
import { getTracksByIds } from '../../services/trackService';
import TrackItem from './TrackItem';
import { useAuthStatus } from '../../hooks/UseAuthStatus';

interface TrackListProps {
  trackIds: string[];
  isOwner: boolean;
  onRemoveTrack?: (trackId: string) => Promise<void>;
}

const TrackList = ({ trackIds, isOwner, onRemoveTrack }: TrackListProps): JSX.Element => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuthStatus();

  useEffect(() => {
    const fetchTracks = async (): Promise<void> => {
      if (trackIds.length === 0) {
        setTracks([]);
        setLoading(false);
        return;
      }

      try {
        let token: string | undefined = undefined;
        
        // try to get token if authenticated
        if (isAuthenticated) {
          token = await getAccessTokenSilently();
        }

        const fetchedTracks = await getTracksByIds(trackIds, token);
        
        // create a map for quick track lookup
        const trackMap = fetchedTracks.reduce<Record<string, Track>>(
          (map: Record<string, Track>, track: Track) => {
            map[track.trackId] = track;
            return map;
          }, 
          {}
        );
        
        // Maintain the order of tracks as specified in trackIds
        const orderedTracks = trackIds
          .map(id => trackMap[id])
          .filter(track => !!track);
        
        setTracks(orderedTracks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tracks:', err);
        setError('Failed to load tracks');
        setLoading(false);
      }
    };

    fetchTracks();
  }, [trackIds, isAuthenticated, getAccessTokenSilently]);

  const handleRemoveTrack = async (trackId: string): Promise<void> => {
    if (onRemoveTrack) {
      try {
        await onRemoveTrack(trackId);
        // parent component should update the trackIds prop and trigger a re-fetch
      } catch (err) {
        console.error('Error removing track:', err);
      }
    }
  };

  if (loading) {
    return <div className="track-list-loading">Loading tracks...</div>;
  }

  if (error) {
    return <div className="track-list-error">{error}</div>;
  }

  if (tracks.length === 0) {
    return <div className="track-list-empty">No tracks in this playlist yet</div>;
  }

  return (
    <div className="track-list">
      <div className="track-list-header">
        <div className="track-header-number">#</div>
        <div className="track-header-info">TITLE / ARTIST</div>
        <div className="track-header-added">DATE ADDED</div>
        {isOwner && <div className="track-header-actions">ACTIONS</div>}
      </div>
      
      <div className="track-list-items">
        {tracks.map((track, index) => (
          <TrackItem
            key={track.trackId}
            track={track}
            index={index}
            isOwner={isOwner}
            onRemove={onRemoveTrack ? handleRemoveTrack : undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default TrackList;