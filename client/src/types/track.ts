// client/src/types/track.ts
// Basic model for tracks - nothing fancy since we

export interface Track {
  _id: string;
  trackId: string;
  title: string;
  artist: string;
  addedAt: string; // ISO date string
}

export interface TrackInput {
  title: string;
  artist: string;
}

export interface PlaylistTrack extends Track {
  position?: number; // Optional position in the playlist
}