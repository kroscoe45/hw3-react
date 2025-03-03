import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicPlaylists } from '../services/playlistService';
import { Playlist } from '../types/playlist';

// This is the main browsing page that anyone can access
// Shows all playlists that users have made public
const PublicPlaylistsPage = (): JSX.Element => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch all public playlists - no auth required
    // This is probably the simplest API call in the app
    const fetchPlaylists = async (): Promise<void> => {
      try {
        const data = await getPublicPlaylists();
        setPlaylists(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load public playlists');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="public-playlists-page">
      <h1>Public Playlists</h1>
      
      {loading ? (
        <p>Loading playlists...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : playlists.length === 0 ? (
        <p>No public playlists found</p>
      ) : (
        <div className="playlists-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="playlist-card">
              <h3>{playlist.title}</h3>
              <p>Tracks: {playlist.tracklist.length}</p>
              <Link to={`/playlists/${playlist._id}`} className="view-button">
                View Playlist
              </Link>
            </div>
          ))}
        </div>
      )}
      
      {/* 
        Would be cool to add sorting/filtering here:
        - By popularity
        - By recently added
        - By number of tracks
        - etc.
      */}
    </div>
  );
};

export default PublicPlaylistsPage;

// This page becomes slow with lots of playlists
// Should probably add pagination or infinite scroll
// Maybe limit initial fetch to most recent 20 playlists?