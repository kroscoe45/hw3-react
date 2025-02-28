import { TrackId } from './track';
export type PlaylistId = string;

export interface playlist {
  id: PlaylistId;
  name: string;
  trackIds: TrackId[];
  createdAt: string;
}

