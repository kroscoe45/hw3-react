import { Track } from './track';

export interface Playlist {
  _id: string;
  title: string;
  isPublic: boolean;
  owner: string;
  tracklist: string[];
  createdAt: string;
  updatedAt: string;
  tracks?: Track[]; // Optional array of resolved track objects
}

export interface PlaylistFormData {
  title: string;
  isPublic: boolean;
}